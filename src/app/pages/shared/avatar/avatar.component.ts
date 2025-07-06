import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../models/response/user.response';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  @Input() user: any = {};
  @Input() isAllowUpload: boolean = false;
  @Input() width: string = 'w-12';
  @Input() height: string = 'h-12';
  defaultAvatar = '/assets/default-avatar.png';

  get avatarClasses(): string {
    return `${this.width} ${this.height} rounded-full border-2 border-blue-500 object-cover`;
  }

  constructor(
    private userService: UserService,
  ) {}


}
