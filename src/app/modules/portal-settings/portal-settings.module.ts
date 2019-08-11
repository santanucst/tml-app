import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../shared/shared.module";
import { PortalSettingsComponent } from "./components/portal-settings.component";
import { PortalSettingsDataService } from "./services/portal-settings.services";
import { NgbdSapDetailModalComponent } from "./components/sap-detail-modal/sap-detail-modal.component";
// import { SapDetEmitService } from "app/modules/portal-settings/services/sap-details.emit.service.ts";
import { SapDetEmitService } from "./services/sap-details-emit.service";

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
      PortalSettingsComponent,
      NgbdSapDetailModalComponent
    ],
    exports: [
      PortalSettingsComponent
    ],
    entryComponents: [
      NgbdSapDetailModalComponent//for sap details
    ],
    providers: [
      PortalSettingsDataService,
      SapDetEmitService
    ]
})

export class PortalSettingsModule{

}