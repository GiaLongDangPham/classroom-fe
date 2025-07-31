import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse } from '../../shared/models/api.response';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss'
})
export class AuthenticateComponent {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.outboundAuthenticate(code).subscribe({
        next: (res: ApiResponse) => {
          debugger
          this.authService.setToken(res.data.token);
          this.router.navigate(['/classroom']);
        },
        error: (err) => {
          console.error('Error during authentication:', err);
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
