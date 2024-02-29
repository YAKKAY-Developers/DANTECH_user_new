import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DisableRightClickService } from 'src/app/services/disable-right-click.service';


@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
})
export class BankDetailsComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  selected_image = null;
  stat_user: string;
  userType: string;
  accessToken: string;
  userToken: any;

  // authenticate user
  userdata: any;
  UserDetails: any;
  userDetailsSubscription: Subscription;
  userObject: void;
  doc_count = false;
  user_data: any;

  // check prescence
  gst_no = false;
  img_uploaded = false;


   //api results
   result: any
   basicInfo: any;
   bankInfo: any
   response: any;
   consultantDetails: any;
   consultantCount: any;
   fullName:any


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private http: HttpClient,
    private userservice: UserService,
    private orderservice: OrderService,
    private rightClickDisable: DisableRightClickService
  ) {}

  ngOnInit(): void {

    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { status } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userToken = userToken;
    this.userType = fullName;
    this.stat_user = status;
   

    this.rightClickDisable.disableRightClick();

    // Initialize result here
    this.bankInfo = { bankacNumber: '' }; // or initialize with appropriate default values
    this.bankInfo ={ bankBranch:''};
    this.bankInfo ={ ifsc:''};

    this.bankInfo = { upiId: '' };
    this.bankInfo = { gst: '' };



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
         this.consultantCount = this.consultantDetails.lengt
         this.user_data = this.response;
         console.log( this.response)
       },
       error: (error) => {
         console.log(error.error)
       }
     })
  }
}
