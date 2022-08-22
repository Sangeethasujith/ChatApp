import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthResponseDto } from 'src/app/_interfaces/response/AuthResponseDto';
import { UserAuthenticationDto } from 'src/app/_interfaces/user/UserAuthenticationDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private returnUrl: string | undefined;

  loginForm!: FormGroup;
  errorMessage: string='';
  showError: boolean | undefined;
  firstName: string='';

  constructor(private authService:AuthenticationService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm=new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  validateControl=(controlName: string)=>{
    return this.loginForm?.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched
  }

  hasError=(contolName: string, errorName: string)=>{
    return this.loginForm?.get(contolName)?.hasError(errorName)
  }

  loginUser=(loginFormValue: any)=>{
    this.showError=false;
    const login={... loginFormValue};

    const userForAuth: UserAuthenticationDto={
      email: login.username,
      password: login.password
    }

    this.authService.loginUser('api/chat/login', userForAuth)
      .subscribe({
        next: (res:AuthResponseDto)=>{
          localStorage.setItem("token", res.token);
          localStorage.setItem("firstName",JSON.stringify(res.firstName));
          this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);          
          this.router.navigate(["/chat"]);
          console.log(res.firstName);
          this.firstName=res.firstName;
        },
        error: (err:HttpErrorResponse)=>{
          this.errorMessage=err.message;
          this.showError=true;
        }
      })
  }
}
