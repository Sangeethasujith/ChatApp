import { Component, OnInit } from '@angular/core';
import { MessageDto } from '../Dto/MessageDto';

import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: MessageDto) => { this.addToInbox(receivedObj);});  // calls the service method to get the new messages sent
                                           
  }

  msgDto: MessageDto = new MessageDto();
  msgInboxArray: MessageDto[] = [];
  
  send(): void {
   
    
    if(this.msgDto) {
      this.msgDto.user=JSON.parse(localStorage.getItem('firstName')||'{}');
      if(this.msgDto.user.length == 0 || this.msgDto.msgText.length == 0){
        window.alert("Both fields are required.");
        return;
      } else {
        
        this.chatService.broadcastMessage(this.msgDto);                   // Send the message via a service
      }
    }
  }

  addToInbox(obj: MessageDto) {
    let newObj = new MessageDto();
    newObj.user = obj.user;
    newObj.msgText = obj.msgText;
    newObj.date=new Date();
    this.msgInboxArray.push(newObj);
    console.log("obj"+newObj.date);
  }

}
