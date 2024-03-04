import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  constructor(private formBuilder: FormBuilder,private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required]
    });
   }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value)
        .subscribe(
          response => {
            console.log('Registro exitoso:', response);
          },
          error => {
            console.error('Error en el registro:', error);
          }
        );
    } else {
      console.error('Formulario inválido');
    }
  }

}
