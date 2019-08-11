import { Routes, RouterModule } from '@angular/router';
import { LanderComponent } from "../lander/components/lander.component";
import { LoginComponent } from '../login/components/login.component';
import { UserVerificationComponent } from '../forgot-password/components/user-verification/user-verification.component';
import { OTPVerificationComponent } from '../forgot-password/components/otp-verification/components/otp-verification.component';
import { OTPGeneratorComponent } from '../forgot-password/components/otp-generator/components/otp-generator.component';
import { ROUTER_PATHS, ROUTE_PATHS } from './router-paths';
import { LogoutComponent } from "../logout/components/logout.component";
import { SignUpComponent } from "../sign-up/components/sign-up.component";
import { HOME_ROUTES } from "./home-router.module";

export const APP_ROUTES: Routes = [
  // { path: '', redirectTo: ROUTER_PATHS.LoginRouter, pathMatch: 'full' },
  { path: ROUTER_PATHS.LanderRouter, component: LanderComponent},//lander-screen
  { path: '', redirectTo: ROUTER_PATHS.LanderRouter, pathMatch: 'full' },
  { path:  ROUTER_PATHS.ForgotPasswordRouter, component: UserVerificationComponent },//added for forgot password
  { path:  ROUTER_PATHS.SignUpRouter, component: SignUpComponent },//added for sign up
  { path: ROUTER_PATHS.OTPGeneratorRouter, component: OTPGeneratorComponent },//for otp generator
  { path: ROUTER_PATHS.OTPVerificationRouter, component: OTPVerificationComponent },
  { path: ROUTER_PATHS.LoginRouter, component: LoginComponent },
  { path: ROUTER_PATHS.LogoutRouter, component: LogoutComponent },
  ...HOME_ROUTES
  
];

export const ROUTER_MODULE = RouterModule.forRoot(APP_ROUTES, { useHash: true });
