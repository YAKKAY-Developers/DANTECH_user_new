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
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
})
export class BankDetailsComponent {
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
          this.userdata = convertNullValues(userObject);
          if (this.userdata['image'] != 'assets/images/users/user.svg') {
            this.img_uploaded = true;
          }
          if (this.userdata['gst'] != 'None') {
            this.gst_no = true;
          }

          this.user_data = [this.userdata];
          console.log('data', this.user_data);
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );
  }
}
