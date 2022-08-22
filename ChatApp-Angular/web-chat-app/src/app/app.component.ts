
import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import {MessageDto } from 'src/app/Dto/MessageDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {
      
  }
}
