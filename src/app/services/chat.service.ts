import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Ensure you have the correct path to your environment file
import { ChatMessageResponse } from '../models/response/chat-message.response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = environment.apiBaseUrl + '/chat'; 

  private stompClient: Client | null = null;
  public message$: BehaviorSubject<ChatMessageResponse | null> = new BehaviorSubject<ChatMessageResponse | null>(null);
  
  constructor(
    private http: HttpClient
  ) { }


  connect(classroomId: number) {
    if (this.stompClient) {
      // Ngắt kết nối cũ (nếu đang kết nối)
      this.stompClient.deactivate();
      this.stompClient = null;
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.stompClient?.subscribe(
        `/topic/classroom/${classroomId}`, 
        (message) => {
          const msg = JSON.parse(message.body);
          this.message$.next(msg);
        }
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  sendMessage(classroomId: number, content: string, senderId: number) {
    if (!this.stompClient || !this.stompClient.connected) return;
    
    this.stompClient.publish({
      destination: `/app/chat.sendMessage/${classroomId}`,
      body: JSON.stringify({ content, senderId })
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;  // Quan trọng để lần sau connect lại
    }
  }

  getMessages(classroomId: number): Observable<ChatMessageResponse[]> {
    return this.http.get<ChatMessageResponse[]>(`${this.baseUrl}/${classroomId}`);
  }
}
