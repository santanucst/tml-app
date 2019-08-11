import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../../../../router/router-paths';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'otp-verification-modal-component',
  templateUrl: 'otp-verification-modal.component.html',
})
export class NgbdOTPVerificationModalComponent {
  @Input() modalTitle: string = "Info";
  @Input() modalMessage: string = "Temporary password has been sent to your registered email id. Please login with it and reset your password .";
  constructor(public activeModal: NgbActiveModal,
    private router: Router) {}

  public onClickOk(){
    this.router.navigate([ROUTE_PATHS.RouteLogin]);
    this.activeModal.close('Close click');
  }
}