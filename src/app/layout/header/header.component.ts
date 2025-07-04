import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models/api.response';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  userFullName: string = '';


  constructor(  
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // debugger
    // console.log('>>>>>>>>>>>>>userResponse', userResponse);
    setTimeout(() => {
      const userResponseJSON = localStorage.getItem('user'); 
      const userResponse = JSON.parse(userResponseJSON!);  
      this.userFullName = `${userResponse.firstName} ${userResponse.lastName}`;
    }, 100);
  }

  logout() {
    this.authService.logout();
  }

  getMyProfile(){
    this.authService.getMyProfile().subscribe({
      next: (response: ApiResponse) => {
        debugger
        const user = response.data;
        this.userFullName = `${user.firstName} ${user.lastName}`;
      },
      error: () => {
        console.error('Không thể lấy thông tin người dùng');
      }
    });
  }
}
