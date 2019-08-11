import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { UserVerificationComponent } from './components/user-verification/user-verification.component';
import { OTPVerificationComponent } from './components/otp-verification/components/otp-verification.component';
import { OTPGeneratorComponent } from './components/otp-generator/components/otp-generator.component';
import { NgbdOTPVerificationModalComponent } from './components/otp-verification/components/otp-verification-modal/otp-verification-modal.component';
import { HomeModule } from '../home/home.module';
import { ForgotPasswordService } from './services/forgot-password.service';
import { BusySpinnerModule } from '../widget/busy-spinner/busy-spinner.module';
@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BusySpinnerModule,
    HomeModule
  ],
  declarations: [
    UserVerificationComponent,
    OTPVerificationComponent,
    OTPGeneratorComponent,
    NgbdOTPVerificationModalComponent
  ],
  entryComponents: [NgbdOTPVerificationModalComponent],
  exports: [
    UserVerificationComponent,
    OTPVerificationComponent,
    OTPGeneratorComponent
  ],
  providers: [
    ForgotPasswordService
  ]
})
export class ForgotPasswordModule { }
