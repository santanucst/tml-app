import { Injectable } from '@angular/core';

@Injectable()
export class ItemDetailsService {
    private _selectedItemDetails: any;
    private _vendorCode: string;
    private _vendorName: string;
    private _vendorGstin: string;
    private _vendorPanNo: string;
    private _plantType: string;
    private _testVar: string;
    
    public get selectedItemDetails(): any {
        return this._selectedItemDetails;
    }
    public set selectedItemDetails(selectedItemDetails: any) {
        this._selectedItemDetails = selectedItemDetails;
    }

    public get vendorCode(): string {
        return this._vendorCode;
    }
    public set vendorCode(vendorCode: string) {
        this._vendorCode = vendorCode;
    }

    public get vendorName(): string {
        return this._vendorName;
    }
    public set vendorName(vendorName: string) {
        this._vendorName = vendorName;
    }

    public get vendorGstin(): string {
        return this._vendorGstin;
    }
    public set vendorGstin(vendorGstin: string) {
        this._vendorGstin = vendorGstin;
    }

    public get vendorPanNo(): string {
        return this._vendorPanNo;
    }
    public set vendorPanNo(vendorPanNo: string) {
        this._vendorPanNo = vendorPanNo;
    }

    public get plantType(): string {
        return this._plantType;
    }
    public set plantType(plantType: string) {
        this._plantType = plantType;
    }

    public get testVar(): string{
        return this._testVar;
    }
    public set testVar(testVar: string){
        this._testVar = testVar;
    }
    

}