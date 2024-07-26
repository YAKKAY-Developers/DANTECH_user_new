
///Second version 2

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
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';


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
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})


export class CreateOrderComponent implements OnInit, AfterViewInit, OnDestroy {
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


  //File image upload
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  //previews: string[] = [];
  previews: { src: string, type: string }[] = [];
  imageInfos?: Observable<any>;



  //Image 
 
  fileNames: string[] = [];


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
  workflowResult: any;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userservice: UserService,
    private orderservice: OrderService,
    private toasterService :ToasterService,
    private uploadService: FileUploadService
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



      this.userservice.getAllWorkflowUser(this.userToken, this.accessToken).pipe(first())
      .subscribe({
        next: (res) => {
          this.workflowResult = res.getallworkflow;
          console.log("Checking:", this.workflowResult);
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
      // doctor_name: ['', Validators.required],
      firstName:['', Validators.required],
      lastName:['',Validators.required],
      fullName: ['', Validators.required],
      registerNumber:['',Validators.required],
      patientname: [
        '',
        [
          Validators.required,
        ],
      ],
      regId: ['', [Validators.required]],
      service: ['', [Validators.required]],
      orderDate: ['', [Validators.required]],
      requiredDate: ['', [Validators.required]],
      patientage: [
        '',
        [
          Validators.required,
          Validators.max(100),
          Validators.min(18),
          Validators.pattern('[0-9]+'),
        ],
      ],
      priority:[''],
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
        // Validators.required
      ),
      type2: this.formBuilder.array(
        this.type2Checkboxes.map(() => false),
        // Validators.required
      ),
      type3: this.formBuilder.array(
        this.type3Checkboxes.map(() => false),
        // Validators.required
      ),
      type4: this.formBuilder.array(
        this.type4Checkboxes.map(() => false),
        // Validators.required
      ),
      type5: this.formBuilder.array(
        this.type5Checkboxes.map(() => false),
        // Validators.required
      ),
      type6: this.formBuilder.array(
        this.type6Checkboxes.map(() => false),
        // Validators.required
      ),
      type7: this.formBuilder.array(
        this.type7Checkboxes.map(() => false),
        // Validators.required
      ),
      type8: this.formBuilder.array(
        this.type8Checkboxes.map(() => false),
        // Validators.required
      ),
      type9: this.formBuilder.array(
        this.type9Checkboxes.map(() => false),
        // Validators.required
      ),
      type10: this.formBuilder.array(
        this.type10Checkboxes.map(() => false),
        // Validators.required
      ),
      type11: this.formBuilder.array(
        this.type11Checkboxes.map(() => false),
        // Validators.required
      ),
      type12: this.formBuilder.array(
        this.type12Checkboxes.map(() => false),
        // Validators.required
      ),
      type13: this.formBuilder.array(
        this.type13Checkboxes.map(() => false),
        // Validators.required
      ),
      type14: this.formBuilder.array(
        this.type14Checkboxes.map(() => false),
        // Validators.required
      ),
      type15: this.formBuilder.array(
        this.type15Checkboxes.map(() => false),
        // Validators.required
      ),
      type16: this.formBuilder.array(
        this.type16Checkboxes.map(() => false),
        // Validators.required
      ),
      type18: ['', [Validators.required, Validators.maxLength(700)]],
      type19: this.formBuilder.array(
        this.type19Checkboxes.map(() => false),
        // Validators.required
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

    this.type1Checkboxes.forEach(() =>
      type1Array.push(this.formBuilder.control(false))
    );
    this.type2Checkboxes.forEach(() =>
      type2Array.push(this.formBuilder.control(false))
    );
    this.type3Checkboxes.forEach(() =>
      type3Array.push(this.formBuilder.control(false))
    );
    this.type4Checkboxes.forEach(() =>
      type4Array.push(this.formBuilder.control(false))
    );
    this.type5Checkboxes.forEach(() =>
      type5Array.push(this.formBuilder.control(false))
    );
    this.type6Checkboxes.forEach(() =>
      type6Array.push(this.formBuilder.control(false))
    );
    this.type7Checkboxes.forEach(() =>
      type7Array.push(this.formBuilder.control(false))
    );
    this.type8Checkboxes.forEach(() =>
      type8Array.push(this.formBuilder.control(false))
    );
    this.type9Checkboxes.forEach(() =>
      type9Array.push(this.formBuilder.control(false))
    );
    this.type10Checkboxes.forEach(() =>
      type10Array.push(this.formBuilder.control(false))
    );
    this.type11Checkboxes.forEach(() =>
      type11Array.push(this.formBuilder.control(false))
    );
    this.type12Checkboxes.forEach(() =>
      type12Array.push(this.formBuilder.control(false))
    );
    this.type13Checkboxes.forEach(() =>
      type13Array.push(this.formBuilder.control(false))
    );
    this.type14Checkboxes.forEach(() =>
      type14Array.push(this.formBuilder.control(false))
    );
    this.type15Checkboxes.forEach(() =>
      type15Array.push(this.formBuilder.control(false))
    );
    this.type16Checkboxes.forEach(() =>
      type16Array.push(this.formBuilder.control(false))
    );
    this.type19Checkboxes.forEach(() =>
      type19Array.push(this.formBuilder.control(false))
    );

    // Manually trigger change detection
    // this.cdr.detectChanges();
  }

  updateCheckbox(index: number, type: string): void {
    const checkboxArray = this.form.get(type) as FormArray;
    checkboxArray.controls[index].setValue(
      !checkboxArray.controls[index].value
    );
    // console.log(checkboxArray);
  }

  // Rename the original getSelectedOptions method
  getSelectedOptionsForType1(Type: any, checkbox: any): string {
    const selectedOptions: string[] = [];
    const typeArray = this.form.get(Type) as FormArray;

    typeArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedOptions.push(checkbox[index]);
      }
    });

    return selectedOptions.join(','); // Convert the array to a string separated by commas
  }
  getSelectedOptionsForType19(Type: any, checkbox: any): string {
    const selectedOptions: string[] = [];
    var selecteoption = String;
    const typeArray = this.form.get(Type) as FormArray;

    typeArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedOptions.push(checkbox[index]);
        selecteoption = checkbox[index];
      }
    });
    console.log('type19', selectedOptions, selecteoption);

    return selectedOptions[0]; // Convert the array to a string separated by commas
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

// Extracting selected teeth from the selectedTeeth object
const selectedTeeth = Object.entries(this.selectedTeeth)
.filter(([key, value]) => value === true)
.map(([key]) => key);

console.log("My selectedTeeth value OnSubmit is ", selectedTeeth)



    const selectedOptionsType1 = this.getSelectedOptionsForType1(
      'type1',
      this.type1Checkboxes
    );
    const selectedOptionsType2 = this.getSelectedOptionsForType1(
      'type2',
      this.type2Checkboxes
    );
    const selectedOptionsType3 = this.getSelectedOptionsForType1(
      'type3',
      this.type3Checkboxes
    );
    const selectedOptionsType4 = this.getSelectedOptionsForType1(
      'type4',
      this.type4Checkboxes
    );
    const selectedOptionsType5 = this.getSelectedOptionsForType1(
      'type5',
      this.type5Checkboxes
    );
    const selectedOptionsType6 = this.getSelectedOptionsForType1(
      'type6',
      this.type6Checkboxes
    );
    const selectedOptionsType7 = this.getSelectedOptionsForType1(
      'type7',
      this.type7Checkboxes
    );
    const selectedOptionsType8 = this.getSelectedOptionsForType1(
      'type8',
      this.type8Checkboxes
    );
    const selectedOptionsType9 = this.getSelectedOptionsForType1(
      'type9',
      this.type9Checkboxes
    );
    const selectedOptionsType10 = this.getSelectedOptionsForType1(
      'type10',
      this.type10Checkboxes
    );
    const selectedOptionsType11 = this.getSelectedOptionsForType1(
      'type11',
      this.type11Checkboxes
    );
    const selectedOptionsType12 = this.getSelectedOptionsForType1(
      'type12',
      this.type12Checkboxes
    );
    const selectedOptionsType13 = this.getSelectedOptionsForType1(
      'type13',
      this.type13Checkboxes
    );
    const selectedOptionsType14 = this.getSelectedOptionsForType1(
      'type14',
      this.type14Checkboxes
    );
    const selectedOptionsType15 = this.getSelectedOptionsForType1(
      'type15',
      this.type15Checkboxes
    );
    const selectedOptionsType16 = this.getSelectedOptionsForType1(
      'type16',
      this.type16Checkboxes
    );
    const selectedOptionsType19 = this.getSelectedOptionsForType19(
      'type19',
      this.type19Checkboxes
    );

    const formdata = {
      result: {
        type1: 'Crown & Bridge',
        options1: selectedOptionsType1,
        type2: 'Implant crown & Bridge',
        options2: selectedOptionsType2,
        type3: 'Metal Free Zirconium',
        option3: selectedOptionsType3,
        type4: 'Removable Prostheses',
        option4: selectedOptionsType4,
        type5: 'Material',
        option5: selectedOptionsType5,
        type6: 'Orthodontics/Splints',
        option6: selectedOptionsType6,
        type7: 'LithiumDiSilicate',
        option7: selectedOptionsType7,
        type8: 'MetalCeramic/Metal',
        option8: selectedOptionsType8,
        type9: 'RemovableProstheses',
        option9: selectedOptionsType9,
        type10: 'StumpShade',
        option10: selectedOptionsType10,
        type11: 'ItemsSentToTheLab',
        option11: selectedOptionsType11,
        type12: 'Implant components',
        option12: selectedOptionsType12,
        type13: 'Transluecency',
        option13: selectedOptionsType13,
        type14: 'Glaze',
        option14: selectedOptionsType14,
        type15: 'Value',
        option15: selectedOptionsType15,
        type16: 'Texture',
        option16: selectedOptionsType16,
        option18: 'Nill',
        type18: 'Comments',
        type19: 'Pontic Design',
        option19: selectedOptionsType19,
        file: this.fileNames.join(", ")  

      },
    };

 // Constructing the formPayload object with only desired form fields
 const {
  firstName,
  lastName,
  fullName,
  registerNumber,
  patientname,
  regId,
  service,
  orderDate,
  requiredDate,
  patientage,
  priority,
  patientGender,
  mobileNumber
} = this.form.value;

const formPayload = {
  form: {
    firstName,
    lastName,
    fullName,
    registerNumber,
    patientname,
    regId,
    service,
    orderDate,
    requiredDate,
    patientage,
    priority,
    patientGender,
    mobileNumber
  }
};

console.log('My form data', formPayload);
    console.log('My form data', formdata);
    console.log('formdata', this.form.value);
  
 
//Check this
    if (this.form.invalid) {
      this.checkFormValidity();
      const messageType = 'warning' ;
      const message = "Form is Invalid, fill all mandatory fields";
      const title = 'Invalid Form';
      this.toasterService.showToast(message, title, messageType);
      return;
    }
   
    this.orderservice
      .createOrder(this.userToken,this.accessToken, formPayload.form, formdata, selectedTeeth )
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.result = res;
          const messageType = 'success';
          const message = this.result.message;
          const title = 'Order Creation';
          this.toasterService.showToast(message, title, messageType);
          this.router.navigate(['/det/pages/success']);
          // window.location.reload();
        },
        error: (error) => {
          this.loading = false;
          const messageType = 'warning' ;
          const message = error;
          const title = 'Login';
    
        this.toasterService.showToast(message, title, messageType);
         
        },
        // {
        //   // this.alertService.error(error);
        //   // this.loading = false;
        // }
      });

    
  



  }

  submit() {
      //  this.captureScreenshot();
    window.alert('File submitted');

    this.router.navigate(['/pages/casedetail']);
  }


  checkFormValidity() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control && !control.valid) {
        console.log('Invalid field:', field);
        // Handle invalid field as needed
      }
    });
  }

  selectFiles(event: any): void {
    this.handleFiles(event.target.files);
}

onDrop(event: DragEvent) {
    event.preventDefault();
    this.handleFiles(event.dataTransfer?.files);
}

onDragOver(event: DragEvent) {
    event.preventDefault();
    const dragDropArea = event.currentTarget as HTMLElement;
    dragDropArea.classList.add('drag-over');
}

onDragLeave(event: DragEvent) {
    const dragDropArea = event.currentTarget as HTMLElement;
    dragDropArea.classList.remove('drag-over');
}

handleFiles(files: FileList | null) {
  if (!files) return;

  this.message = [];
  this.progressInfos = [];
  this.selectedFiles = files;
  this.previews = [];
  this.fileNames = [];

  if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
          const file = this.selectedFiles[i];
          const fileType = file.type;
          const allowedTypes = [
              'image/jpeg',
              'image/jpg', 
              'image/png', 
              'application/pdf',
              'model/stl', 
              'model/ply'
          ];

          if (!allowedTypes.includes(fileType)) {
              // Add a toaster message for invalid data type
              continue;
          }

          this.fileNames.push(file.name);

          console.log("My file Name", this.fileNames);

          // Process the file if it's valid
          const reader = new FileReader();
          reader.onload = (e: any) => {
              let previewSrc = '';
              if (fileType.startsWith('image/')) {
                  previewSrc = e.target.result;
              } else if (fileType === 'application/pdf') {
                  previewSrc = 'assets/images/files/pdf-icon.png'; // Ensure this path is correct
              } else if (fileType === 'model/stl' || fileType === 'model/ply') {
                  previewSrc = 'assets/images/files/3d-icon.png'; // Ensure this path is correct
              } else {
                  previewSrc = 'assets/images/files/file-icon.png'; // Default file icon path
              }
              this.previews.push({ src: previewSrc, type: fileType });
          };
          // For non-image files, you don't need to use readAsDataURL, just use the placeholder icon
          if (fileType.startsWith('image/')) {
              reader.readAsDataURL(file);
          } else {
              reader.readAsDataURL(new Blob([file], { type: fileType }));
          }

          // Immediately upload the file after selecting it
          this.upload(i, this.selectedFiles[i]);
      }
  }
}


upload(idx: number, file: File): void {
    if (file) {
        this.uploadService.upload(file).subscribe({
            next: (event: any) => {
                // Handle upload success
            },
            error: (err: any) => {
                // Handle upload error
            }
        });
    }
}






  
 
}

