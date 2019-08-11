import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from "./components/logout.component";
import { LogoutService } from "./services/logout.service";
@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule
  ],
  declarations: [
    LogoutComponent
  ],
  exports: [
    LogoutComponent
  ],
  providers: [
    LogoutService
  ]
})
export class LogoutModule { }
