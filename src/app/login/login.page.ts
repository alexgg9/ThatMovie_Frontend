import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { MemberService } from '../services/member.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule]
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(
          private fb: FormBuilder,
          private authService: AuthService,
          private router: Router,
          private toastController: ToastController,
          private memberService: MemberService
      ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Método para realizar el login
   * Se comprueba que el formulario sea válido
   * Se obtiene el username y el password del formulario
   */
 
  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response: any) => {
          localStorage.setItem('isLoggedIn', 'true');
          this.memberService.getMemberByUsername(username).subscribe(
            (member: any) => {
              const userId = member.id;
              if (userId) {
                this.authService.setLoggedInUserId(userId);
                this.memberService.setCurrentMember(member);
                this.router.navigate(['/home']);
              } else {
                console.error('El userId no está presente en la respuesta del miembro');
              }
            },
            error => {
              console.error('Error al obtener el miembro:', error);
            }
          );
        },
        error => {
          this.showToast('Credenciales incorrectas', 'danger', 2000);
        }
      );
    } else {
      this.showToast('Formulario inválido', 'warning');
    }
  }
  
  
  /**
   * 
   * @param msg  mensaje para mostrar en el toast
   * @param color color
   * @param duration duración del toast
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
