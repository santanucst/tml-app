import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//for modal
import { NgbdModalComponent } from './components/modal-component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbdComplaintModalComponent } from 'app/modules/widget/modal/components/modal-complaint.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  exports:[
    CommonModule,
    NgbdModalComponent,
    

  ],
  declarations: [
    NgbdModalComponent,
   

  ],
  //new add for modal
  entryComponents:[
    NgbdModalComponent,
    
  ],
   
  providers: [

  ]
})
export class ModalModule { }
