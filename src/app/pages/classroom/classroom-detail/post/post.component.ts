import { Component, Input } from '@angular/core';
import { PostResponse } from '../../../../models/response/post.response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post: PostResponse = {}; // Khởi tạo với giá trị rỗng để tránh lỗi undefined
}
