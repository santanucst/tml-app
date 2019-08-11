import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { DashboardModule } from "../dashboard/dashboard.module";
import { TilesModule } from "../widget/Tiles/tiles.module";
import { ToastService } from "./services/toast-service";
import { LogoutModule } from "../logout/logout.module";
import { AuthenticationGuardService } from "../router/services/route-guard.service";
import { ManageProfileModule } from "../manage-profile/manage-profile.module";
import { PortalSettingsModule } from "../portal-settings/portal-settings.module";
import { PurchaseOrderModule } from "../purchase-order/purchase-order.module";
import { RoleModule } from "../role/role.module";//role module 
import { UserModule } from "../user/user.module";

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    DashboardModule,
    TilesModule,
    LogoutModule,
    ManageProfileModule,
    PortalSettingsModule,
    PurchaseOrderModule,
    UserModule,//user module
    RoleModule,// roleModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  
  providers: [
    ToastService,
    AuthenticationGuardService
  ]
})
export class HomeModule { }
