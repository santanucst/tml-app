import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ToastService {

  private _toastElementRef: ToastrService;

  get toastElementRef(): ToastrService {
    return this._toastElementRef;
  }

  set toastElementRef(toastElementRef: ToastrService) {
    this._toastElementRef = toastElementRef;
  }
}
