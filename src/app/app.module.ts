import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LanderModule } from "./modules/lander/lander.module";
import { ROUTER_MODULE } from './modules/router/router.module';

import { AppComponent } from './app.component';
import { HomeModule } from "./modules/home/home.module";
import { ToastrModule } from 'ngx-toastr';
import { LocalStorageService } from "./modules/shared/services/local-storage.service";
import { SessionErrorService } from "./modules/shared/services/session-error.service";
import { ModalModule } from './modules/widget/modal/modal.module';

import { FileDownloadService } from "./modules/shared/services/file-download.service";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CommonModule,
    HttpModule,
    RouterModule,
    HomeModule,
    // LoginModule,
    LanderModule,
    ROUTER_MODULE,
    ModalModule
  ],
  declarations: [
    AppComponent
  ],
  
  providers: [
    LocalStorageService,
    SessionErrorService,
    FileDownloadService
  ],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
