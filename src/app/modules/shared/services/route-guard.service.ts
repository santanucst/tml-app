import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './local-storage.service';
import { ROUTE_PATHS } from "../../router/router-paths";


@Injectable()
export class RouteGuardService implements CanActivate {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.localStorageService.user.accessToken) {
      alert('Please login to continue');
      this.router.navigate([ROUTE_PATHS.RouteLogin]);
      return false;
    }
    return true;
  }

}
