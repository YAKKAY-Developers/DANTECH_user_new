
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';
enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

import { ToasterService } from 'src/app/services/toaster.service';




@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{

  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token:any;
  resetpassword: FormGroup;
  loading = false;
  submitted = false; // Add this line
  result: any;
 
  constructor(
    private formBuilder: FormBuilder,  
    private route: ActivatedRoute,
    private router: Router, 
    private authservice:AuthService,
    private toasterService :ToasterService) { }

  ngOnInit(): void {
    this.resetpassword = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });


     // Retrieve token from query parameters
     this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log("Reset Token", this.token);

    });


// this.authservice.validateResetToken(token)
//   .pipe(first())
//   .subscribe({
//       next: () => {
        
//           this.tokenStatus = TokenStatus.Valid;
//       },
//       error: () => {
//           this.tokenStatus = TokenStatus.Invalid;
//       }
//   });


  }

  get f() { return this.resetpassword.controls; } // Add this line


  onSubmit() {
    this.submitted = true;
 

    // stop here if form is invalid
if (this.resetpassword.invalid) {
  return;
}


this.loading = true;
console.log("loading is true in Reset password.ts")
console.log(this.token);

this.authservice.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
    .pipe(first())
    .subscribe({
        next: (res) => {
          this.result = res;
          const messageType = 'success';
          const message = this.result.message;
          const title = 'Password reset ';
          this.toasterService.showToast(message, title, messageType);
         
            this.router.navigate(['../pages-login'], 
            { relativeTo: this.route });
        },
        error: error => {
            // this.alertService.error(error);
            this.loading = false;
             this.loading = false;
        const messageType = 'warning' ;
        const message = error;
        const title = 'Reset Password';
        this.toasterService.showToast(message, title, messageType);
        }
    });



  }
}
