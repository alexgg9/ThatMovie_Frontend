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
        next: (userData) => {
          console.log(userData);
          // Aquí puedes manejar la respuesta del servidor, por ejemplo, guardar el token de autenticación, redireccionar a otra página, etc.
          this.router.navigateByUrl('/home');
          this.loginForm.reset();
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError = errorData;
          // Aquí puedes manejar cualquier error que se produzca durante la solicitud de inicio de sesión
        },
        complete: () => {
          console.info("Login completo");
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }
}
