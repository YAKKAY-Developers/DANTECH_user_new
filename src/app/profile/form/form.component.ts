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
import { ToasterService } from 'src/app/services/toaster.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  // selected_image = null;
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
   selected_image: File | null = null;
   selectedImage: File | null = null;
   selectedImageContent: File | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private authservice: AuthService,
    private http: HttpClient,
    private userservice: UserService,
    private orderservice: OrderService,
    private rightClickDisable: DisableRightClickService,
    private toasterService :ToasterService
  ) {}


  // loadFile(event: any) {
  //   const target = event.target as HTMLInputElement;
  //   const image = document.getElementById('output') as HTMLImageElement;
  
  //   this.selected_image = event.target.files ? event.target.files[0] : null;
  //   // console.log( "Iamge selected",this.selected_image)
  //   if (target.files && target.files.length > 0) {
  //     const file = target.files[0];
  //     console.log( "Iamge selected",file)
  //     image.src = URL.createObjectURL(target.files[0]);
  
  //     // Read the file content
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const fileContent = e.target?.result;
  //       if (typeof fileContent === 'string' || fileContent instanceof ArrayBuffer) {
  //         const blob = new Blob([fileContent], { type: file.type });
  //         this.selectedImageContent = new File([blob], file.name, { type: file.type });
  //         console.log("Checking",this.selectedImageContent); // Add this line
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // }
  loadFile(event: any) {
    const target = event.target as HTMLInputElement;
    const image = document.getElementById('output') as HTMLImageElement;
  
    // Get the selected file
    const file = target.files ? target.files[0] : null;
  
    // Log the selected file
    console.log("Image selected:", file);
  
    // Update the selectedImageContent
    this.selectedImageContent = file;
  
    // Display the image preview
    if (file) {
      image.src = URL.createObjectURL(file);
    }
  
    // Log the selectedImageContent
    console.log("Selected image content:", this.selectedImageContent);
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
    this.result = { firstName: '' }; // or initialize with appropriate default values
    this.result ={ email:''};
    this.result ={ mobileNumber:''};

    this.basicInfo = { alternatePhoneNumber: '' }; // or initialize with appropriate default values




    this.form = this.formBuilder.group({
     // photo: ['',[Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-z]*$/),
          Validators.min(3),
        ],
      ],

      
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, 
        Validators.pattern('[0-9]{10}'
        )]],
      //   alternatePhoneNumber: [
      //   '',
      //   [Validators.required, Validators.pattern('[0-9]{10}')],
      // ],
      alternatePhoneNumber: [
        ''
      ],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.min(3)]],
      state: ['', [Validators.required, Validators.min(3)]],
      pincode: [
        '',
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern('^[1-9][0-9]+$'),
        ],
      ],
      country: ['', [Validators.required, Validators.min(3)]],
      
    });

     //Get user details:
     this.userDetailsSubscription = this.userservice.getOneUserDetails(this.userToken, this.accessToken)
     .pipe(first())
     .subscribe({
       next: (res) => {
         this.response = res.userDetails;
         this.fullName = this.result.firstName + this.result.lastName;
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

//   onSubmit() {
  
//     this.submitted = true;

//     if (this.form.invalid) {
//       const messageType = 'warning' ;
//       const message = "Form is Invalid, fill all mandatory fields";
//       const title = 'Invalid Form';
//       this.toasterService.showToast(message, title, messageType);
      
//       return;
//     }
//     this.loading = true;

//     const formData = new FormData();
    
//    // Append photo with its name
//    if (this.selectedImageContent) {
//     formData.append('photo', this.selectedImageContent, this.selectedImageContent.name);
//   }

//   // Append other form data
//   Object.keys(this.form.value).forEach(key => {
//     const value = this.form.value[key];
//     console.log("Key:", key, "Value:", value);
//     formData.append(key, value);
//   });

//   // Append other form data
// formData.append('name', this.form.value.name);
// formData.append('email', this.form.value.email);
// formData.append('mobileNumber', this.form.value.mobileNumber);
// formData.append('alternatePhoneNumber', this.form.value.alternatePhoneNumber);
// formData.append('address', this.form.value.address);
// formData.append('city', this.form.value.city);
// formData.append('state', this.form.value.state);
// formData.append('pincode', this.form.value.pincode);
// formData.append('country', this.form.value.country);
// formData.append('photo', this.selectedImageContent);
// console.log("Form Data:", formData);


//     this.userservice.updateUserInfo(this.userToken, this.accessToken,formData )
//       .pipe(first())
//       .subscribe({
//         next: (res) => {
//           this.result = res;
//           const messageType = 'success';
//           const message = this.result.message;
//           const title = 'Save Success';
//           this.toasterService.showToast(message, title, messageType);
//           this.router.navigate(['/det/profile/bank']);
//         },
//         error: (error) => {
//           const messageType = 'warning' ;
//           const message = error;
//           const title = 'Login';
    
//         this.toasterService.showToast(message, title, messageType);
         
//           this.loading = false;
//         },
//       });

  
//     this.router.navigate(['/det/profile/view']);
//   }


onSubmit() {
  this.submitted = true;

  if (this.form.invalid) {
    const messageType = 'warning';
    const message = "Form is Invalid, fill all mandatory fields";
    const title = 'Invalid Form';
    this.toasterService.showToast(message, title, messageType);
    return;
  }
  this.loading = true;

  const formData = new FormData();

  if (this.selectedImageContent) {
    formData.append('photo', this.selectedImageContent, this.selectedImageContent.name); // Append the image file
  }

  // Append other form data
  Object.keys(this.form.value).forEach(key => {
    formData.append(key, this.form.get(key)?.value);
  });


formData.append('name', this.form.value.name);
formData.append('email', this.form.value.email);
formData.append('mobileNumber', this.form.value.mobileNumber);
formData.append('alternatePhoneNumber', this.form.value.alternatePhoneNumber);
formData.append('address', this.form.value.address);
formData.append('city', this.form.value.city);
formData.append('state', this.form.value.state);
formData.append('pincode', this.form.value.pincode);
formData.append('country', this.form.value.country);
formData.append('photo', this.selectedImageContent);



  console.log("FormData after appending other form data:", formData);

  this.userservice.updateUserInfo(this.userToken, this.accessToken, formData)
    .pipe(first())
    .subscribe({
      next: (res) => {
        this.result = res;
        const messageType = 'success';
        const message = this.result.message;
        const title = 'Save Success';
        this.toasterService.showToast(message, title, messageType);
        this.router.navigate(['/det/profile/bank']);
      },
      error: (error) => {
        const messageType = 'warning';
        const message = error;
        const title = 'Login';

        this.toasterService.showToast(message, title, messageType);
        this.loading = false;
      },
    });

  this.router.navigate(['/det/profile/view']);
}






  getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  
}
