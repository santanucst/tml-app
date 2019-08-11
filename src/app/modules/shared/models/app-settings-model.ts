export class AppSettingsModel{
  private _authExpireInSec: number;
  private _companyId: string;
  private _diffBetwnCmplntRefDtAndLoggedOnDt: number;
  private _loginUserPassMaxLength: number;
  private _loginUserPassMinLength: number;
  private _rolePrefix: string;
  private _areaSalesOrZonalManagerDesignationId: string;
  private _complaintRegistrationActivityId: number;
  private _preliminaryInvestigationActivityId: number;
  private _closeComplaintActivityId: number;
  private _pendingComplaintActivityId: number;
  private _activityIdFieldName: string;
  private _resolutionOfComplaintsAtCustomerPlaceActivityId: number;
  private _analyseCustomerComplaintsAndActionPlanActivityId: number;
  private _menuDetails:any;
  private _dbFields: any;
  private _validComplaintFieldName: string;
  private _complaintLoggedByFieldName: string;
  private _complaintReceivedByOther: string;
  private _siteVisitActivityId: number;
  private _defaultActivityId: number;
  private _companyGstin: string;
  private _useForValue1: string;//DI
  private _useForValue2: string;//PI
  private _useFor: string[];

  get defaultActivityId(): number{
    return this._defaultActivityId;
  }
  set defaultActivityId(defaultActivityId: number){
    this._defaultActivityId = defaultActivityId;
  }
  
  get siteVisitActivityId(): number { 
    return this._siteVisitActivityId;
  }
  set siteVisitActivityId(siteVisitActivityId: number){
    this._siteVisitActivityId = siteVisitActivityId;
  }
  
  get complaintReceivedByOther():string{
    return this._complaintReceivedByOther;
  }

  set complaintReceivedByOther(complaintReceivedByOther:string){
    this._complaintReceivedByOther = complaintReceivedByOther;
  }
  get resolutionOfComplaintsAtCustomerPlaceActivityId(): number{
    return this._resolutionOfComplaintsAtCustomerPlaceActivityId;
  }
  set resolutionOfComplaintsAtCustomerPlaceActivityId(resolutionOfComplaintsAtCustomerPlaceActivityId: number){
    this._resolutionOfComplaintsAtCustomerPlaceActivityId = resolutionOfComplaintsAtCustomerPlaceActivityId;
  }

  get analyseCustomerComplaintsAndActionPlanActivityId(): number{
    return this._analyseCustomerComplaintsAndActionPlanActivityId;
  }
  set analyseCustomerComplaintsAndActionPlanActivityId(analyseCustomerComplaintsAndActionPlanActivityId: number) {
    this._analyseCustomerComplaintsAndActionPlanActivityId = analyseCustomerComplaintsAndActionPlanActivityId;
  }
  
  get authExpireInSec(): number {
    return this._authExpireInSec;
  }
  set authExpireInSec(authExpireInSec: number) {
    this._authExpireInSec = authExpireInSec;
  }

  get companyId(): string {
    return this._companyId;
  }
  set companyId(companyId: string) {
    this._companyId = companyId;
  }

  get diffBetwnCmplntRefDtAndLoggedOnDt(): number {
    return this._diffBetwnCmplntRefDtAndLoggedOnDt;
  }
  set diffBetwnCmplntRefDtAndLoggedOnDt(diffBetwnCmplntRefDtAndLoggedOnDt: number) {
    this._diffBetwnCmplntRefDtAndLoggedOnDt = diffBetwnCmplntRefDtAndLoggedOnDt;
  }
  get loginUserPassMaxLength(): number {
    return this._loginUserPassMaxLength;
  }
  set loginUserPassMaxLength(loginUserPassMaxLength: number) {
    this._loginUserPassMaxLength = loginUserPassMaxLength;
  }

   get loginUserPassMinLength(): number {
    return this._loginUserPassMinLength;
  }
  set loginUserPassMinLength(loginUserPassMinLength: number) {
    this._loginUserPassMinLength = loginUserPassMinLength;
  }

   get rolePrefix(): string {
    return this._rolePrefix;
  }
  set rolePrefix(rolePrefix: string) {
    this._rolePrefix = rolePrefix;
  }

  get areaSalesOrZonalManagerDesignationId(): string {
    return this._areaSalesOrZonalManagerDesignationId;
  }
  set areaSalesOrZonalManagerDesignationId(areaSalesOrZonalManagerDesignationId: string) {
    this._areaSalesOrZonalManagerDesignationId = areaSalesOrZonalManagerDesignationId;
  }

  get complaintRegistrationActivityId(): number {
    return this._complaintRegistrationActivityId;
  }
  set complaintRegistrationActivityId(complaintRegistrationActivityId: number) {
    this._complaintRegistrationActivityId = complaintRegistrationActivityId;
  }

   get preliminaryInvestigationActivityId(): number {
    return this._preliminaryInvestigationActivityId;
  }
  set preliminaryInvestigationActivityId(preliminaryInvestigationActivityId: number) {
    this._preliminaryInvestigationActivityId = preliminaryInvestigationActivityId;
  }

  get closeComplaintActivityId(): number {
    return this._closeComplaintActivityId;
  }
  set closeComplaintActivityId(closeComplaintActivityId: number) {
    this._closeComplaintActivityId = closeComplaintActivityId;
  }

  get pendingComplaintActivityId(): number {
    return this._pendingComplaintActivityId;
  }
  set pendingComplaintActivityId(pendingComplaintActivityId: number) {
    this._pendingComplaintActivityId = pendingComplaintActivityId;
  }

  get activityIdFieldName(): string{
    return this._activityIdFieldName;
  }
  set activityIdFieldName(activityIdFieldName: string){
    this._activityIdFieldName = activityIdFieldName;
  }
   get getMenuDetails():any{
    return this._menuDetails;
  }
  set menuDetails(menuDet:any){
     this._menuDetails = menuDet ;
  }

  get dbFields(): any{
    return this._dbFields;
  }
  set dbFields(dbFields: any){
    this._dbFields = dbFields;
  }

  get validComplaintFieldName(): string {
    return this._validComplaintFieldName;
  }
  set validComplaintFieldName(validComplaintFieldName: string) {
    this._validComplaintFieldName = validComplaintFieldName;
  }

  get complaintLoggedByFieldName(): string {
   return this._complaintLoggedByFieldName;
  }
  set complaintLoggedByFieldName(complaintLoggedByFieldName: string){
    this._complaintLoggedByFieldName = complaintLoggedByFieldName;
  }

  get companyGstin(): string {
    return this._companyGstin;
   }
   set companyGstin(companyGstin: string){
     this._companyGstin = companyGstin;
   }

   get useForValue1(): string {
    return this._useForValue1;
   }
   set useForValue1(useForValue1: string){
     this._useForValue1 = useForValue1;
   }

   get useForValue2(): string {
    return this._useForValue2;
   }
   set useForValue2(useForValue2: string){
     this._useForValue2 = useForValue2;
   }

   get useFor(): string[] {
    return this._useFor;
  }
  set useFor(useFor: string[]){
    this._useFor = useFor;
  }
}//end of class