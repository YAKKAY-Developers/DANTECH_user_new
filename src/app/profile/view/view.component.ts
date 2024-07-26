
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
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';


function calculatePercentageCompletion(userObject: any): number {
  const totalFields = 4; // Total number of arrays
  let filledFields = 0;

  // Check user array
  if (
    userObject.user.firstName &&
    userObject.user.lastName &&
    userObject.user.email &&
    userObject.user.mobileNumber
  ) {
    filledFields++;
  }

  // Check basicInfo array
  if (
    userObject.basicInfo.address &&
    userObject.basicInfo.city &&
    userObject.basicInfo.pincode &&
    userObject.basicInfo.country 
    //&&
    //userObject.basicInfo.photo
  ) {
    filledFields++;
  }

  // Check bankInfo array
  if (
    userObject.bankInfo.bankacNumber &&
    userObject.bankInfo.ifsc &&
    userObject.bankInfo.bankBranch &&
    userObject.bankInfo.upiId &&
    userObject.bankInfo.gst
  ) {
    filledFields++;
  }

  // Check consultantInfo array
  if (userObject.consultantInfo && 
    userObject.consultantInfo.length > 0) 
    {
    filledFields++;
  }

  // Calculate percentage completion
  return (filledFields / totalFields) * 100;
}


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {


  accessToken: any;
  userToken: any;

  //search table
  searchText: string = '';
  filteredData: any[] = [];
  sortcolumn: string = '';
  sortDirection: string = 'asc';



  doc_data: any;

  //api results
  result: any
  basicInfo: any;
  bankInfo: any
  response: any;
  consultantDetails: any;
  consultantCount: any;

  //From AAthi's code

  userDetailsSubscription: Subscription;
  userdata: any;
  img_uploaded = false;
  gst_no = false;
  user_data: any;


  profileCompletionPercentage: number;



  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private userservice: UserService,
    private orderservice: OrderService,

  ) { }

  ngOnInit() {

    // user
    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userToken = userToken;


    //Get user details:
    this.userDetailsSubscription = this.userservice.getOneUserDetails(this.userToken, this.accessToken)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.response = res.userDetails;
          this.result = res.userDetails.user;
          this.basicInfo = res.userDetails.basicInfo;
          this.bankInfo = res.userDetails.bankInfo;
          this.consultantDetails = res.userDetails.consultantInfo;
          this.consultantCount = this.consultantDetails.length;
          this.user_data = this.response;
          this.profileCompletionPercentage = calculatePercentageCompletion(this.user_data);
          console.log("Checking:", this.user_data);
        },
        error: (error) => {
          console.log(error.error)
        }
      })
      
  }



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
        return (
          item.clinicid.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.doctorid.includes(this.searchText) ||
          item.doctorname.includes(this.searchText)
        );
      });
    } else {
      this.filteredData = this.response; // If searchText is empty, show all data
    }
  }


}

