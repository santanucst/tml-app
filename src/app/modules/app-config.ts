// Ctrl S
//const URL_IP: string = 'http://einvoice.tatametaliks.co.in';
const URL_IP: string = 'http://45.114.142.125';
//

// // for production
const URL_PORT: string = '8080';

//const APPLICATION: string = 'einvoicews';
//const APPLICATION: string = 'vendor-portal-prd';
const APPLICATION: string = 'vendor-portal';
 //const APPLICATION: string = 'einvoice';


// const URL_PATH: string = URL_IP + ':' + URL_PORT + '/';
// for testing
//const URL_PORT: string = '91';
const URL_PATH: string = URL_IP + ':' + URL_PORT + '/' + APPLICATION + '/';


export const AppUrlsConst: any = {
  LOGIN_URL: URL_PATH + 'webapi/user/login',
  //for File upload url
  FILE_UPLOAD_URL: URL_PATH + 'webapi/file/upload',
  //File Upload for Credit Note
  CREDIT_NOTE_FILE_UPLOAD_URL: URL_PATH + 'webapi/file/upload',
  
  //File Upload for Credit Note
  FILE_DOWNLOAD_URL: URL_PATH + 'webapi/file/download',

  //to delete File url
  FILE_DELETE_URL: URL_PATH + 'webapi/file/delete',
  //to get the desc of other docs url
  OTHERDOCS_DESC_URL: URL_PATH + 'webapi/file/desc',
  // To get po numbers of a specific vendor with vendor code
  PO_NO_OF_SPECIFIC_VENDOR_URL: URL_PATH + 'webapi/tran/pos',
  //To get item details of a specific po with vendor code, po number and item code of po under a specific vendor
  ITEM_DET_BY_PO_NO_URL: URL_PATH + 'webapi/tran/podet',

  //To get invoice no of a specific po with vendor code, po number and item code of po under a specific vendor
  INVOICE_NO_BY_VENDOE_CODE_AND_PO_NO: URL_PATH + 'webapi/tran/invnos',

  //To get all vendor details
  VENDOR_VIEW_DETAILS_URL: URL_PATH + 'webapi/tran/vendor/view',
  //To get all item details of po under a specific vendor
  ITEM_VIEW_DETAILS_URL: URL_PATH + 'webapi/tran/po/view',
  //Transaction Add url ---->> invoice add
  TRANSACTION_ADD_SUBMIT_URL: URL_PATH + 'webapi/tran/add',
  //Transaction Add url ---->> invoice add
  CREDIT_NOTE_ADD_SUBMIT_URL: URL_PATH + 'webapi/tran/crntadd',
  //Transaction Add url ---->> invoice add
  DEBIT_NOTE_ADD_SUBMIT_URL: URL_PATH + 'webapi/tran/drntadd',
  
  
  //po/invoice/item view details url
  PO_INVOICE_ITEM_VIEW_DETAILS_URL: URL_PATH + 'webapi/report/transview',

  //po invoice item counter url
  PO_INVOICE_ITEM_COUNTER_URL: URL_PATH + 'webapi/report/transviewcount',


  //all role urls
  ROLE_DETAILS_VAL: URL_PATH + 'webapi/admin/role',//get role details
  CREATE_ROLE_URL: URL_PATH + 'webapi/admin/role/create',//to create role
  UPDATE_ROLE_URL: URL_PATH + 'webapi/admin/role/update',//to update role
  VIEW_ROLE_URL: URL_PATH + 'webapi/admin/role/view',//To View All Role Details

  //all user urls for admin
  VIEW_USER_URL: URL_PATH + 'webapi/admin/user/view',//To View All User Details
  CREATE_USER_URL: URL_PATH + 'webapi/admin/user/create',//To Create User
  MODIFY_USER_URL: URL_PATH + 'webapi/admin/user/update',//to update user
  USER_DETAILS_URL: URL_PATH + 'webapi/admin/users',//to get user details

  //to get company details 
  COMPANY_DETAILS_URL: URL_PATH + 'webapi/set/compdet',//to get company details for tab
  //to update the company details
  COMPANY_DETAILS_UPDATE_URL: URL_PATH + 'webapi/set/compdet/update',//to update company details 


  //for user logout
  USER_LOGOUT: URL_PATH + 'webapi/user/logout',

  //url for forgotpassword
  USER_VERIFICATION_FOR_FORGOT_PASSWORD_URL: URL_PATH + 'webapi/user/forgotpass',
  REGENERATE_OTP_URL: URL_PATH + 'webapi/user/forgotpass',

  SIGN_UP_FOR_VENDOR_URL: URL_PATH + 'webapi/user/signup',

  //url for manage profile
  //  VIEW_USER_URL: URL_PATH + 'webapi/admin/user/view',
  ADD_USER_SEQURITY_QUESTION_VAL: URL_PATH + 'webapi/admin/secques/in',
  MANAGE_PROFILE_USER_SUBMIT_URL: URL_PATH + 'webapi/user/mngprofile',
  //end of manage profile url



}

export const WebServiceConst: any = {
  contentType: 'application/json',
  accept: 'application/json'
}


