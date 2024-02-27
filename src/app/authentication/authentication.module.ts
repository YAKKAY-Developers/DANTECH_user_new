import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PagesLoginComponent } from './pages-login/pages-login.component';
import { PagesRegisterComponent } from './pages-register/pages-register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
   
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [

  
    LoginComponent,
        RegisterComponent,
        PagesLoginComponent,
        PagesRegisterComponent,
        ForgotPasswordComponent,
        
  ],
})
export class AuthenticationModule {}
