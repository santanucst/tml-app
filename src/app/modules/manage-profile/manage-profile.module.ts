import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { ManageProfileComponent } from "./components/manage-profile.component";
import { ManageProfileService } from "./services/manage-profile.service";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule//for busy spinner
  ],
  declarations: [
    ManageProfileComponent
  ],
  exports: [
    ManageProfileComponent
  ],
  providers: [
    ManageProfileService
  ]
  
})
export class ManageProfileModule { }
