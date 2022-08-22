import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmValidatorService } from 'src/app/custom-validation/confirm-validator.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserRegistrationDto } from 'src/app/_interfaces/user/UserRegistrationDto';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  registerForm: FormGroup|any;
  
  constructor(private authService: AuthenticationService, private passConfValidator:ConfirmValidatorService,private router:Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    
    this.registerForm.get('confirm').setValidators([Validators.required, 
      this.passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
  }
  public validateControl = (controlName: string) => {
    return this.registerForm.get(controlName).invalid && this.registerForm.get(controlName).touched
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName).hasError(errorName)
  }
  public registerUser = (registerFormValue: any) => {
    const formValues = { ...registerFormValue };
    const user: UserRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm
    };
    this.authService.registerUser("api/register/Registration", user)
    .subscribe({
      next: (_) => {
                    console.log("Successful registration"),
                    this.router.navigate(["/authentication/login"])
                  },
      error: (err: HttpErrorResponse) => console.log(err.error.errors)
    })
  }

}
