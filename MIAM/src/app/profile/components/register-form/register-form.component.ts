import { Component } from '@angular/core';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  hidePassword: boolean = true;


  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


  onSubmit() {
    if (this.email && this.phoneNumber && this.password === this.confirmPassword) {
      alert(`Account successfully created for ${this.email}`);
      console.log(`Email: ${this.email}`);
      console.log(`Phone Number: ${this.phoneNumber}`);
    } else if (this.password !== this.confirmPassword) {
      alert('Passwords do not match. Please try again.');
    } else {
      alert('Please fill in all the required fields.');
    }
  }
}
