import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { ViewChild, ElementRef } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';

import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DisableRightClickService } from 'src/app/services/disable-right-click.service';
import { ToasterService } from 'src/app/services/toaster.service';

export function fileExtensionValidator(allowedExtensions: string[]) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const file = control.value as File;
    if (!file) {
      return null; // If there's no file, return no error
    }

    let extension = file.name.split('.').pop();
    extension = extension ? extension.toLowerCase() : '';

    if (!allowedExtensions.includes(extension)) {
      return { invalidExtension: true };
    }

    return null;
  };
}

export function getSelectedOptions(question: any): string {
  const selectedOptions: string[] = [];
  const type1Array = this.form.get(question) as FormArray;

  type1Array.controls.forEach((control: AbstractControl) => {
    if (control.value) {
      selectedOptions.push(control.value);
    }
  });

  return selectedOptions.join(','); // Convert the array to a string separated by commas
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('formElement') formElement: ElementRef;
  @ViewChild('screenshotCanvas') screenshotCanvas: ElementRef;

  //form
  form: FormGroup;
  loading = false;
  submitted = false;
  clinicid: any;
  phone_number: any;
  clinic_name: any;
  descriptions: any;

  // authenticate user
  user_data: any;
  // stat_user: string;
  userId: string;
  userType: string;
  accessToken: string;
  userToken: any;
  userdata: any;
  UserDetails: any;
  userDetailsSubscription: Subscription;
  userObject: void;
  form_values: any;
  //form
  selectedOption: string = '';
  add_comments = 'Nill!';
  // check prescence
  gst_no = false;
  stat_user = 'AC2000';
  img_uploaded = false;
  //date
  today_date: any;
    // doctor list
    docdetails: any;
    doc_count = false;
    doc_data: any;
    docDetailsSubscription: Subscription;

    selectedTeeth: { [key: string]: boolean } = {}; // Declare selectedTeeth here

     //api results
  result: any
  clinicFullName:any
  basicInfo: any;
  bankInfo: any
  response: any;
  consultantDetails: any;
  consultantCount: any;

  //  selectedTeeth: { [key: string]: boolean } = {}; // Declare selectedTeeth here


  // questions
  type1Checkboxes = [
    'Wax-Up',
    'Crown',
    'Veener',
    'Inlay',
    'Bridge',
    'Onlay',
    'Endocrown',
    'Temp/interim',
  ];
  type2Checkboxes = [
    'Screw',
    'Cement',
    'Access Hole',
    'Implant crown- Zr /PEM',
    'Custom/ Pre-Milled Abutment',
    'Implant Supported Overdenture Bar',
    'Hybrid Denture- Screw Retained(Cr.Co)',
    'Hybrid Denture- Screw Retained(Ti)',
    'Malo Framework with Zr crowns (Ti)',
  ];
  type3Checkboxes = [
    'Dantech Reg',
    'Dantech Premium',
    'Dantech Premium Plus',
    'IPS E max Zircard',
  ];
  type4Checkboxes = [
    'Special Tray',
    'Wax Rim',
    'Try In',
    'Processing',
    'Complete Denture',
    'Tooth Supported Overdenture',
    'Reline',
    'Repair',
  ];
  type5Checkboxes = [
    'Acrylic',
    'CAD/CAM PEEK',
    'BPS',
    'Cast Partial Frame Work',
    'CAD/CAM Denture',
    '3D Printed Denture',
  ];
  type6Checkboxes = [
    'Twin Block',
    'RME Appliance',
    "Hawley's Appliance",
    'Mouth Guard',
    'Essix Retainer',
  ];
  type7Checkboxes = ['Press', 'CAD'];
  type8Checkboxes = ['Dantech PFM', 'Dantech Metal'];
  type9Checkboxes = [
    'Pilot Guide',
    'Fully Guided(Exoplan)',
    'Surgical Guide DTX/Co-Diagnostix',
  ];
  type10Checkboxes = ['Vital', 'Non-Vital', 'Composite', 'Metal'];
  type11Checkboxes = ['Imp', 'Bite', 'Photos'];
  type12Checkboxes = ['Lap Analog', 'Abut', 'Castables'];
  type13Checkboxes = ['Low', 'Regular', 'High'];
  type14Checkboxes = ['Low', 'Regular', 'High'];
  type15Checkboxes = ['Low', 'Regular', 'High'];
  type16Checkboxes = ['No', 'Low', 'High', 'Follow adjacent tooth texture'];
  type19Checkboxes = ['Sanitary', 'FullRidge', 'Modified', 'Bullet', 'Ovate'];
  myuserOrderDetailsSubscription: Subscription;
  orderToken: any;
  myUserresult: any;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userservice: UserService,
    private orderservice: OrderService,
    private toaster :ToasterService
  ) {}

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  

  ngOnInit(): void {
    const selectedTeeth: { [key: string]: boolean } = {}; // Object to store selected teeth states
    const toothNumberElement: HTMLElement = document.querySelector('.tooth-number');
  
 

    document.querySelectorAll('.tooth').forEach((toothElement) => {
      toothElement.addEventListener('click', (event) => {
        const $this = event.currentTarget as HTMLElement;
        const toothText: string = $this.getAttribute('data-title');
        const isSelected: boolean = this.selectedTeeth[toothText] || false;
  
        if (!isSelected) {
          this.selectedTeeth[toothText] = true;
          $this.classList.add('active');
        } else {
          delete this.selectedTeeth[toothText];
          $this.classList.remove('active');
        }
  
        this.updateNextStepButton(this.selectedTeeth, toothNumberElement);
      });
    });
  
    this.today_date = this.getTodayDate();
    this.initializeForm();
    this.populateCheckboxes();
  
    // Get user details
    const { userToken, fullName, accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userToken = userToken;



       // Retrieve token from route parameters
       this.route.params.subscribe((params) => {
        this.orderToken = params['id'];
        console.log("OrderToken", this.orderToken);
      });

      


      
    this.result = {};
    this.basicInfo = {};
    this.bankInfo = {};
    this.consultantDetails = {};
  
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
          console.log("Checking:", this.result);
        },
        error: (error) => {
          console.log(error.error)
        }
      })



      this.myuserOrderDetailsSubscription = this.userservice.getOneUserOrderDetails(this.userToken, this.accessToken, this.orderToken)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.myUserresult = res.userOrders;
     
     
          console.log("Result:", this.myUserresult)
       
         },
        error: (error) => {
          console.log(error.error)
        }
      })



  }
  
  updateNextStepButton(selectedTeeth: { [key: string]: boolean }, toothNumberElement: HTMLElement): void {
    const selectedTeethCount = Object.values(selectedTeeth).filter(Boolean).length;
  
    if (toothNumberElement) {
      if (selectedTeethCount > 0) {
        toothNumberElement.classList.remove('disabled');
        toothNumberElement.setAttribute('data-nextStep', `${selectedTeethCount}`);
        toothNumberElement.innerHTML = `Selected: ${selectedTeethCount} &times;`;
      } else {
        toothNumberElement.classList.add('disabled');
        toothNumberElement.removeAttribute('data-nextStep');
        toothNumberElement.innerHTML = 'test &times;';
      }
    }
  
    console.log('Selected teeth:', selectedTeeth);
  }
  


  ngAfterViewInit(): void {
    // Use setTimeout as a temporary solution to ensure asynchronous data is processed
    setTimeout(() => {
      this.populateCheckboxes();
    }, 0);
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
     
      consultantName:['', Validators.required],
      regNumber:['',Validators.required],
      phoneNumber: ['', Validators.required],
      clinicName:['',Validators.required],
      patientname: ['',Validators.required],
      patientage: ['',Validators.required],
      regId: ['', [Validators.required]],
      service: ['', [Validators.required]],
      orderDate: ['', [Validators.required]],
      requiredDate: ['', [Validators.required]],
      priority:['', Validators.required],
      patientGender: ['', [Validators.required]],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
       
      ],
      
      type1: this.formBuilder.array(
        this.type1Checkboxes.map(() => false),
        Validators.required
      ),
      type2: this.formBuilder.array(
        this.type2Checkboxes.map(() => false),
        Validators.required
      ),
      type3: this.formBuilder.array(
        this.type3Checkboxes.map(() => false),
        Validators.required
      ),
      type4: this.formBuilder.array(
        this.type4Checkboxes.map(() => false),
        Validators.required
      ),
      type5: this.formBuilder.array(
        this.type5Checkboxes.map(() => false),
        Validators.required
      ),
      type6: this.formBuilder.array(
        this.type6Checkboxes.map(() => false),
        Validators.required
      ),
      type7: this.formBuilder.array(
        this.type7Checkboxes.map(() => false),
        Validators.required
      ),
      type8: this.formBuilder.array(
        this.type8Checkboxes.map(() => false),
        Validators.required
      ),
      type9: this.formBuilder.array(
        this.type9Checkboxes.map(() => false),
        Validators.required
      ),
      type10: this.formBuilder.array(
        this.type10Checkboxes.map(() => false),
        Validators.required
      ),
      type11: this.formBuilder.array(
        this.type11Checkboxes.map(() => false),
        Validators.required
      ),
      type12: this.formBuilder.array(
        this.type12Checkboxes.map(() => false),
        Validators.required
      ),
      type13: this.formBuilder.array(
        this.type13Checkboxes.map(() => false),
        Validators.required
      ),
      type14: this.formBuilder.array(
        this.type14Checkboxes.map(() => false),
        Validators.required
      ),
      type15: this.formBuilder.array(
        this.type15Checkboxes.map(() => false),
        Validators.required
      ),
      type16: this.formBuilder.array(
        this.type16Checkboxes.map(() => false),
        Validators.required
      ),
      type18: ['', [Validators.required, Validators.maxLength(700)]],
      type19: this.formBuilder.array(
        this.type19Checkboxes.map(() => false),
        Validators.required
      ),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from observable to avoid memory leaks
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }

  populateCheckboxes(): void {
    const type1Array = this.form.get('type1') as FormArray;
    const type2Array = this.form.get('type2') as FormArray;
    const type3Array = this.form.get('type3') as FormArray;
    const type4Array = this.form.get('type4') as FormArray;
    const type5Array = this.form.get('type5') as FormArray;
    const type6Array = this.form.get('type6') as FormArray;
    const type7Array = this.form.get('type7') as FormArray;
    const type8Array = this.form.get('type8') as FormArray;
    const type9Array = this.form.get('type9') as FormArray;
    const type10Array = this.form.get('type10') as FormArray;
    const type11Array = this.form.get('type11') as FormArray;
    const type12Array = this.form.get('type12') as FormArray;
    const type13Array = this.form.get('type13') as FormArray;
    const type14Array = this.form.get('type14') as FormArray;
    const type15Array = this.form.get('type15') as FormArray;
    const type16Array = this.form.get('type16') as FormArray;
    const type19Array = this.form.get('type19') as FormArray;

  
  }



  get f() {
    return this.form.controls;
  }

  onSubmit() {
  
  }

  submit() {
      
    window.alert('File submitted');

    this.router.navigate(['/pages/casedetail']);
  }

 
}

