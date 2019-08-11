export class UserModel {
  private _userId: string;
  private _userType: string;
  private _code: string;
  private _name: string;
  private _userDisplayName: string;
  private _accessToken: string;
  private _employeeId: string;
  private _roleId: string;
  private _roleName: string;
  private _plantType: string;
  //new add for both plant type
  private _plantTypeForBoth: string;
  private _vendorGstin: string;
  private _vendorPanNo: string;

  private _active: string;
  private _isNew: string;  
  private  _codeDetails: any[];

  get plantTypeForBoth(): string {
    return this._plantTypeForBoth;
  }
  set plantTypeForBoth(plantTypeForBoth: string) {
    this._plantTypeForBoth = plantTypeForBoth;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(userId: string) {
    this._userId = userId;
  }

  get userType(): string {
    return this._userType;
  }
  set userType(userType: string) {
    this._userType = userType;
  }

  get code(): string {
    return this._code;
  }
  set code(code: string){
    this._code = code;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string){
    this._name = name;
  }

  get userDisplayName(): string {
    return this._userDisplayName;
  }
  set userDisplayName(userDisplayName: string) {
    this._userDisplayName = userDisplayName;
  }

  get accessToken(): string {
    return this._accessToken;
  }
  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  get employeeId(): string {
    return this._employeeId;
  }
  set employeeId(employeeId: string) {
    this._employeeId = employeeId;
  }

  get roleId(): string {
    return this._roleId;
  }
  set roleId(roleId: string) {
    this._roleId = roleId;
  }

  get roleName(): string {
    return this._roleName;
  }
  set roleName(roleName: string) {
    this._roleName = roleName;
  }

  get plantType(): string {
    return this._plantType;
  }
  set plantType(plantType: string){
    this._plantType = plantType;
  }

  get vendorGstin(): string {
    return this._vendorGstin;
  }
  set vendorGstin(vendorGstin: string){
    this._vendorGstin = vendorGstin;
  }

  get vendorPanNo(): string {
    return this._vendorPanNo;
  }
  set vendorPanNo(vendorPanNo: string){
    this._vendorPanNo = vendorPanNo;
  }
  
  get active(): string {
    return this._active;
  }
  set active(active: string){
    this._active = active;
  } 

  get isNew(): string {
    return this._isNew;
  }
  set isNew(isNew: string){
    this._isNew = isNew;
  }   

  get codeDetails(): any[] {
    return this._codeDetails;
  }
  set codeDetails(codeDetails: any[]){
    this._codeDetails = codeDetails;
  }  
  
}//end of class
