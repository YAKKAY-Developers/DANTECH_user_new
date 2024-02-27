import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { first, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpassword: FormGroup; // Add FormGroup for forgotpassword
  form: FormGroup;
  submitted = false; // Initialize submitted property
  loginError = false; // Initialize loginError property
  userToken:any;
  accessToken:any;
  loading = false;
  result:any;

  constructor(private formBuilder: FormBuilder, 
    private authservice: AuthService,
    private router: Router,)
  
  { }

  ngOnInit() {
    
    
    const { userToken } = JSON.parse(localStorage.getItem('user')?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user')?? '{}');
    this.accessToken = accessToken;
    this.userToken = userToken;



    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.pattern(  /^(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[!@#\$%\^&\*])(?=.{8,})/)]]
    });
  }

   // Add getter for easy access to form controls
   get f() {
    return this.form.controls;
  }

  // Define onSubmit method
  onSubmit() {
    this.submitted = true;


     // stop here if form is invalid
     if (this.form.invalid) {
      return;
  }

  this.loading = true;
    this.authservice.forgotPassword(this.f['email'].value).pipe(first())
    .pipe(first())
    .subscribe({
      next: (res) => {
        this.result = res;
        this.router.navigate(['/det/auth/reset-password']);
      },
      error: (error) => {
        this.loading = false;
        this.loginError = true;
        console.log(error);
      },
      
    });
  

  }

 
 
}
