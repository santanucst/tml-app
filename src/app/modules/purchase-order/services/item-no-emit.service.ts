import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class ItemNoEmitService {
    private selectedItemDetails: EventEmitter<any> = new EventEmitter();
    private itemsHeader: EventEmitter<any> = new EventEmitter();
    
    public emitModalResult(selectedItemDet: any) {
        this.selectedItemDetails.emit(selectedItemDet);
    }

    public getModalResultEventEmitter() {
        return this.selectedItemDetails;
    }

    public emitItemsHeader(itemsHeaderParam : any){
        this.itemsHeader.emit(itemsHeaderParam); 
    }

    public getItemsHeaderEventEmitter(){
        return this.itemsHeader;
    }
}


