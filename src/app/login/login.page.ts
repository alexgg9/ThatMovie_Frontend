import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LoginRequest } from './LoginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginError: string = "";
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  get userame() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login() {
    if (this.loginForm.valid) {
      this.loginError = "";
      this.loginService.getlogin(this.loginForm.value as LoginRequest).subscribe({
        next: (response: any) => {
          if (response && response.token) {
            const jwtToken = response.token;
            localStorage.setItem('JWT', jwtToken);
            this.router.navigateByUrl('/home');
            this.loginForm.reset();
          } else {
            this.loginError = "No se recibió un token de autenticación en la respuesta";
          }
        },
        error: (error) => {
          console.error(error);
          if (error && error.error && error.error.message) {
            this.loginError = error.error.message;
          } else {
            this.loginError = "Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.";
          }
        },
        complete: () => {
          console.info("Login completo");
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }
  
  
  

}
