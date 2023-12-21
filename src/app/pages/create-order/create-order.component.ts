import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

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
  //form
  form: FormGroup;
  loading = false;
  submitted = false;
  result: any;
  clinicid: any;
  phone_number: any;
  clinic_name: any;
  descriptions: any;

  // authenticate user
  user_data: any;
  stat_user: string;
  userId: string;
  userType: string;
  accessToken: string;
  userToken: any;
  userdata: any;
  UserDetails: any;
  selected_tooth: any;
  userDetailsSubscription: Subscription;
  userObject: void;
  form_values: any;
  //form
  selectedOption: string = '';
  add_comments = 'Nill..!';
  // check prescence
  gst_no = false;
  img_uploaded = false;
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

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userservice: UserService,
    private orderservice: OrderService,
    private rightClickDisable: DisableRightClickService
  ) {}

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    $(document).ready(function () {
      var selectedTeeth: { [key: string]: boolean } = {}; // Object to store selected teeth states
      var $toothNumber = $('.tooth-number');

      $('.tooth').on('click touchstart', function (event) {
        var $this = $(this);
        var toothText: string = $this.data('title');

        if (!selectedTeeth[toothText]) {
          // If the tooth is not already selected, mark it as selected
          selectedTeeth[toothText] = true;
          $this.addClass('active');
        } else {
          // If the tooth is already selected, unselect it
          selectedTeeth[toothText] = false;
          $this.removeClass('active');
        }

        updateNextStepButton();
      });

      function updateNextStepButton() {
        var selectedTeethCount =
          Object.values(selectedTeeth).filter(Boolean).length;

        if (selectedTeethCount > 0) {
          $toothNumber
            .removeClass('disabled')
            .data('nextStep', selectedTeethCount);
          $toothNumber.html('Selected: ' + selectedTeethCount + ' &times;');
        } else {
          $toothNumber.addClass('disabled').data('nextStep', '');
          $toothNumber.html('test &times;');
        }

        console.log(selectedTeeth); // Log the selected teeth
      }
    });

    this.rightClickDisable.disableRightClick();

    this.initializeForm();
    // this.fetchUserData();
    this.populateCheckboxes();

    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userId = userToken;
    this.userType = fullName;

    //user details
    this.userDetailsSubscription = this.userservice
      .getUserDetails(this.userId)
      .subscribe(
        (res: any) => {
          this.UserDetails = res;
          this.stat_user = this.UserDetails['statuscode'];
          console.log('My User details', this.UserDetails);
          const userObject = this.UserDetails['profile'];
          this.descriptions = this.UserDetails['description'];

          this.user_data = [this.userdata];
          // console.log(this.user_data);
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );
  }

  ngAfterViewInit(): void {
    // Use setTimeout as a temporary solution to ensure asynchronous data is processed
    setTimeout(() => {
      this.populateCheckboxes();
    }, 0);
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      doctor_name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-z].*$/),
          Validators.minLength(3),
        ],
      ],
      patientname: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-z]*$/),
          Validators.minLength(3),
        ],
      ],
      doctorid: [
        '',
        [Validators.required, Validators.pattern('DOC[0-9]{5,6}$')],
      ],
      service: ['', [Validators.required]],
      orderdate: ['', [Validators.required]],
      phonenumber: [''],
      clinicname: [''],
      uniqueid: [''],
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
    this.cdr.detectChanges();
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
        type19: 'Pontic Design',
        option19: selectedOptionsType19,
      },
    };

    console.log('My form data', formdata);
    console.log('formdata', this.form.value);
    console.log(this.selected_tooth);
    this.selected_tooth = 'None';

    if (this.form.invalid) {
      return;
    }
    // this.form_values = {
    //   clinicid: this.UserDetails.profile.clinicid,
    //   doctorid: this.form.value['doctorid'],
    // };

    this.orderservice
      .orderreg(this.form.value, formdata, this.selected_tooth, this.userId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.result = res;
          // window.confirm(this.result.message);
          // get return url from query parameters or default to home page
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          // this.router.navigateByUrl(returnUrl);
          // this.router.navigate(['/det/profile/view']);
          this.router.navigate(['/det/pages/success']);
          // window.location.reload();
        },
        error: (error) => {
          this.loading = false;
        },
        // {
        //   // this.alertService.error(error);
        //   // this.loading = false;
        // }
      });
  }

  // submit() {
  //   window.alert('File submitted');
  //   this.router.navigate(['/pages/casedetail']);
  // }
}
