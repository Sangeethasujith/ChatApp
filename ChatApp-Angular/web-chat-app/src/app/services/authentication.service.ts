import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationResponseDto } from '../_interfaces/response/RegistrationResponseDto';
import { AuthResponseDto } from '../_interfaces/response/AuthResponseDto';
import { UserRegistrationDto } from '../_interfaces/user/UserRegistrationDto';
import { UserAuthenticationDto } from '../_interfaces/user/UserAuthenticationDto';
import { EnvironmentUrlService } from './environment.service';
import { Subject } from 'rxjs';
import { ForgotPassword } from '../_interfaces/ForgotPassword';
import { ResetPasswordDto } from '../_interfaces/ResetPasswordDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authChangeSub =new Subject<boolean>();
  public  authChanged=this.authChangeSub.asObservable();
    
  constructor(private http:HttpClient,private envUrl:EnvironmentUrlService) {}

  public sendAuthStateChangeNotification=(isAuthenticated: boolean)=>{
    this.authChangeSub.next(isAuthenticated);
  }
  public registerUser=(route:string, body: UserRegistrationDto)=>{
    return this.http.post<RegistrationResponseDto> (this.createCompleteRoute(route, this.envUrl.urlAddress),body);
  }

  public forgotPassword = (route: string, body: ForgotPassword) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }

  public resetPassword = (route: string, body: ResetPasswordDto) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body);
  }
  
  public loginUser=(route:string, body: UserAuthenticationDto)=>{
    return this.http.post<AuthResponseDto> (this.createCompleteRoute(route,this.envUrl.urlAddress),body);
  }
  private createCompleteRoute(route: string, envAddress: string): string {
    return `${envAddress}/${route}`;
  }

  public logOut=()=>{
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }

}
