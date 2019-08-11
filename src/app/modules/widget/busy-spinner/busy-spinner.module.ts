import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusySpinnerComponent } from "./components/busy-spinner.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports:[
    CommonModule,
    BusySpinnerComponent
  ],
  declarations: [
    BusySpinnerComponent
  ],
  providers: [

  ]
})
export class BusySpinnerModule { }
