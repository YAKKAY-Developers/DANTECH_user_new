
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
 
  constructor(
    private formBuilder: FormBuilder,  
    private route: ActivatedRoute,
    private router: Router, 
    private authservice:AuthService) { }

  ngOnInit(): void {
    this.resetpassword = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });


     // Retrieve token from query parameters
     this.route.queryParams.subscribe(params => {
      this.token = params['id'];
      // Now you can use this.token in your component logic
    });

    let token=this.token;
console.log("Token value is", token);

//   //to extract the token value from the route
//   this.route.queryParams 
//   .subscribe(params => {
//   this.token=params['token'];
//   console.log(this.token)//To print the token
// }
//     );



this.authservice.validateResetToken(token)
  .pipe(first())
  .subscribe({
      next: () => {
        
          this.tokenStatus = TokenStatus.Valid;
      },
      error: () => {
          this.tokenStatus = TokenStatus.Invalid;
      }
  });


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
        next: () => {
          alert("Password reset successful, you can now login");
            // this.alertService.success('Password reset successful, you can now login'
            // { keepAfterRouteChange: true });
            this.router.navigate(['../pages-login'], 
            { relativeTo: this.route });
        },
        error: error => {
            // this.alertService.error(error);
            this.loading = false;
        }
    });



  }
}
