import { Component } from '@angular/core';
import { ClassroomListComponent } from "./classroom-list/classroom-list.component";
@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [
    ClassroomListComponent,
],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.scss'
})
export class ClassroomComponent {}
