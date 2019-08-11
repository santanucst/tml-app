import { ROUTE_PATHS } from '../../router/router-paths';

export class MenuWsMapModel{
   private _userMenuIcons:any={
    SMM0000001:'fa fa-book',   
    SMM0000002:'fa fa-book',
    SMM0000003:'fa fa-clipboard',//'fa fa-gears',
    SMM0000004:'fa fa-pie-chart',
    SMM0000005:'fa fa-pie-chart',
   } 
   private _userMenu:any ={
    homeNavigation: '#'+ROUTE_PATHS.RouteDashboard,//dashboard
    logout: '#'+ROUTE_PATHS.RouteLogout,//logout
    manageProfile: '#'+ROUTE_PATHS.RouteManageProfile,//manage profile
    // SMM0000003:
    SSM0000015: '#'+ROUTE_PATHS.RoutePortalSettings,//portal-settings
    // invoiceAddEdit
    SSM0000012: '#'+ROUTE_PATHS.RouteInvoiceAdd,//invoice add
    //credit note no
    SSM0000013: '#'+ROUTE_PATHS.RouteCreditNoteAdd,//credit note add
    SSM0000017: '#'+ ROUTE_PATHS.RoutePODetView,//po view
    //debit note 25.10.18
    SSM0000018: '#'+ROUTE_PATHS.RouteDebitNoteAdd,//debit note 25.10.18
    //user management
    SSM0000002: '#'+ROUTE_PATHS.RouteAddUser,//add user
    SSM0000004: '#'+ROUTE_PATHS.RouteViewModifyUser+'/view',//view user
    SSM0000003: '#'+ROUTE_PATHS.RouteViewModifyUser+'/modify',//modify user     
    //role management
    SSM0000007: '#'+ROUTE_PATHS.RouteAddRole,//add role
    SSM0000009: '#'+ROUTE_PATHS.RouteViewModifyRole+'/view',//view role
    SSM0000008: '#'+ROUTE_PATHS.RouteViewModifyRole+'/modify'//modify role
    
   };

   get userMenu(): any {
      return this._userMenu ;
   } 

   get userMenuIcons():any{
       return this._userMenuIcons;
   }
}

