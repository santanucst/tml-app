import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ROUTE_PATHS } from "../router-paths";

@Injectable()
export  class AuthenticationGuardService implements CanActivate {

  constructor(private router: Router,
              private localStorageService: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
  //   console.log("Route Guard: ",this.localStorageService);
  //   if (!this.localStorageService.user && !this.localStorageService.user.accessToken) {
  //     alert('Please login to continue');
  //     this.router.navigate([ROUTE_PATHS.RouteLogin]);
  //     return false;
  //   }
  //   return true;
  console.log("Route Guard: ",this.localStorageService);
    if (this.localStorageService.user && this.localStorageService.user.accessToken) {
      return true;
    }else{
      alert('Please login to continue');
      this.router.navigate([ROUTE_PATHS.RouteLander]);
      return false;
    }
  }
}
