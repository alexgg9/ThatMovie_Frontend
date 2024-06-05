import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { Member } from 'src/app/model/member';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { SearchMovieComponent } from '../../modal/search-movie/search-movie.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class NavbarComponent implements OnInit {
  @Input() title: string = 'ThatMovie';
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  user: Member | null = null;
  defaultAvatar: string = 'assets/default-avatar.png';
  isInitialized: boolean = false;
  constructor(
    private cdRef: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    setTimeout(() => {
      this.isInitialized = true;
    }, 0);
  }

  loadUserInfo(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.authService.getUserInfo(userId).subscribe(
        (user) => {
          this.user = user;
          this.cdRef.markForCheck(); 
        },
        (error) => {
          console.error('Error al obtener la información del usuario', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showToast('Sesión finalizada', 'success', 2000);
  }

  async showToast(msg: string, color: string = 'primary', duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color: color,
    });
    toast.present();
  }

  goToProfile(): void {
    const userId = this.authService.getLoggedInUserId();
    this.router.navigate(['/user-profile', userId]);
  }

  setDefaultAvatar(event: Event) {
    (event.target as HTMLImageElement).src = this.defaultAvatar;
  }

  openModal() {
    this.modalController.create({
      component: SearchMovieComponent,
    }).then((modal) => {
      modal.present();
    });
  }

  navigateAndReload(route: string) {
    this.router.navigate([route]);
  }
}
