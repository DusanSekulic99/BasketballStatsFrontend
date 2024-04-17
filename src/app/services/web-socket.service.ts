import {Injectable} from '@angular/core';

import {Observable} from "rxjs";
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket = new SockJs("http://localhost:8080/websocket")
  stompClient = Stomp.over(this.socket);


  subscribe(topic: string, callback: any) : void {
    const connected: boolean = this.stompClient.connected;
    if(connected) {
      this.subscribeToTopic(topic, callback);
      return;
    }

    this.stompClient.connect({}, () : any => {
      this.subscribeToTopic(topic, callback);
    })
  }

  private subscribeToTopic(topic: string, callback: any) {
    this.stompClient.subscribe(`/topic/${topic}` , (): any => {
      callback();
    })
  }
}
