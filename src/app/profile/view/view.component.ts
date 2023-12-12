import { Component } from '@angular/core';
import { viewdat, Viewdata, doclist, doctorlist } from './view.data';
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

function calculatePercentageCompletion(obj: any, doc: any): string {
  let totalFields = 0;
  let filledFields = 0;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      totalFields++;

      // Check if the key is "image" and the value is "assests/images/users/user.svg"
      if (key === 'image' && obj[key] === 'assets/images/users/user.svg') {
        // Reduce the filledFields count by 1
        filledFields--;
      } else if (obj[key] !== null) {
        filledFields++;
      }
    }
  }

  if (doc) {
    filledFields++;
  }

  filledFields--;

  return String(
    totalFields === 0
      ? 0
      : Number(((filledFields / totalFields) * 100).toFixed(0))
  );
}

function convertNullValues(data: any) {
  const convertedData = {};

  for (const key in data) {
    if (data[key] === null) {
      // Check the type of the original value and assign the appropriate replacement
      convertedData[key] = typeof data[key] === 'number' ? 0 : 'None';
    } else {
      convertedData[key] = data[key];
    }
  }

  return convertedData;
}
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  OrderDetails: Viewdata[];
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
  ) {
    this.OrderDetails = viewdat;
  }

  ngOnInit(): void {
    // user
    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userId = userToken;
    this.userType = fullName;

    // console.log(this.userId, this.accessToken, this.userType);
    this.docDetailsSubscription = this.authservice
      .getalldoc(this.userId)
      .subscribe(
        (res: any) => {
          this.docdetails = res;
          // console.log(this.docdetails['doctor']);
          this.doc_data = this.docdetails['doctor'];
          console.log('data', this.doc_data);
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

    //user details
    this.userDetailsSubscription = this.authservice
      .getUserDetails(this.userId)
      .subscribe(
        (res: any) => {
          this.UserDetails = res;
          // console.log('My details', this.UserDetails['profile']);
          const userObject = this.UserDetails['profile'];
          const percentageCompletion: string = calculatePercentageCompletion(
            userObject,
            this.doc_count
          );
          userObject.profilecompletionpercentage = percentageCompletion;
          this.userdata = convertNullValues(userObject);
          if (this.userdata['image'] != 'assets/images/users/user.svg') {
            this.img_uploaded = true;
          }
          if (this.userdata['gst'] != 'None') {
            this.gst_no = true;
          }

          this.user_data = [this.userdata];
          // console.log(this.user_data);
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );

    //data

    //form
    this.form = this.formBuilder.group({
      Doctor_name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  //form submit
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
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
      console.log('Hi');
      this.filteredData = this.doc_data.filter((item) => {
        // console.log('My data', this.filteredData);
        // Customize the filtering logic as needed
        return (
          item.clinicid.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.doctorid.includes(this.searchText) ||
          item.doctorname.includes(this.searchText)
        );
      });
    } else {
      this.filteredData = this.doc_data; // If searchText is empty, show all data
    }
  }
}
