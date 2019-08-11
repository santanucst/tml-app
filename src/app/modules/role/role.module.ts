import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { AddRoleComponent } from "./components/role-add/role-add.component";
import { ViewRoleComponent } from "./components/role-view/role-view.component";
import { ViewRoleDetailsComponent } from "./components/role-view-details/role-view-details.component";
import { AddRoleDataService } from "./services/add-role-data.service";
import { ViewRoleDataService } from "./services/view-role-data.service";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    RouterModule, //for router
    BusySpinnerModule,//for busy Spinner
    SharedModule
  ],
  declarations: [
    AddRoleComponent,
    ViewRoleComponent,
    ViewRoleDetailsComponent
  ],
 
  exports: [
    AddRoleComponent,
    ViewRoleComponent,
    ViewRoleDetailsComponent   
  ],
  providers : [
    AddRoleDataService,//for add user
    ViewRoleDataService//for view user
  ]
})
export class RoleModule { }
