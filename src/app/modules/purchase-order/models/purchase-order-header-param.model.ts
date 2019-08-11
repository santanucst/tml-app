export class PurchaseOrderHeaderParamModel {
    private _perPage: string;
    private _pageNo: string;

      public get perPage(): string {
        return this._perPage;
    }
    public set perPage(perPage: string) {
        this._perPage = perPage;
    }
    public get pageNo(): string {
        return this._pageNo;
    }
    public set pageNo(pageNo: string) {
        this._pageNo = pageNo;
    }


}