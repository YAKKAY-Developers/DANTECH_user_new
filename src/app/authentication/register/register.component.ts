import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router , ActivatedRoute} from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form: FormGroup;
  loading = false;
  submitted = false;
  result:any
  //register
  register: FormGroup;
  reg_submitted = false;
  reg_loading = false;
  reg_result:any
  passwordsMatching = false;
  loginError: boolean = false;
  RegisterError: boolean =false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private authservice:AuthService,) {}

    
    
  ngOnInit() {
    
    this.form = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          ),
          Validators.minLength(8),
        ],
      ]
    });

    this.register = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      name: ['',[Validators.required,Validators.pattern(/^[A-z]*$/),Validators.min(3)]],
      address: ['',[Validators.required,Validators.maxLength(50)]],
      phonenumber: ['',[Validators.required,Validators.pattern("[0-9]{10}")]],
      password: ['',[Validators.required,Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ),Validators.minLength(8)]],
      confirmpassword: ['',[Validators.required,Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ),Validators.minLength(8)]],
    });
  }

 // convenience getter for easy access to form fields
 get f() { return this.form.controls; }
 get r() { return this.register.controls; }

  onSubmit() {
   
    this.submitted = true;
    // reset alerts on submit
    // this.alertService.clear();
     // stop here if form is invalid
     if (this.form.invalid) {
      return;
  }
  this.loading = true;
  this.authservice.login(this.f['email'].value, this.f['password'].value)
  .pipe(first())
  .subscribe({
    next: (res) => {
      this.result = res;
      // window.confirm(this.result.message);
      // get return url from query parameters or default to home page
      // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      // this.router.navigateByUrl(returnUrl);
      this.router.navigate(['/det/profile/view']);
    },
    error: (error) => {
      this.loading = false;
      this.loginError =true;

    }
    // {
    //   // this.alertService.error(error);
    //   // this.loading = false;
    // }
    });

  }

  

  
  Register(){

    this.reg_submitted = true;

    if (this.register.invalid){
      return;
    }
    this.reg_loading = true;
    this.authservice.register(this.register.value)
      .pipe(first())
      .subscribe({
          next: () => {
              // this.alertService.success('Registration successful', { keepAfterRouteChange: true });
              this.router.navigate(['../pages-login'], { relativeTo: this.route });
              window.location.reload();
          },
          error: error => {
            this.RegisterError = true;
          }
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
