import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from 'src/app/models/document.model';
import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  messages = this.socket.fromEvent<Message[]>('messages');
  lastMessage = this.socket.fromEvent<Message>('message');

  constructor(private socket: Socket) {}

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  editDocument(document: Document) {
    console.log(document);
    this.socket.emit('editDoc', document);
  }

  private docId() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  sendMessage(message: Message) {
    // console.log(message);
    this.socket.emit('SendMessage', message);
  }

  getMessages(id: string) {
    this.socket.emit('getMessages', id);
  }
}
