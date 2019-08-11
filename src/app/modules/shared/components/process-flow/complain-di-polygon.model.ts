export class DIPolygonModel {

    private _requiredSiteVisit: string[] = [ 
     'Registration',
     'Site Visit Allocation',
     'Preli Investigation',
     'Complaint Resolution',
     'CAPA' ,
     'Close'
    ]

    private _notRequiredSiteVisit: string[] = [ 
        'Registration',
        'Complaint Resolution',
        'CAPA' ,
        'Close'
       ]

    public get siteVisitRequired(): string[]{
        return this._requiredSiteVisit;
    }

    public get siteVisitNotRequired(): string[] {
        return this._notRequiredSiteVisit;
    }
}