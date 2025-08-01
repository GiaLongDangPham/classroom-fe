import { Component } from '@angular/core';
import { UserResponse } from '../models/response/user.response';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse } from '../models/api.response';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  currentUser: UserResponse | null = null;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.getMyProfile().subscribe({
      next: (res: ApiResponse) => this.currentUser = res.data,
      error: () => this.currentUser = null
    });
  }
}
