import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfilePage implements OnInit {
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  user: Member = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    bio: '',
    avatar: ''
  };

  constructor(
    private memberService: MemberService, 
    private toastController: ToastController, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserInfo();
  }
  /**
   * Carga la información del usuario
   * Obtiene el ID del usuario
   * 
   */
  loadUserInfo(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.memberService.getMemberById(userId).subscribe(
        user => {
          this.user = user;
          this.cdr.detectChanges();
        },
        error => console.error('Error al obtener la información del usuario', error)
      );
    } else {
      console.error('No hay un usuario actual establecido');
    }
  }
  /**
   * Guarda los cambios
   * Obtiene el ID del usuario
   * 
   */
  saveChanges(): void {
    if (this.user.id) {
      if (this.selectedFile) {
        this.uploadFile(this.selectedFile).then(url => {
          this.user.avatar = url; 
          this.updateUser();
        }).catch(error => {
          console.error('Error uploading file', error);
          this.showToast('Error uploading file', 'danger', 2000);
        });
      } else {
        this.updateUser();
      }
    }
  }
  /**
   *  @param event evento de click en el input de imagen de perfil 
   * @param file  archivo seleccionado por el usuario 
   * @returns 
   */
  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const url = 'assets/default-avatar.png'; 
        resolve(url);
      }, 2000);
    });
  }
  /**
   * Actualiza la información del usuario
   * Obtiene el ID del usuario
   * 
   */
  updateUser(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      const userData = {
        id: userId,
        name: this.user.name,
        surname: this.user.surname,
        email: this.user.email,
        bio: this.user.bio,
        avatar: this.user.avatar
      };
  
      if (this.selectedFile) {
        this.convertToBase64(this.selectedFile).then(base64Image => {
          userData.avatar = base64Image;
          this.memberService.createMember(userData).subscribe(
            () => this.showToast('Changes saved successfully', 'success', 2000),
            error => console.error('Error updating user information', error)
          );
        }).catch(error => {
          this.showToast('Error converting image to Base64', 'danger', 2000);
        });
      } else {
        this.memberService.updateMember(userData).subscribe(
          () => this.showToast('Changes saved successfully', 'success', 2000),
          error => console.error('Error updating user information', error)
        );
      }
    }
  }
  /**
   *  @param event evento de click en el input de imagen de perfil 
   * @param file  archivo seleccionado por el usuario
   * @returns   
   */
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const base64Image = fileReader.result as string;
        resolve(base64Image);
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });
  }
  /**
   * 
   * @param event evento de click en el input de imagen de perfil 
   * @param file  archivo seleccionado por el usuario
   * @returns
   * 
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * 
   * @returns url de la imagen
   *  
   */
  getAvatarUrl(): string {
    return this.selectedFileUrl || this.user.avatar || 'assets/default-avatar.png';
  }
  /**
   * 
   * @param msg  mensaje para mostrar en el toast 
   * @param color  color 
   * @param duration  duracion del toast 
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
