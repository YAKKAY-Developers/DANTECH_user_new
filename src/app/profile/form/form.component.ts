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
import { Subscribable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { DisableRightClickService } from 'src/app/services/disable-right-click.service';

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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  result: any;
  selected_image = null;
  stat_user: string;
  userId: string;
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

      // this.saveFileLocally(file);
    }
  }
  // profile image save try
  // saveFileLocally(file: File): void {
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const base64Data = (event.target as any).result;
  //     const fileName = file.name;

  //     // Save the base64 data to local storage
  //     localStorage.setItem(fileName, base64Data);

  //     console.log('File saved locally:', fileName);
  //   };

  //   // Read the file as data URL
  //   reader.readAsDataURL(file);
  // }

  ngOnInit() {
    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { status } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userId = userToken;
    this.userType = fullName;
    this.stat_user = status;
    // console.log(this.userId);

    this.rightClickDisable.disableRightClick();

    this.form = this.formBuilder.group({
      // image: ['',[Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-z]*$/),
          Validators.min(3),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phonenumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      alternativenumber: [
        '',
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: [
        '',
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern('^[1-9][0-9]+$'),
        ],
      ],
      country: ['', [Validators.required]],
      bank_acNo: [
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
          Validators.pattern('^[A-Za-z]{4}[a-zA-Z0-9]{7}$'),
        ],
      ],
      bank_brnch: ['', [Validators.required]],
      upi_id: [
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

    //user details
    this.userDetailsSubscription = this.userservice
      .getUserDetails(this.userId)
      .subscribe(
        (res: any) => {
          this.UserDetails = res;
          console.log('My details', this.UserDetails);
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
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    // const formdata = new FormData();
    // formdata.append('file', this.selected_image);
    // this.http.post('http://localhost:8000/file', formdata).subscribe((res) => {
    //   console.log(res);
    // });
    this.submitted = true;

    if (this.form.invalid) {
      // console.log(this.form.controls);
      return;
    }
    this.loading = true;
    this.userservice
      .profilereg(this.form.value, this.userId)
      .pipe(first())
      .subscribe({
        next: () => {
          // this.router.navigate(['/det/profile/view']);
        },
        error: (error) => {
          // this.alertService.error(error);
          this.loading = false;
        },
      });

    // this.router.navigate(['/det/profile/view']);
  }
}
