import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
//new add for route
import { ROUTE_PATHS } from '../../../router/router-paths';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { TilesInteractionService } from "../../../dashboard/services/tiles-interaction.service";

@Component({
  selector: 'ispl-widget-tiles',
  templateUrl: 'tiles.component.html',
  styleUrls: ['tiles.component.css']
})
export class Tiles {
  @Input() tiles: any;
  public tempPlantType: string = '';//for rolename
  public commonRoute: string;//for di/pi route

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private tilesInteractionService: TilesInteractionService,

  ) {
    this.tempPlantType = this.localStorageService.user.plantType;

  }
  //method to route view complaint di page
  buttonClick(clickParam) {
    console.log("clickParam: ", clickParam);

    if(this.tiles && this.tiles.wsFilter){
      this.tilesInteractionService.wsFilter = this.tiles.wsFilter;
      
    }

    if (this.tempPlantType === 'DI' || this.tempPlantType == 'BOTH') {
      //this.commonRoute = ROUTE_PATHS.RouteComplaintDIViewWithParameter;
    } else if (this.tempPlantType === 'PI') {
      //this.commonRoute = ROUTE_PATHS.RouteComplaintPIViewWithParameter;
    }
    if (this.tempPlantType === 'ADMN'){
      if(clickParam === 'role'){
        //this.router.navigate([ROUTE_PATHS.RouteViewRole]);
      }else{
        //this.router.navigate([ROUTE_PATHS.RouteViewUser]);
      }
    }else{
      this.router.navigate([this.commonRoute,clickParam]);
    }
  }
}
