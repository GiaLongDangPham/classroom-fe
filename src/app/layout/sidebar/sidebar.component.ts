import { Component } from '@angular/core';
import { UserResponse } from '../../models/response/user.response';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models/api.response';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  currentUser: UserResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getMyProfile().subscribe({
      next: (res: ApiResponse) => this.currentUser = res.data,
      error: () => this.currentUser = null
    });
  }

  goToClassroomList() {
    this.router.navigate(['/classroom']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
