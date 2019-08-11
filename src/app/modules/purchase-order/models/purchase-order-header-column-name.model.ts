
export class PurchaseOrderHeaderColumnNameModel {
    private _purchaseOrderHeaderTableFieldNames: any = {
        poNumber: 'PO_NMBR',
        vendorName: 'VEND_NAME',
    }

    public get purchaseOrderHeaderTableFieldNames() {
        return this._purchaseOrderHeaderTableFieldNames;
    }
}
