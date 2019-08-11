import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up.component';
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SignUpService } from "./services/sign-up.service";

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BusySpinnerModule
  ],
  declarations: [
    SignUpComponent
  ],
  
  exports: [
    SignUpComponent
  ],
  providers: [
    SignUpService
  ]

})
export class SignUpModule { }
