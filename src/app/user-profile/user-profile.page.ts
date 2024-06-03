import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { MemberService } from '../services/member.service';
import { Member } from '../model/member';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent]
})
export class UserProfilePage implements OnInit {
  selectedFile: File | null = null;
  user: Member = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    bio: '',
    avatar: ''
  };

  constructor(private memberService: MemberService, private toastController: ToastController, private authService: AuthService) { }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.memberService.getMemberById(userId).subscribe(
        user => this.user = user,
        error => console.error('Error al obtener la información del usuario', error)
      );
    } else {
      // Maneja el caso donde no hay un usuario actual establecido
      console.error('No hay un usuario actual establecido');
    }
  }

  saveChanges(): void {
    if (this.user.id) {
      if (this.selectedFile) {
        // Lógica para cargar el archivo y obtener la URL del nuevo avatar
        this.user.avatar = 'assets/default-avatar.png'; // Reemplaza 'url-del-avatar-por-defecto' con la URL adecuada
        this.memberService.updateMember(this.user).subscribe(
          () => this.showToast('Changes saved successfully', 'success', 2000),
          error => console.error('Error updating user information', error)
        );
      } else {
        // Si no se ha seleccionado un archivo, simplemente actualizamos el usuario sin cambiar el avatar
        this.memberService.updateMember(this.user).subscribe(
          () => this.showToast('Changes saved successfully', 'success', 2000),
          error => console.error('Error updating user information', error)
        );
      }
    }
  }
  
  


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }
  getAvatarUrl(): string {
    return this.selectedFile ? URL.createObjectURL(this.selectedFile) : this.user.avatar || 'assets/default-avatar.png';
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
