import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { MemberService } from '../services/member.service';
import { Member } from '../model/member';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule]
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

  
 
  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.authService.login(username, password)
        .subscribe(
          (response: any) => {
            this.memberService.getMemberByUsername(username)
              .subscribe(
                (member: Member) => {
                  this.memberService.setCurrentMember(member);
                  console.log(member);
                  this.router.navigate(['/home']);
                },
                error => {
                  console.error('Error al obtener el miembro:', error);
                  this.showToast('Error en el inicio de sesión', 'danger', 2000);
                }
              );
          },
          error => {
            console.error('Error en el inicio de sesión:', error);
            this.showToast('Error en el inicio de sesión', 'danger', 2000);
          }
        );
    } else {
      this.showToast('Formulario inválido', 'warning');
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
