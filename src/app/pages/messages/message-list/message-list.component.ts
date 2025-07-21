import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, SimpleChanges, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ClassroomResponse } from '../../../shared/models/response/classroom.response';
import { ClassroomService } from '../../../core/services/classroom.service';
import { ApiResponse } from '../../../shared/models/api.response';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit, OnChanges {

  @Output() openChat = new EventEmitter<ClassroomResponse>();
  @Input() selectedClassroom?: ClassroomResponse;
  @Input() updatedMessage?: { classroomId: number, content: string };

  classList: ClassroomResponse[] = [];


  constructor(
    private classroomService: ClassroomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Gọi API lấy danh sách lớp học đã tham gia và tin nhắn cuối
    this.loadClassrooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['updatedMessage'] && this.updatedMessage) {
      console.log('Received updated message:', this.updatedMessage); // Debug log
      const { classroomId, content } = this.updatedMessage;
      
      // Tìm index của classroom cần update
      const classIndex = this.classList.findIndex(c => c.id === classroomId);
      if (classIndex !== -1) {
        // Tạo array mới để trigger change detection
        this.classList = this.classList.map((classroom, index) => {
          if (index === classIndex) {
            return { ...classroom, lastMessage: content };
          }
          return classroom;
        });
        console.log('Updated classList:', this.classList); // Debug log
        
        // Force change detection
        this.cdr.detectChanges();
      }
    }
  }


  loadClassrooms() {
    this.classroomService.getMyClasses().subscribe({
      next: (response: ApiResponse) => {
        this.classList = response.data as ClassroomResponse[];
      },
      error: (error) => {
        console.error('Error loading classrooms:', error);
      }
    });
  }

  isSelected(classroom: ClassroomResponse): boolean {
    return this.selectedClassroom?.id === classroom.id;
  }

}
