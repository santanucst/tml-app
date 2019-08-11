import { Routes } from "@angular/router";
import { ROUTER_PATHS } from "./router-paths";//to set the path
import { HomeComponent } from '../home/components/home.component';//home
import { DashboardComponent } from "../dashboard/components/dashboard.component";
import { AuthenticationGuardService } from "./services/route-guard.service";
import { ManageProfileComponent } from "../manage-profile/components/manage-profile.component";
import { InvoiceAddEditComponent } from "../purchase-order/components/invoice/add-edit/invoice-add-edit.component";
import { VendorCodeSearchComponent } from "../purchase-order/components/vendor-code-search/vendor-code-search.component";
import { CreditNoteAddEditComponent } from "../purchase-order/components/credit-note/add-edit/credit-note-add-edit.component";
import { DebitNoteAddEditComponent } from "../purchase-order/components/debit-note/add-edit/debit-note-add-edit.component";//added for debit note component 25.10.18
import { AddRoleComponent } from "../role/components/role-add/role-add.component";
import { ViewRoleComponent } from "../role/components/role-view/role-view.component";
import { ViewRoleDetailsComponent } from "../role/components/role-view-details/role-view-details.component";
import { AddUserComponent } from "../user/components/user-add/user-add.component";
import { ViewUserComponent } from "../user/components/user-view/user-view.component";
import { ViewUserDetailsComponent } from "../user/components/user-view-details/user-view-details.component";
import { PortalSettingsComponent } from "../portal-settings/components/portal-settings.component";
import { PurchaseOrderDetailsViewComponent } from "../purchase-order/components/view/purchase-order-details-view.component";
import { InvoiceDetailsViewComponent } from "../purchase-order/components/invoice/view/invoice-details-view.component";
import { InvoiceItemDetailsViewComponent } from "../purchase-order/components/invoice/item-details-view/invoice-item-details-view.component";
import { CreditNoteDetailsViewComponent } from "../purchase-order/components/credit-note/view/credit-note-details-view.component";
import { CreditNoteItemDetailsViewComponent } from "../purchase-order/components/credit-note/item-details-view/credit-note-item-details-view.component";
//for debit note 25.10.18
import { DebitNoteDetailsViewComponent } from "../purchase-order/components/debit-note/view/debit-note-details-view.component";
import { DebitNoteItemDetailsViewComponent } from "../purchase-order/components/debit-note/item-details-view/debit-note-item-details-view.component";//for debit item details 25.10.18

export const HOME_ROUTES: Routes = [
  {
    path: ROUTER_PATHS.HomeRouter,
    component: HomeComponent,
    canActivate: [ AuthenticationGuardService ],
    children: [
      {
        path: '',
        redirectTo: ROUTER_PATHS.DashboardRouter,
        pathMatch: 'full',
      },
      {//dashboard
        path: ROUTER_PATHS.DashboardRouter,
        component: DashboardComponent
      },
      {//manage profile
        path: ROUTER_PATHS.ManageProfileRouter,
        component: ManageProfileComponent
      },
      {//portal-settings
        path: ROUTER_PATHS.PortalSettingsRouter,
        component: PortalSettingsComponent
      },
      {//invoice add
        path: ROUTER_PATHS.InvoiceAddRouter,
        component: InvoiceAddEditComponent
      },
      {//vendor code search 
        path: ROUTER_PATHS.VendorCodeSearchRouter,
        component: VendorCodeSearchComponent
      },
      {//invoice add with vendor code
        path: ROUTER_PATHS.InvoiceAddWithVendorCodeRouter,
        component: InvoiceAddEditComponent
      },
      {//credit note
        path: ROUTER_PATHS.CreditNoteAddRouter,
        component: CreditNoteAddEditComponent
      },
      {//credit note add with vendor code
        path: ROUTER_PATHS.CreditNoteAddWithVendorCodeRouter,
        component: CreditNoteAddEditComponent
      },
      {//debit note 25.10.18
        path: ROUTER_PATHS.DebitNoteAddRouter,
        component: DebitNoteAddEditComponent
      },
      {//debit note add with vendor code 25.10.18
        path: ROUTER_PATHS.DebitNoteAddWithVendorCodeRouter,
        component: DebitNoteAddEditComponent
      },
      {//total po view
        path: ROUTER_PATHS.PODetViewRouter,
        component: PurchaseOrderDetailsViewComponent
      },
      {//total invoice details view
        path: ROUTER_PATHS.InvoiceDetViewRouter,
        component: InvoiceDetailsViewComponent
      },
      {//total invoice item details view
        path: ROUTER_PATHS.InvoiceItemDetViewRouter,
        component: InvoiceItemDetailsViewComponent
      },
      {//total credit note details view
        path: ROUTER_PATHS.CreditNoteDetViewRouter,
        component: CreditNoteDetailsViewComponent
      },
      {//total credit note item details view
        path: ROUTER_PATHS.CreditNoteItemDetViewRouter,
        component: CreditNoteItemDetailsViewComponent
      },
      {//total debit note details view 25.10.18
        path: ROUTER_PATHS.DebitNoteDetViewRouter,
        component: DebitNoteDetailsViewComponent
      },
      {//total debit note item details view 25.10.18
        path: ROUTER_PATHS.DebitNoteItemDetViewRouter,
        component: DebitNoteItemDetailsViewComponent
      },
      {//user route
        path: ROUTER_PATHS.AddUserRouter,//add user from menu
        component: AddUserComponent
      },
      {
        path: ROUTER_PATHS.ViewModifyUserRouter,//view/modify user from menu
        component: ViewUserComponent
      },
      {//view single user with parameter
        path: ROUTER_PATHS.ViewUserWithParameterRouter,
        component: ViewUserDetailsComponent
      },
      {//modify single user with parameter
        path: ROUTER_PATHS.ModifyUserWithParameterRouter,
        component: AddUserComponent
      },
      //role route
      {
        path: ROUTER_PATHS.AddRoleRouter,//add role from menu
        component: AddRoleComponent
      },
      {
        path: ROUTER_PATHS.ViewModifyRoleRouter,//view/modify role from menu
        component: ViewRoleComponent
      },
      {//view single role with parameter
        path: ROUTER_PATHS.ViewRoleWithParameterRouter,
        component: ViewRoleDetailsComponent
      },
      {//modify single role with parameter
        path: ROUTER_PATHS.ModifyRoleWithParameterRouter,
        component: AddRoleComponent
      },
    ]
  }
];
