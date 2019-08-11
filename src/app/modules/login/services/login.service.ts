import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';

@Injectable()
export class LoginService {
    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http) {

    }

    private configService() {
        this.actionUrl = AppUrlsConst.LOGIN_URL;

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    authenticate(user: any, userType: string) {
        this.configService();

        return this.http.post(this.actionUrl+"/"+userType , user, { headers: this.headers })
            .map(this.successCallback)
            .catch(this.errorCallBack);
    }

    private successCallback(res: Response) {
        return res.json();
    }

    private errorCallBack(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }
}
