import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage {
  registerForm: FormGroup;
  usernameExists: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    });
  }
  /**
   * Comprueba si el nombre de usuario ya existe
   * y actualiza el valor de 'usernameExists'
   * @param username nombre de usuario
   * @returns void 
   */
  checkUsernameExists() {
    const username = this.registerForm.get('username')?.value;

    if (username) {
      this.authService.checkUsernameExists(username).subscribe(
        (exists: boolean) => {
          this.usernameExists = exists;
        },
        error => {
          console.error('Error checking username existence', error);
        }
      );
    }
  }
  /**
   * Registra un nuevo usuario
   * @param void 
   * @returns void
   * @throws
   */
  register(): void {
    if (this.registerForm.valid) {
        const username = this.registerForm.get('username')?.value;
        this.authService.checkUsernameExists(username).subscribe(
            (exists: boolean) => {
                if (exists) {
                    this.usernameExists = true;
                    this.showToast('Nombre de usuario ya existe', 'danger', 2000);
                } else {
                    this.usernameExists = false;
                    this.authService.register(this.registerForm.value).subscribe(
                        response => {
                            this.showToast("Usuario registrado correctamente", 'success', 2000);
                            this.router.navigate(['/login']);
                        },
                        error => {
                            this.showToast('Error en el registro', 'danger', 2000);
                        }
                    );
                }
            },
            error => {
                this.showToast('El nombre de usuario ya existe', 'danger', 2000);
            }
        );
    } else {
        this.showToast('Formulario inválido', 'danger');
    }
}
  /**
   *  Muestra un toast con un mensaje y color personalizado 
   * @param msg  mensaje para mostrar en el toast
   * @param color color 
   * @param duration 
   */

  async showToast(msg: string, color: string = 'primary', duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color: color
    });
    toast.present();
  }
}
