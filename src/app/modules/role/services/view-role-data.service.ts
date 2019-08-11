import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from "../../shared/services/local-storage.service";

@Injectable()
export class ViewRoleDataService {

    private actionUrl: string;
    private headers: Headers;

    constructor(
        private http: Http,
        private localStorageService: LocalStorageService) {

    }
    private configService(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorageService.user.accessToken);
        headers.append('userId', this.localStorageService.user.userId);
        return headers;
      }//end of configService method


    //method for get user view details by web service
    getRoleViewDetails(sortData?: string, orderType?: string) {

        if (sortData.trim() != "" && orderType.trim() != "") {
            this.actionUrl = AppUrlsConst.VIEW_ROLE_URL + "/" + sortData + "/" + orderType;
        }
        else {
            this.actionUrl = AppUrlsConst.VIEW_ROLE_URL;
        }

        this.headers = this.configService();

        return this.http.get(this.actionUrl, { headers: this.headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) })
    }//end of method getUserViewDetails

   


    

}//end of class

