import { Component, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FileService } from '../../../services/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  @Input() user: any = {};
  @Input() isAllowUpload: boolean = false;
  @Input() width: string = 'w-12';
  @Input() height: string = 'h-12';
  defaultAvatar = '/assets/default-avatar.png';

  selectedAvatar: File | null = null;
  previewUrl: string | null = null;

  get avatarClasses(): string {
    return `${this.width} ${this.height} rounded-full border-2 border-blue-500 object-cover`;
  }

  constructor(
    private userService: UserService,
    private fileService: FileService
  ) {}

  onAvatarSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.selectedAvatar = file;
      this.previewUrl = URL.createObjectURL(file); // Hiển thị preview
    }
  }

  uploadAvatar() {
    if (!this.selectedAvatar) return;

    this.fileService.uploadFile(this.selectedAvatar).subscribe({
      next: (res) => {
        const avatarUrl = res.data.url;

        this.userService.updateAvatar(avatarUrl).subscribe({
          next: () => {
            this.user.avatarUrl = avatarUrl;
            this.userService.saveToLocalStorage(this.user); // Cập nhật user trong localStorage
            this.previewUrl = null;
            this.selectedAvatar = null;
          },
          error: () => alert('Lỗi khi cập nhật avatar'),
        });
      },
      error: () => alert('Upload ảnh thất bại'),
    });
  }


}
