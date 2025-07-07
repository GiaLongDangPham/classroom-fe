import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessageResponse } from '../../../../models/response/chat-message.response';
import { UserResponse } from '../../../../models/response/user.response';
import { ChatService } from '../../../../services/chat.service';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { Subscription } from 'rxjs';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  host: { class: 'flex-1 h-full' }
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() classroomId!: number;
  @Input() currentUser!: UserResponse;

  messages: ChatMessageResponse[] = [];
  newMessage: string = '';

  private messagesSub!: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.connectToWebSocket();
  }

  ngOnDestroy(): void {
    this.messagesSub?.unsubscribe();
    this.chatService.disconnect();
  }

  loadMessages() {
    this.chatService.getMessages(this.classroomId).subscribe({
      next: (res) => {
        this.messages = res;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Lỗi tải tin nhắn:', err)
    });
  }

  connectToWebSocket() {
    this.chatService.connect(this.classroomId);
    this.messagesSub = this.chatService.message$.subscribe((msg) => {
      if (!msg) return;
      this.messages = [...this.messages, msg];
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  sendMessage() {
    const content = this.newMessage.trim();
    if (!content || !this.currentUser.id) return;
    this.chatService.sendMessage(this.classroomId, content, this.currentUser.id);
    this.newMessage = '';
  }

  scrollToBottom() {
    const el = document.getElementById('chat-container');
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }

  formatTime(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  isCurrentUser(msg: ChatMessageResponse): boolean {
    return msg.user.id === this.currentUser.id;
  }

  shouldShowSenderInfo(index: number, msg: ChatMessageResponse): boolean {
    if (this.isCurrentUser(msg)) return false;
    if (index === 0) return true;
    return this.messages[index - 1].user.id !== msg.user.id;
  }
}
