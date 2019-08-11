import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login.component';
import { HomeModule } from '../home/home.module';
import { ForgotPasswordModule } from '../forgot-password/forgot-password.module';
import { SignUpModule } from "../sign-up/sign-up.module";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    ForgotPasswordModule,
    SignUpModule,
    HomeModule,
    BusySpinnerModule
  ],
  declarations: [
    LoginComponent
  ],
  
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
