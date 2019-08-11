//currently not using
export class TilesFilterModel{
    private _diRegCompFilter: any = {
        plantType: 'DI',
        activityId: 0,
        sortData: '',
        orderType: '',
        filter: ''
    }
    public get diRegCompFilter(): any {
        return this._diRegCompFilter;
    }

    private _diCloseCompFilter: any = {
        plantType: 'DI',
        activityId: 9,
        sortData: '',
        orderType: '',
        filter: 'ACTIVITY_ID=9'
    }
    public get diCloseCompFilter(): any {
        return this._diCloseCompFilter;
    }

    private _diPendingCompFilter: any = {
        plantType: 'DI',
        activityId: -1,
        sortData: '',
        orderType: '',
        filter: ''
    }
    public get diPendingCompFilter(): any {
        return this._diPendingCompFilter;
    }


}