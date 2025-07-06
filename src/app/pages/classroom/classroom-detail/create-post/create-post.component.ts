import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostRequest } from '../../../../models/request/post.request';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {

  @Input() classroomId!: number;
  @Output() postCreated = new EventEmitter<void>();

  postForm: FormGroup;
  previewUrl: string | null = null;
  imageFile: File | null = null;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private fileService: FileService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: [''] // optional
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.imageFile = input.files[0];

    if (this.imageFile.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn (tối đa 5MB)');
      return;
    }
    // Preview ảnh
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.imageFile);
  }

  onSubmit() {
    debugger
    if (this.postForm.invalid) return;

    const postData: PostRequest = {
      classroomId: this.classroomId,
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      imageUrl: ''
    };

    if (this.imageFile) {
      this.isUploading = true;
      this.fileService.uploadFile(this.imageFile).subscribe({
        next: (res) => {
          debugger
          postData.imageUrl = res.data.url;
          this.submitPost(postData);
        },
        error: (err) => {
          debugger
          this.isUploading = false;
          alert('Tải ảnh thất bại');
        }
      });
    } else {
      this.submitPost(postData);
    }
  }

  private submitPost(postData: PostRequest) {
    this.postService.createPost(postData).subscribe({
      next: (res) => {
        debugger
        this.postForm.reset();
        this.previewUrl = null;
        this.imageFile = null;
        this.isUploading = false;

        window.location.reload(); // Tải lại trang để hiển thị bài viết mới
        this.postCreated.emit(); // 👈 báo cho component cha biết đã đăng xong
      },
      error: (err) => {
        debugger
        this.isUploading = false;
        alert('Tạo bài viết thất bại');
      }
    });
  }
}
