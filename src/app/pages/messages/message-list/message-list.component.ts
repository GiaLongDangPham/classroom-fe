import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, SimpleChanges, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ClassroomResponse } from '../../../shared/models/response/classroom.response';
import { ClassroomService } from '../../../core/services/classroom.service';
import { ApiResponse } from '../../../shared/models/api.response';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    TimeAgoPipe
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
    this.loadClassrooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['updatedMessage'] && this.updatedMessage) {
      const { classroomId, content } = this.updatedMessage;
      
      // Tìm index của classroom cần update
      const classIndex = this.classList.findIndex(c => c.id === classroomId);
      if (classIndex !== -1) {
        // Tìm lớp học và cập nhật lastMessage và lastMessageTimestamp
        this.classList = this.classList.map((classroom, index) => {
          if (index === classIndex) {
            return { ...classroom, lastMessage: content, lastMessageTimestamp: new Date() }; // Cập nhật lastMessage và timestamp
          }
          return classroom;
        });
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
