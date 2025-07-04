import { Routes } from '@angular/router';
import { ClassroomComponent } from './classroom.component';
import { ClassroomDetailComponent } from './classroom-detail/classroom-detail.component';


export const CLASSROOM_ROUTES: Routes = [
  { path: '', component: ClassroomComponent },
  { path: ':id', component: ClassroomDetailComponent }
];