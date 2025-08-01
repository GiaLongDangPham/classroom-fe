import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserResponse } from '../models/response/user.response';
import { AvatarComponent } from '../avatar/avatar.component';
import { UserService } from '../../core/services/user.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AvatarComponent,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  user$ = this.userService.user$;
  userFullName: string = '';
  user: UserResponse | null = null;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isDropdownOpen = false;

  constructor(  
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    debugger
    this.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.userFullName = `${user.firstName} ${user.lastName}`;
      }
    });
  }

  logout() {
    this.userFullName = '';
    this.authService.logout();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    // Lưu ngôn ngữ vào localStorage để persist
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('selectedLanguage', lang);
    }
  }
}
