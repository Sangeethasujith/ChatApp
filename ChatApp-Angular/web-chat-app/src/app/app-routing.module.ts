import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { LoginComponent } from './authentication/login/login.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [ 
  
  { path: '', component: LoginComponent },
  {path:'chat',component:ChatComponent},
  {path:'forgotpassword',component:ForgotPasswordComponent},
  {path:'resetPassword',component:ResetPasswordComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
