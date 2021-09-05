import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { Message } from '../../models/message';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChatboxComponent implements OnInit {
  currentMessage: Message;
  messages: Message[];
  setMsg: any;
  private _docSub: Subscription;

  constructor(private documentService: DocumentService) {
    this.currentMessage = new Message();
    this.messages = [];
    this._docSub = new Subscription();
  }

  ngOnInit(): void {
    this._docSub = this.documentService.lastMessage.subscribe((msg) => {
      this.currentMessage.id = msg.id;
      this.messages = [msg];
      this.setMsg = msg;
      console.log(msg);
      console.log(this.messages);
    });
  }

  sendMessage() {
    this.messages.push(this.currentMessage);
    this.documentService.sendMessage(this.currentMessage);
  }

  getMessages(id: string) {
    this.documentService.getMessages(id);
  }
}
