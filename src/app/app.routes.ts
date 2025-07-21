import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'classroom',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/classroom/classroom.routes').then(m => m.CLASSROOM_ROUTES)
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/messages/messages.routes').then(m => m.MESSAGES_ROUTES)
  }
];