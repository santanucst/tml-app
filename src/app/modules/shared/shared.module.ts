import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GridSearchPipe } from "./components/pipe/datagrid-search.pipe";
import { SessionErrorService } from "./services/session-error.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    GridSearchPipe
  ],
  exports:[
    GridSearchPipe
  ],
  providers: [
    SessionErrorService
  ]
})
export class SharedModule { }
