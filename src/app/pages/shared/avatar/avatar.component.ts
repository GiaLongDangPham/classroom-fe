import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../models/user.response';
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

  @Input() user: UserResponse | null = null;
  @Input() isAllowUpload: boolean = false;
  @Input() avatarUrl?: string;
  defaultAvatar = '/assets/default-avatar.png';

  constructor(
    private userService: UserService,
  ) {}

  onUploadAvatar() {
    if (!this.isAllowUpload) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      console.log(input.files);

      const file = input.files?.item(0);

      if (!file || !this.user || !this.user.id) return;

      const formData = new FormData();
      formData.set('file', file);
      // formData.set('id', this.user.id.toString());

      this.userService.uploadAvatar(formData).subscribe({
        next: (user: UserResponse) => {
          debugger
          this.userService.saveToLocalStorage(user);
          this.avatarUrl = URL.createObjectURL(file);
          debugger
          // window.location.reload();
        }, error: (error: any) => {
          debugger
          console.log(error);
        }
      });
    }
  }

}
