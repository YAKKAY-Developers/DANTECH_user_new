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
  selector: 'app-bank-form',
  templateUrl: './bank-form.component.html',
  styleUrls: ['./bank-form.component.scss']
})
export class BankFormComponent {
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

  // profile image
  loadFile(event: any) {
    const target = event.target as HTMLInputElement;
    const image = document.getElementById('output') as HTMLImageElement;
    console.log(event);
    this.selected_image = event.target.files[0];
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      image.src = URL.createObjectURL(target.files[0]);

     
    }
  }
  

  ngOnInit() {
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


    this.form = this.formBuilder.group({
      bankacNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(16),
          Validators.pattern('[0-9]{9,18}'),
        ],
      ],
      ifsc: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Za-z]{4}0[0-9]{6}$'),
        ],
      ],
      bankBranch: ['', [Validators.required]],
      upiId: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,}'),
        ],
      ],
      gst: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
          ),
        ],
      ],
    });

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

  get f() {
    return this.form.controls;
  }

  onSubmit() {
  
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.userservice.updateBankInfo(this.userToken, this.accessToken, this.form.value, )
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/det/profile/view']);
        },
        error: (error) => {
          // this.alertService.error(error);
          this.loading = false;
        },
      });

    this.router.navigate(['/det/profile/view']);
  }

}
