import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClassroomListComponent } from "./classroom-list/classroom-list.component";
@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ClassroomListComponent
],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.scss'
})
export class ClassroomComponent {

  constructor(private authService: AuthService) {}

  
}
