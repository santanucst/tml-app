import { Injectable } from '@angular/core';

@Injectable()
export class TilesInteractionService {

    private _wsFilter: any;

    public get wsFilter(): any {
        return this._wsFilter;
    }
    public set wsFilter(wsFilter: any) {
        this._wsFilter = wsFilter;
    }

}