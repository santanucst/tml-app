import { Injectable } from '@angular/core';
import { UserModel } from "../models/user-model";
import { AppSettingsModel } from "../models/app-settings-model";
import { DBSettingsModel } from "../models/db-Settings-model";
@Injectable()
export class LocalStorageService {

  private _user: UserModel;
  private _appSettings: AppSettingsModel;
  private _dbSettings: DBSettingsModel;
  private _userType: string;

  get user(): UserModel {
    return this._user;
  }
  set user(userModel: UserModel) {
    this._user = userModel;
  }

   get appSettings(): AppSettingsModel {
    return this._appSettings;
  }
  set appSettings(appSettings: AppSettingsModel) {
    this._appSettings = appSettings;
  }

  get dbSettings():  DBSettingsModel{
    return this._dbSettings;
  }
  set dbSettings(dbSettings: DBSettingsModel) {
    this._dbSettings = dbSettings;
  }
  get userType(): string {
    return this._userType;
  }
  set userType(userType: string) {
    this._userType = userType;
  }  

}
