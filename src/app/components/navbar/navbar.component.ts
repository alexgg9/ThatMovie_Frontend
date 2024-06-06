import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { MemberService } from 'src/app/services/member.service';
import { SearchMovieComponent } from '../../modal/search-movie/search-movie.component';
import { Member } from 'src/app/model/member';
import { Observable } from 'rxjs';

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
  defaultAvatar: string = 'assets/default-avatar.png';
  user$: Observable<Member | null>;

  constructor(
    private memberService: MemberService,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.user$ = this.memberService.currentMember$;
  }

  ngOnInit() {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.memberService.loadCurrentMember(userId);
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
