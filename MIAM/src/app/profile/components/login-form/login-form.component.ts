import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../../iam/services/auth.service";
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  hidePassword: boolean = true;
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/MIAM/dashboard']);
      } else {
        alert('Invalid email or password. Please try again.');
      }
    });
  }
}
