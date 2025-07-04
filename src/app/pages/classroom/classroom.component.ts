import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    
  ],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.scss'
})
export class ClassroomComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
    // window.location.href = '/login'; // Redirect to login page
  }
}
