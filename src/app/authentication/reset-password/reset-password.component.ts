
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  resetpassword: FormGroup;
  submitted = false; // Add this line
  get f() { return this.resetpassword.controls; } // Add this line

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.resetpassword = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    // Your form submission logic goes here
  }
}
