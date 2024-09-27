import { Component } from '@angular/core';

@Component({
  selector: 'app-recovery-password-form',
  templateUrl: './recovery-password-form.component.html',
  styleUrls: ['./recovery-password-form.component.css']
})
export class RecoveryPasswordFormComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  hidePassword: boolean = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.email) {
      if (this.newPassword === this.confirmPassword) {
        const verificationCode = prompt(`A verification code has been sent to ${this.email}. Please enter the code to reset your password:`);
        if (verificationCode) {
          console.log(`Verification code entered: ${verificationCode}`);
          alert('Your password has been successfully reset!');
        } else {
          alert('Please enter the verification code sent to your email.');
        }
      } else {
        alert('The passwords do not match. Please try again.');
      }
    } else {
      alert('Please enter a valid email address.');
    }
  }
}
