import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public isUserAuthenticated: boolean | undefined;
  isCollapsed: boolean = false;

  constructor(private authService: AuthenticationService,private router:Router) { }

  ngOnInit(): void {
    this.authService.authChanged.subscribe(res=>{this.isUserAuthenticated=res;}) 
  }

  public logout = () => {
    this.authService.logOut();
    this.router.navigate(["/"]);
  }
}
