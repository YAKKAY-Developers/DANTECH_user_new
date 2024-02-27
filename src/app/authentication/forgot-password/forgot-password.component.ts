import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.forgotpassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

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

    // Add your logic here for submitting the forgetpassword form
  }

  // // Add togglePanel method
  // togglePanel(isSignIn: boolean) {
  //   // Add your logic here for toggling panels
  // }

 
}
