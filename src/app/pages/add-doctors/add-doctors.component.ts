import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authservice: AuthService
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

    // console.log(this.userId, this.accessToken, this.userType);

    //user details
    this.userDetailsSubscription = this.authservice
      .getUserDetails(this.userId)
      .subscribe(
        (res: any) => {
          this.UserDetails = res;
          // console.log('My details', this.UserDetails['profile']);
          const userObject = this.UserDetails['profile'];
          // if (this.userdata['image'] != 'assets/images/users/user.svg') {
          //   this.img_uploaded = true;
          // }
          // if (this.userdata['gst'] != 'None') {
          //   this.gst_no = true;
          // }

          this.user_data = [this.userdata];
          // console.log(this.user_data);
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );

    //doc data
    this.docDetailsSubscription = this.authservice
      .getalldoc(this.userId)
      .subscribe(
        (res: any) => {
          this.docdetails = res;
          // console.log(this.docdetails['doctor']);
          this.doc_data = this.docdetails['doctor'];
          // console.log('data', this.doc_data);
          if (this.doc_data['length'] > 0) {
            this.doc_count = true;
          }
          this.filteredData = this.doc_data;
          console.log(this.filteredData);
        },
        (error: any) => {
          console.log('Error fetching doc details:', error);
        }
      );
    //form
    this.form = this.formBuilder.group({
      First_name: ['', [Validators.required, Validators.minLength(3)]],
      Last_name: ['', [Validators.required, Validators.minLength(1)]],
      Specialisation: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  get f() {
    return this.form.controls;
  }

  //form submit
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      console.log(this.form.controls);
      return;
    }
    this.loading = true;
    this.authservice
      .adddoctor(this.form.value, this.userId)
      .pipe(first())
      .subscribe({
        next: () => {
          // this.router.navigate(['/det/profile/view']);
          window.location.reload();
        },
        error: (error) => {
          // this.alertService.error(error);
          this.loading = false;
        },
      });
  }

  //table doctors
  //sort coloumn
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
      // console.log('Hi');
      this.filteredData = this.doc_data.filter((item: any) => {
        // console.log('My data', this.filteredData);
        // Customize the filtering logic as needed
        return (
          item.doctorid.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Firstname.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          item.Lastname.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Specialisation.toLowerCase().includes(
            this.searchText.toLowerCase()
          )
          // .includes(this.searchText)
        );
      });
    } else {
      this.filteredData = this.doc_data; // If searchText is empty, show all data
    }
  }
}
