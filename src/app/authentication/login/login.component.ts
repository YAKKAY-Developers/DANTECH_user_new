import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToasterService } from 'src/app/services/toaster.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  result: any;
  //register
  register: FormGroup;
  reg_submitted = false;
  reg_loading = false;
  reg_result: any;
  passwordsMatching = false;
  loginError: boolean = false;
  RegisterError: boolean = false;
  error_message: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private toasterService: ToasterService,
  ) {}


  ngOnInit() {
    this.authservice.logout();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          ),
          Validators.minLength(8),
        ],
      ],
    });

    this.register = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        firstName: [
          '',
          [
            Validators.required,
            Validators.pattern(/^([A-z]+\s*)+$/),
            Validators.minLength(3),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.pattern(/^([A-z]+\s*)+$/),
            Validators.minLength(3),
          ],
        ],
        // address: ['', [Validators.required, Validators.maxLength(100)]],
        mobileNumber: [
          '',
          [Validators.required, Validators.pattern('[0-9]{10}')],
        ],

        registerNumber:['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            ),
            Validators.minLength(8),
          ],
        ],
        // confirmpassword: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.pattern(
        //       /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        //     ),
        //     Validators.minLength(8),
        //   ],
        // ],
      }
      // {
      //   validators: this.password.bind(this),
      // }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  get r() {
    return this.register.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.authservice
      .login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.result = res;
       this.router.navigate(['/det/profile/view']);
        },
        error: (error) => {
          this.loading = false;
          this.loginError = true;
          const messageType = 'warning' ;
          const message = error;
          const title = 'Login';
    
        this.toasterService.showToast(message, title, messageType);
         
        },
       
      });
  }

  Register() {
    console.log("I am inside register")

    this.reg_submitted = true;
    console.log(this.register.value);

    if (this.register.invalid) {
      return;
    }
    this.reg_loading = true;
    this.authservice
      .register(this.register.value)
      .pipe(first())
      .subscribe({
 

        next: (res) => {
          this.result = res;
          const messageType = 'success';
          console.log( "Message", messageType);
          const message = this.result.message;
          const title = 'Registration';
          this.toasterService.showToast(message, title, messageType);
          // this.router.navigate(['/det/auth/login']);
        },
        error: (error) => {
          // this.error_message = error.error.message;
          console.log(error);
          const messageType = 'warning' ;
          const message = error;
          const title = 'Login';
    
        this.toasterService.showToast(message, title, messageType);
         

          this.RegisterError = true;
        },
      });
  }

  togglePanel(isSignUp: boolean): void {
    const container = document.getElementById('container');

    // Check if the element exists before attempting to modify its class
    if (container) {
      if (isSignUp) {
        container.classList.add('right-panel-active');
      } else {
        container.classList.remove('right-panel-active');
      }
    } else {
      console.error('Element with ID "container" not found.');
    }
  }
}
