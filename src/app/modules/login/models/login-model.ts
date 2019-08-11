export class LoginModel {
  private _userId: string;
  private _password: string;

  get userId(): string {
    return this._userId;
  }
  set userId(userId: string) {
    this._userId = userId;
  }

  get password(): string {
    return this._password;
  }
  set password(password: string) {
    this._password = password;
  }
}
