import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SapDetEmitService {
    private selectedSapDetails: EventEmitter<any> = new EventEmitter();
      
    public emitModalResult(selectedSapDet: any) {
        this.selectedSapDetails.emit(selectedSapDet);
    }

    public getModalResultEventEmitter() {
        return this.selectedSapDetails;
    }
}


