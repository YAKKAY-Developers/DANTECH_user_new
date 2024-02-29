import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';

import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-add-doctors',
  templateUrl: './add-doctors.component.html',
  styleUrls: ['./add-doctors.component.scss'],
})
export class AddDoctorsComponent {
  user_data: any;
  viewdatalist: any[] = [];
  // doctor list
  docdetails: any;
  doc_count = false;
  doc_data: any;
  docDetailsSubscription: Subscription;
  //search table
  searchText: string = '';
  filteredData: any[] = [];
  sortcolumn: string = '';
  sortDirection: string = 'asc';
  // adddoctors form
  form: FormGroup;
  loading = false;
  submitted = false;
  resut: any;
  // authenticate user
  stat_user: string;
  userId: string;
  userType: string;
  accessToken: string;
  userToken: any;
  userdata: any;
  UserDetails: any;
  userDetailsSubscription: Subscription;
  userObject: void;
  // check prescence
  gst_no = false;
  img_uploaded = false;

  isModalVisible = false;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private userservice: UserService,
    private orderservice: OrderService
  ) {}

  ngOnInit(): void {
    // user
    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { status } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userId = userToken;
    this.userType = fullName;
    

  //user details
    this.userDetailsSubscription = this.userservice
      .getUserDetails(this.userId)
      .subscribe(
        (res: any) => {
          this.UserDetails = res;
          const userObject = this.UserDetails['profile'];
          this.user_data = [this.userdata];
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );

    //doc data
    this.docDetailsSubscription = this.userservice
      .getalldoc(this.userId)
      .subscribe(
        (res: any) => {
          this.docdetails = res;
          this.doc_data = this.docdetails['doctor'];
          if (this.doc_data['length'] > 0) {
            this.doc_count = true;
          }
          this.filteredData = this.doc_data;
          console.log("DOctor count",this.doc_count );
        },
        (error: any) => {
          console.log('Error fetching doc details:', error);
        }
      );


    //form
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      specialisation: ['', [Validators.required]],
    });
  }
  get f() {
    return this.form.controls;
  }

  //form submit
  onSubmit() {

    this.submitted = true;
    console.log(this.submitted)


    if (this.form.invalid) {
      console.log(this.form.controls);
      return;
    }
    this.loading = true;
    this.userservice
      .addConsultant(this.userId, this.accessToken, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          this.loading = false;
          console.log(error)
        },
      });
  }



  sortColumn(column: string) {
    // Check if the column is already sorted
    if (this.sortcolumn === column) {
      // If the same column is clicked again, toggle the sorting order
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If a different column is clicked, set the sorting column and direction
      this.sortcolumn = column;
      this.sortDirection = 'asc'; // Default to ascending order
    }

    // Sort the filtered data based on the chosen column and direction
    this.filteredData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (this.sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  filterData() {
    if (this.searchText) {
   
      this.filteredData = this.doc_data.filter((item: any) => {

        return (
          item.doctorid.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Firstname.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          item.Lastname.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Specialisation.toLowerCase().includes(
            this.searchText.toLowerCase()
          )

        );
      });
    } 
    
    else {
      this.filteredData = this.doc_data; // If searchText is empty, show all data
    }
  }
}
