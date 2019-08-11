import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { DatePipe } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { NgbdItemNoModalComponent } from './components/item-no-modal/item-no-modal.component';
import { InvoiceAddEditComponent } from "./components/invoice/add-edit/invoice-add-edit.component";
import { CreditNoteAddEditComponent } from "./components/credit-note/add-edit/credit-note-add-edit.component";
import { DebitNoteAddEditComponent } from "./components/debit-note/add-edit/debit-note-add-edit.component";//added for debit note 25.10.18
import { InvoiceAddEditDataService } from "./services/invoice-add-edit-data.service";
import { VendorCodeSearchComponent } from "./components/vendor-code-search/vendor-code-search.component";
import { ItemNoEmitService } from "./services/item-no-emit.service";
import { ItemDetailsService } from "./services/item-details.service";
import { CreditNoteAddEditDataService } from "./services/credit-note-add-edit-data.service";
import { DebitNoteAddEditDataService } from "./services/debit-note-add-edit-data.service";//for debit note service 25.10.18
import { PurchaseOrderInteractionService } from "./services/purchase-order-interaction.service";
import { PurchaseOrderDetailsViewComponent } from "./components/view/purchase-order-details-view.component";
import { InvoiceDetailsViewComponent } from "./components/invoice/view/invoice-details-view.component";
import { InvoiceItemDetailsViewComponent } from "./components/invoice/item-details-view/invoice-item-details-view.component";
import { PurchaseInvoiceItemViewDataService } from "./services/purchase-invoice-item-view-data.services";
import { CreditNoteDetailsViewComponent } from "./components/credit-note/view/credit-note-details-view.component";
import { CreditNoteItemDetailsViewComponent } from "./components/credit-note/item-details-view/credit-note-item-details-view.component";
import { DebitNoteDetailsViewComponent } from "./components/debit-note/view/debit-note-details-view.component";//debit note view 25.10.18
import { DebitNoteItemDetailsViewComponent } from "./components/debit-note/item-details-view/debit-note-item-details-view.component";//debit note item details


@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    SharedModule,
    BusySpinnerModule//for busy spinner
  ],
  declarations: [
    InvoiceAddEditComponent,
    NgbdItemNoModalComponent,
    VendorCodeSearchComponent,
    CreditNoteAddEditComponent,
    DebitNoteAddEditComponent,//debit note added on 25.10.18
    PurchaseOrderDetailsViewComponent,//total po view
    InvoiceDetailsViewComponent,//invoice details view
    InvoiceItemDetailsViewComponent,//invoice item detials view
    CreditNoteDetailsViewComponent,//credit note details view
    CreditNoteItemDetailsViewComponent,//credit note item details view
    DebitNoteDetailsViewComponent,//debit note details view 25.10.18
    DebitNoteItemDetailsViewComponent//debit note item details view 25.10.18


  ],
  exports: [
    InvoiceAddEditComponent,
    VendorCodeSearchComponent,
    CreditNoteAddEditComponent,
    DebitNoteAddEditComponent,//debit note added on 25.10.18
    PurchaseOrderDetailsViewComponent,//total po view
    InvoiceDetailsViewComponent,//invoice details view
    InvoiceItemDetailsViewComponent,//invoice item detials view
    CreditNoteDetailsViewComponent,//credit note details view
    CreditNoteItemDetailsViewComponent,//credit note item details view
    DebitNoteDetailsViewComponent,//debit note details view 25.10.18
    DebitNoteItemDetailsViewComponent//debit note item details view 25.10.18

  ],
  entryComponents: [
    NgbdItemNoModalComponent
  ],
  providers: [
    InvoiceAddEditDataService,
    CreditNoteAddEditDataService,
    DebitNoteAddEditDataService,//add ed for debit note service 25.10.18
    ItemNoEmitService,
    DatePipe,
    ItemDetailsService,
    PurchaseInvoiceItemViewDataService,
    PurchaseOrderInteractionService
  ]
})
export class PurchaseOrderModule { }
