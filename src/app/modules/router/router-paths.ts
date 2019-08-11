const ROUTE_LANDER: string = "vendorportal";
const ROUTE_LANDER_FULL: string = "/" + ROUTE_LANDER;

const ROUTE_LOGIN: string = "login";
const ROUTE_LOGIN_WITH_PARAMETER: string = ROUTE_LOGIN + '/' + ':userType';
const ROUTE_LOGIN_FULL: string = "/" + ROUTE_LOGIN;

//added for forgot password
const ROUTE_FORGOT_PASSWORD: string = "forgotpassword";
const ROUTE_FORGOT_PASSWORD_WITH_PARAMETER: string  = ROUTE_FORGOT_PASSWORD + '/' + ':userType';
const ROUTE_FORGOT_PASSWORD_WITH_PARAMETER_FULL: string  =  ROUTE_FORGOT_PASSWORD;


//added for siugn up
const ROUTE_SIGN_UP: string = "signup";
const ROUTE_SIGN_UP_FULL: string = "/" + ROUTE_SIGN_UP;

//for otp generator
const ROUTE_OTP_GENERATOR: string = "otpgenerator";
const ROUTE_OTP_GENERATOR_WITH_PARAMETER: string  = ROUTE_OTP_GENERATOR +'/'+ ':userType' + '/' + ':userId';
const ROUTE_OTP_GENERATOR_WITH_PARAMETER_FULL: string  =  ROUTE_OTP_GENERATOR;



//for otp verification
const ROUTE_OTP_VERIFICATION: string = "otpverification";
const ROUTE_OTP_VERIFICATION_FULL: string = "/"+ ROUTE_OTP_VERIFICATION;
const ROUTE_OTP_VERIFICATION_WITH_PARAMETER: string  = ROUTE_OTP_VERIFICATION +'/'+ ':userType' +'/' + ':userId';
const ROUTE_OTP_VERIFICATION_WITH_PARAMETER_FULL: string  =  ROUTE_OTP_VERIFICATION;

//logout
const ROUTE_LOGOUT: string = "logout";
const ROUTE_LOGOUT_FULL: string = "/" + ROUTE_LOGOUT;

//home
const ROUTE_HOME: string = "home";
const ROUTE_HOME_FULL: string = "/" + ROUTE_HOME;

//dashboard
const ROUTE_DASHBOARD: string = "dashboard";
const ROUTE_DASHBOARD_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_DASHBOARD;

//manage profile
const ROUTE_MANAGE_PROFILE : string = "manageprofile";
const ROUTE_MANAGE_PROFILE_FULL : string = ROUTE_HOME_FULL + "/" + ROUTE_MANAGE_PROFILE;

//portal-settings
const ROUTE_PORTAL_SETTINGS: string = "portalsettings";
const ROUTE_PORTAL_SETTINGS_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_PORTAL_SETTINGS;

//for invoice add
const ROUTE_INVOICE_ADD: string = "invoiceadd";
const ROUTE_INVOICE_ADD_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_INVOICE_ADD;

//vendor code search/add
const ROUTE_VENDOR_CODE_SEARCH: string = "vendorcodesearch" ;
const ROUTE_VENDOR_CODE_SEARCH_WITH_PARAMETER: string = "vendorcodesearch"+ "/"+ ":invoiceCreditNoRouteParam";
const ROUTE_VENDOR_CODE_SEARCH_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_VENDOR_CODE_SEARCH;

//route invoice add/edit page after selecting vendor code
const ROUTE_INVOICE_ADD_WITH_VENDOR_CODE: string =  "invoiceadd" + "/" + ":vendorCode";
const ROUTE_INVOICE_ADD_WITH_VENDOR_CODE_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_INVOICE_ADD; 

//for credit note add
const ROUTE_CREDIT_NOTE_ADD: string = "creditnoteadd";
const ROUTE_CREDIT_NOTE_ADD_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_CREDIT_NOTE_ADD;

//route credit note add/edit page after selecting vendor code
const ROUTE_CREDIT_NOTE_ADD_WITH_VENDOR_CODE: string =  "creditnoteadd" + "/" + ":vendorCode";
const ROUTE_CREDIT_NOTE_ADD_WITH_VENDOR_CODE_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_CREDIT_NOTE_ADD; 

//for debit note add 25.10.18
const ROUTE_DEBIT_NOTE_ADD: string = "debitnoteadd";
const ROUTE_DEBIT_NOTE_ADD_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_DEBIT_NOTE_ADD;

//route debit note add/edit page after selecting vendor code 25.10.18
const ROUTE_DEBIT_NOTE_ADD_WITH_VENDOR_CODE: string =  "debitnoteadd" + "/" + ":vendorCode";
const ROUTE_DEBIT_NOTE_ADD_WITH_VENDOR_CODE_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_DEBIT_NOTE_ADD; 

//for total po view
const ROUTE_PO_DET_VIEW: string = "podetview";
const ROUTE_PO_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_PO_DET_VIEW;

//for total invoice view
const ROUTE_INVOICE_DET_VIEW: string = "invoicedetview";
const ROUTE_INVOICE_DET_VIEW_WITH_PO: string = "invoicedetview" + "/" + ":pono" + "/" + ":postatus";
const ROUTE_INVOICE_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_INVOICE_DET_VIEW;

//for total invoice-item view
const ROUTE_INVOICE_ITEM_DET_VIEW: string = "invoiceitemdetview";
const ROUTE_INVOICE_ITEM_DET_VIEW_WITH_TRANSACTION_NO: string = "invoiceitemdetview" + "/" + ":transactionnumber" + "/" + ":invoicestatus" ;
const ROUTE_INVOICE_ITEM_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_INVOICE_ITEM_DET_VIEW;

//for total credit note view
const ROUTE_CREDIT_NOTE_DET_VIEW: string = "creditnotedetview";
const ROUTE_CREDIT_NOTE_DET_VIEW_WITH_INVOICE_NO: string = "creditnotedetview" + "/" + ":invoiceno" + "/" + ":invoicestatus";
const ROUTE_CREDIT_NOTE_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_CREDIT_NOTE_DET_VIEW;

//for total creditNote-item view
const ROUTE_CREDIT_NOTE_ITEM_DET_VIEW: string = "creditnoteitemdetview";
const ROUTE_CREDIT_NOTE_ITEM_DET_VIEW_WITH_INVOICE_NO: string = "creditnoteitemdetview" + "/" + ":credinoteeno" + "/" + ":creditnotetatus" ;
const ROUTE_CREDIT_NOTE_ITEM_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_CREDIT_NOTE_ITEM_DET_VIEW;

//for total debit note view 25.10.18
const ROUTE_DEBIT_NOTE_DET_VIEW: string = "debitnotedetview";
const ROUTE_DEBIT_NOTE_DET_VIEW_WITH_INVOICE_NO: string = "debitnotedetview" + "/" + ":invoiceno" + "/" + ":invoicestatus";
const ROUTE_DEBIT_NOTE_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_DEBIT_NOTE_DET_VIEW;

//for total debit note item view 25.10.18
const ROUTE_DEBIT_NOTE_ITEM_DET_VIEW: string = "debitnoteitemdetview";
const ROUTE_DEBIT_NOTE_ITEM_DET_VIEW_WITH_INVOICE_NO: string = "debitnoteitemdetview" + "/" + ":debinoteeno" + "/" + ":debitnotetatus" ;
const ROUTE_DEBIT_NOTE_ITEM_DET_VIEW_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_DEBIT_NOTE_ITEM_DET_VIEW;



//route_paths for user 
const ROUTE_USER_CONST: string = "user";
const ROUTE_VIEW_MODIFY_USER: string = ROUTE_USER_CONST + "/" + ':vieweditparam';//view/modify
const ROUTE_VIEW_MODIFY_USER_FULL: string = ROUTE_HOME_FULL + "/" +ROUTE_USER_CONST;
const ROUTE_VIEW_USER_WITH_PARAMETER: string = ROUTE_USER_CONST +  "/view/" + ':userId';
const ROUTE_MODIFY_USER_WITH_PARAMETER: string = ROUTE_USER_CONST + "/modify/" + ':userId';//modify of a specific userId
const ROUTE_VIEW_USER_FULL: string = ROUTE_HOME_FULL + "/" +ROUTE_USER_CONST + "/view";
const ROUTE_MODIFY_USER_FULL: string = ROUTE_HOME_FULL + "/" +ROUTE_USER_CONST + "/modify";
const ROUTE_ADD_USER: string = "user/add";
const ROUTE_ADD_USER_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_ADD_USER;

//route paths for role
const ROUTE_ROLE_CONST: string = "role";
const ROUTE_VIEW_MODIFY_ROLE: string = ROUTE_ROLE_CONST + "/" + ':vieweditparam';//view/modify
const ROUTE_VIEW_MODIFY_ROLE_FULL: string = ROUTE_HOME_FULL + "/" +ROUTE_ROLE_CONST;
const ROUTE_VIEW_ROLE_WITH_PARAMETER: string = ROUTE_ROLE_CONST +  "/view/" + ':roleId';
const ROUTE_MODIFY_ROLE_WITH_PARAMETER: string = ROUTE_ROLE_CONST + "/modify/" + ':roleId';//modify of a specific role id
const ROUTE_VIEW_ROLE_FULL: string = ROUTE_HOME_FULL + "/" +ROUTE_ROLE_CONST + "/view";
const ROUTE_MODIFY_ROLE_FULL: string = ROUTE_HOME_FULL + "/" +ROUTE_ROLE_CONST + "/modify";
const ROUTE_ADD_ROLE: string = "role/add";
const ROUTE_ADD_ROLE_FULL: string = ROUTE_HOME_FULL + "/" + ROUTE_ADD_ROLE;


// Full route path (/login, /home/dashboard etc.)
export const ROUTE_PATHS = {
    RouteLander: ROUTE_LANDER_FULL,//lander 
    RouteLogin: ROUTE_LOGIN_FULL,//login
    RouteForgotPassword: ROUTE_FORGOT_PASSWORD_WITH_PARAMETER_FULL,//added for forgot password
    RouteSignUp: ROUTE_SIGN_UP_FULL,//sign up router
    RouteOTPGenerator: ROUTE_OTP_GENERATOR_WITH_PARAMETER_FULL,//otp generator
    RouteOTPVerification: ROUTE_OTP_VERIFICATION_WITH_PARAMETER_FULL,//otp verification
    RouteLogout: ROUTE_LOGOUT_FULL,//logout
    RouteHome: ROUTE_HOME_FULL,//home
    RouteDashboard: ROUTE_DASHBOARD_FULL,//dashboard
    RouteManageProfile: ROUTE_MANAGE_PROFILE_FULL,//manage profile
    RoutePortalSettings: ROUTE_PORTAL_SETTINGS_FULL,//portal-settings
    RouteInvoiceAdd: ROUTE_INVOICE_ADD_FULL,//invoice add
    RouteVendorCodeSearch: ROUTE_VENDOR_CODE_SEARCH_FULL,//search vendor code
    RouteInvoiceAddWithVendorCode: ROUTE_INVOICE_ADD_WITH_VENDOR_CODE_FULL,//invoice add with vendor code
    RouteCreditNoteAdd: ROUTE_CREDIT_NOTE_ADD_FULL,//credit note add
    RouteDebitNoteAdd: ROUTE_DEBIT_NOTE_ADD_FULL,//debit note add 25.10.18
    RouteCreditNoteAddWithVendorCode: ROUTE_CREDIT_NOTE_ADD_WITH_VENDOR_CODE_FULL,//credit note add with vendor code
    RouteDebitNoteAddWithVendorCode: ROUTE_DEBIT_NOTE_ADD_WITH_VENDOR_CODE_FULL,//debit note add with vendor code 25.10.18
    RoutePODetView: ROUTE_PO_DET_VIEW_FULL,//Total PO view
    RouteInvoiceDetView: ROUTE_INVOICE_DET_VIEW_FULL,//total invoice det view
    RouteInvoiceItemDetView: ROUTE_INVOICE_ITEM_DET_VIEW_FULL,//invoice item details view
    RouteCreditNoteDetView: ROUTE_CREDIT_NOTE_DET_VIEW_FULL,//credit note det view
    RouteDebitNoteDetView: ROUTE_DEBIT_NOTE_DET_VIEW_FULL,//debit note det view 25.10.18
    RouteCreditNoteItemDetView: ROUTE_CREDIT_NOTE_ITEM_DET_VIEW_FULL,//credit item details view
    RouteDebitNoteItemDetView: ROUTE_DEBIT_NOTE_ITEM_DET_VIEW_FULL,//debit note item details view 25.10.18
    RouteAddUser: ROUTE_ADD_USER_FULL,//add role
    RouteViewModifyUser: ROUTE_VIEW_MODIFY_USER_FULL,//user view/modify from menu
    RouteViewUser: ROUTE_VIEW_USER_FULL,//view user by specific user id
    RouteModifyUser: ROUTE_MODIFY_USER_FULL,//modify user by specific user id
    RouteAddRole: ROUTE_ADD_ROLE_FULL,//add role
    RouteViewModifyRole: ROUTE_VIEW_MODIFY_ROLE_FULL,//role view/modify from menu
    RouteViewRole: ROUTE_VIEW_ROLE_FULL,//view role by specific role id
    RouteModifyRole: ROUTE_MODIFY_ROLE_FULL,//modify role by specific role id
}
// Router names (like login, home, dashboard etc.)
export const ROUTER_PATHS = {
    LanderRouter: ROUTE_LANDER,//lander
    LoginRouter: ROUTE_LOGIN_WITH_PARAMETER,//login
    LoginWithUserType: ROUTE_LOGIN_WITH_PARAMETER,//login with parameter
    ForgotPasswordRouter: ROUTE_FORGOT_PASSWORD_WITH_PARAMETER,//added for forgot password
    SignUpRouter: ROUTE_SIGN_UP,//sign up router
    OTPGeneratorRouter: ROUTE_OTP_GENERATOR_WITH_PARAMETER,//otp generator
    OTPVerificationRouter: ROUTE_OTP_VERIFICATION_WITH_PARAMETER,//otp verification
    LogoutRouter: ROUTE_LOGOUT,//logout
    HomeRouter: ROUTE_HOME,//home
    DashboardRouter: ROUTE_DASHBOARD,//dashboard
    ManageProfileRouter: ROUTE_MANAGE_PROFILE,//manage profile
    PortalSettingsRouter: ROUTE_PORTAL_SETTINGS,//portal-settings
    InvoiceAddRouter: ROUTE_INVOICE_ADD,//invoice add
    VendorCodeSearchRouter: ROUTE_VENDOR_CODE_SEARCH_WITH_PARAMETER,//vendor code search 
    InvoiceAddWithVendorCodeRouter: ROUTE_INVOICE_ADD_WITH_VENDOR_CODE,//invoice add with vendor code
    CreditNoteAddRouter: ROUTE_CREDIT_NOTE_ADD,//credit note add
    DebitNoteAddRouter: ROUTE_DEBIT_NOTE_ADD,//debit note add 25.10.18
    CreditNoteAddWithVendorCodeRouter: ROUTE_CREDIT_NOTE_ADD_WITH_VENDOR_CODE,//credit note add with vendor code
    DebitNoteAddWithVendorCodeRouter: ROUTE_DEBIT_NOTE_ADD_WITH_VENDOR_CODE,//debit note add with vendor code 25.10.18
    PODetViewRouter: ROUTE_PO_DET_VIEW,//po det view
    InvoiceDetViewRouter: ROUTE_INVOICE_DET_VIEW_WITH_PO,//invoice details view with pono n po status
    InvoiceItemDetViewRouter: ROUTE_INVOICE_ITEM_DET_VIEW_WITH_TRANSACTION_NO,//invoice item details view with pono n po status n transaction no
    CreditNoteDetViewRouter: ROUTE_CREDIT_NOTE_DET_VIEW_WITH_INVOICE_NO,//credit note view with invoice no
    DebitNoteDetViewRouter: ROUTE_DEBIT_NOTE_DET_VIEW_WITH_INVOICE_NO,//debit note view with invoice no 25.10.18
    CreditNoteItemDetViewRouter: ROUTE_CREDIT_NOTE_ITEM_DET_VIEW_WITH_INVOICE_NO,//credit note item det view
    DebitNoteItemDetViewRouter: ROUTE_DEBIT_NOTE_ITEM_DET_VIEW_WITH_INVOICE_NO,//debit note item det view 25.10.18
    AddUserRouter: ROUTE_ADD_USER,//add USER
    ViewModifyUserRouter: ROUTE_VIEW_MODIFY_USER,//view/modify USER
    ViewUserWithParameterRouter: ROUTE_VIEW_USER_WITH_PARAMETER,//view USER with parameter
    ModifyUserWithParameterRouter: ROUTE_MODIFY_USER_WITH_PARAMETER,//modify USER with parameter
    AddRoleRouter: ROUTE_ADD_ROLE,//add role
    ViewModifyRoleRouter: ROUTE_VIEW_MODIFY_ROLE,//view/modify role
    ViewRoleWithParameterRouter: ROUTE_VIEW_ROLE_WITH_PARAMETER,//view role with parameter
    ModifyRoleWithParameterRouter: ROUTE_MODIFY_ROLE_WITH_PARAMETER//modify role with parameter
   
}
