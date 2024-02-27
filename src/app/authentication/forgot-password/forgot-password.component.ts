import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { first, finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
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

  constructor(private formBuilder: FormBuilder, private authservice: AuthService, private alertService:AlertService )
  
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
    this.authservice.forgotPassword(this.userToken, this.accessToken, this.f['email'].value).pipe(first())
    .pipe(finalize(() => this.loading = false))
    .subscribe(

      (res: any) => {
        this.result = res;
        console.log(this.result)
     
      },
      (error: any) => {
        console.log('Error fetching doc details:', error);
      }
      
);
  

  }

 
 
}
