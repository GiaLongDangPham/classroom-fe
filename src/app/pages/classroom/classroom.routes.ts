import { Routes } from '@angular/router';
import { ClassroomComponent } from './classroom.component';
import { ClassroomDetailComponent } from '../classroom-detail/classroom-detail.component';
import { ClassroomListComponent } from './classroom-list/classroom-list.component';

export const CLASSROOM_ROUTES: Routes = [
  { path: '', component: ClassroomListComponent },
  { path: ':id', component: ClassroomDetailComponent }
];