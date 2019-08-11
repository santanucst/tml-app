import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class FileDownloadService {

    private actionUrl: string;
    private headers: Headers;
    private userType:string;
    
    constructor(
      private http: Http,
      private localStorageService: LocalStorageService) {
        console.log("constructor of FileDownloadService class");
      }
      
      private configService(): Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'bearer ' + this.localStorageService.user.accessToken);
        headers.append('userId', this.localStorageService.user.userId);
        return headers;
      }//end of configService method


    //method to download file
    downloadFile(fileDetails: any) {
        this.headers = this.configService();
        this.actionUrl = AppUrlsConst.FILE_DOWNLOAD_URL;
        return this.http.post(this.actionUrl, fileDetails, { headers: this.headers })
          .map(this.successCallback)
          .catch(this.errorCallBack);
      }//end of method to download file    
      
      private successCallback(res: Response) {
        return res.json();
      }
    
      private errorCallBack(error: Response) {
        console.log(error);
        return Observable.throw(error);
      }      
}//end calss


