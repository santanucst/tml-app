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

export class PortalSettingsDataService{

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

    //method for get Company Details by web service
    getCompanyDetails() {        
        this.actionUrl = AppUrlsConst.COMPANY_DETAILS_URL;
        this.headers = this.configService();

        return this.http.get(this.actionUrl, { headers: this.headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) })
    }//end of method getCompanyDetails

    //to update company details
    udateCompanyDetails(compDetJson: any){
        this.actionUrl = AppUrlsConst.COMPANY_DETAILS_UPDATE_URL;
        this.headers = this.configService();

        return this.http.patch(this.actionUrl,compDetJson,{ headers: this.headers })
        .map(this.successCallback)
        .catch(this.errorCallBack);
    }//end of method

    private successCallback(res: Response) {
        return res.json();
    }

    private errorCallBack(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }
}//end of class

