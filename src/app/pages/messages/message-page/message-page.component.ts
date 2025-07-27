import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageDetailComponent } from '../message-detail/message-detail.component';
import { ClassroomResponse } from '../../../shared/models/response/classroom.response';
import { UserResponse } from '../../../shared/models/response/user.response';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-message-page',
  standalone: true,
  imports: [
    CommonModule, 
    MessageListComponent, 
    MessageDetailComponent
  ],
  templateUrl: './message-page.component.html',
  styleUrl: './message-page.component.scss'
})
export class MessagePageComponent implements OnInit {

  selectedClassroom?: ClassroomResponse;
  currentUser: UserResponse = {};
  lastMessageUpdate?: { classroomId: number; content: string; timestamp?: Date };

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getUserFromLocalStorage() || {};
  }

  selectClassroom(classroom: ClassroomResponse) {
    this.selectedClassroom = classroom;
  }

  handleNewMessage(data: { classroomId: number, content: string }) {
    // Tạo object mới để ngOnChanges được thay đổi
    this.lastMessageUpdate = { ...data, timestamp: new Date() };
  }

}
