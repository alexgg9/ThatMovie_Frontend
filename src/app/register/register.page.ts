import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private LoginService: LoginService) {
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
      // Llamar al servicio de registro con los datos del formulario
      this.LoginService.getRegister(this.registerForm.value).subscribe(
        (response) => {
          // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
        },
        (error) => {
          // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
        }
      );
    } else {
      // Manejar el caso en el que el formulario no es válido, por ejemplo, mostrar mensajes de validación
    }
  }

}
