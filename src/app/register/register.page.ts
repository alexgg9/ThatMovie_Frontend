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
  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router, private toastController: ToastController) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    });
   }
  
   register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value)
        .subscribe(
          response => {
              this.showToast(response, 'success', 2000);
              this.router.navigate(['/login']);
          },
          error => {
            this.showToast('Error en el registro', 'danger', 2000);
          }
        );
    } else {
      this.showToast('Formulario inválido', 'danger');
    }
  }
  
  
  
  
  async showToast(msg: string, color: string = 'primary', duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color: color
    });
    toast.present();
  }

}
