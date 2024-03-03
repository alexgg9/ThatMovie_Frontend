import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { registerRequest } from './registerRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  registerError: string = "";
  constructor(private formBuilder: FormBuilder, private router: Router ,private LoginService: LoginService) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      surname: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  

  register() {
    if (this.registerForm.valid) {
      this.registerError = "";
      this.LoginService.getRegister(this.registerForm.value as registerRequest).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.router.navigateByUrl('/login');
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          this.registerError = error;
        },
        complete: () => {
          console.info("Registro completo");
        }
      });
    } else {
      console.error('El formulario no es válido. Por favor, corrija los campos resaltados.');
      this.registerForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }

}
