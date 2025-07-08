import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit , OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { ChatMessageResponse } from '../../../models/response/chat-message.response';
import { ClassroomResponse } from '../../../models/response/classroom.response';
import { UserResponse } from '../../../models/response/user.response';
import { Subscription } from 'rxjs';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent
  ],
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.scss'
})
export class MessageDetailComponent implements OnInit, OnDestroy {

  @Input() classroom!: ClassroomResponse;
  @Input() currentUser: UserResponse = {};
  @Output() messageSent = new EventEmitter<{ classroomId: number, content: string }>();

  messages: ChatMessageResponse[] = [];
  newMessage: string = '';
  private messagesSub!: Subscription;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    // Gọi API get message by classId
    this.loadMessages();
    this.connectToWebSocket();
    
  }

  ngOnDestroy(): void {
    this.messagesSub?.unsubscribe();
    this.chatService.disconnect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['classroom'] && !changes['classroom'].firstChange) {
      this.messagesSub?.unsubscribe();
      this.chatService.disconnect();

      this.loadMessages();          // Gọi lại khi chuyển lớp
      this.connectToWebSocket();    // Kết nối lại WebSocket
    }
  }

  loadMessages() {
    if (!this.classroom || !this.classroom.id) return;
    this.chatService.getMessages(this.classroom.id).subscribe({
      next: (res) => {
        this.messages = res;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Lỗi tải tin nhắn:', err)
    });
  }

  connectToWebSocket() {
    if (!this.classroom || !this.classroom.id) return;
    const classroomId = this.classroom.id; // Store the id to avoid undefined issues
    this.chatService.connect(classroomId);
    this.messagesSub = this.chatService.message$.subscribe((msg) => {
      debugger
      if (!msg) return;
      
      // Kiểm tra xem message đã tồn tại chưa (tránh duplicate từ optimistic update)
      const isDuplicate = this.messages.some(existingMsg => 
        existingMsg.content === msg.content && 
        existingMsg.user.id === msg.user.id &&
        Math.abs(new Date(existingMsg.sentAt).getTime() - new Date(msg.sentAt).getTime()) < 1000 // Trong vòng 1 giây
      );
      
      if (!isDuplicate) {
        this.messages = [...this.messages, msg];
        
        // Chỉ emit nếu message không phải từ current user (tránh duplicate emit)
        if (msg.user.id !== this.currentUser.id) {
          this.messageSent.emit({
            classroomId: classroomId,
            content: msg.content
          });
        }
      }

      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  sendMessage() {
    const content = this.newMessage.trim();
    if (!content || !this.currentUser.id || !this.classroom.id) return;

    // Emit ngay lập tức để cập nhật lastMessage (optimistic update)
    this.messageSent.emit({
      classroomId: this.classroom.id,
      content: content
    });

    this.chatService.sendMessage(this.classroom.id, content, this.currentUser.id);
    this.newMessage = '';
  }

  scrollToBottom() {
    const el = document.getElementById('chat-container');
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }

  isCurrentUser(msg: ChatMessageResponse): boolean {
    return msg.user.id === this.currentUser.id;
  }

  shouldShowAvatar(index: number, msg: ChatMessageResponse): boolean {
    if (this.isCurrentUser(msg)) return false;
    if (index === this.messages.length - 1) return true;
    return this.messages[index + 1].user.id !== msg.user.id;
  }

  shouldShowSenderInfo(index: number, msg: ChatMessageResponse): boolean {
    if (this.isCurrentUser(msg)) return false;
    if (index === 0) return true;
    return this.messages[index - 1].user.id !== msg.user.id;
  }

}
