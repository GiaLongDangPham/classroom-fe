import { Component } from '@angular/core';
import { UserResponse } from '../../models/user.response';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models/api.response';
import { RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  currentUser: UserResponse | null = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getMyProfile().subscribe({
      next: (res: ApiResponse) => this.currentUser = res.data,
      error: () => this.currentUser = null
    });
  }
}
