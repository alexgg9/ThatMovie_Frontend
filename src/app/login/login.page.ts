import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 
  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.authService.login(username, password)
        .subscribe(
          response => {
            console.log('Inicio de sesión exitoso:', response);
          },
          error => {
            console.error('Error en el inicio de sesión:', error);
          }
        );
    } else {
      console.error('Formulario inválido');
    }
  }

}
