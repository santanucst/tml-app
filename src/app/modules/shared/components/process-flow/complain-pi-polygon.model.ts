export class PIPolygonModel {

    private _validRootCause: string[] = [ 
     'Registration',
     'Root Cause Analysis',
     'CAPA' ,
     'Close'
    ]

    private _inValidRootCause: string[] = [ 
        'Registration',
        'Rootcause Analysis',
        'Close'
    ]

    public get validRootCaus(): string[]{
        return this._validRootCause;
    }

    public get inValidRootCause(): string[] {
        return this._inValidRootCause;
    }
}