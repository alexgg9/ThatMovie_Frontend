import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class NavbarComponent  {
  @Input() title: string = 'ThatMovie';
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  user: Member | null = null;
  defaultAvatar: string = 'assets/default-avatar.png';
  isSmallScreen: boolean = false;
  isLargeScreen: boolean = false;

  constructor(private elRef:ElementRef, public authService: AuthService, private router: Router, private modalController: ModalController,private toastController: ToastController) {}

  ngOnInit() {
    this.loadUserInfo();
  }
  loadUserInfo(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.authService.getUserInfo(userId).subscribe(user => {
        this.user = user;
      }, error => {
        console.error('Error al obtener la información del usuario', error);
      });
    }
  }

  onSearchInput(event: CustomEvent) {
    console.log(this.elRef.nativeElement.left);
    let offsetLeft = 0;
    let offsetTop = 0;

    let el = event.target as HTMLElement | null;
    while(el){
        offsetLeft += el.offsetLeft;
        offsetTop += el.offsetTop;
        el = el.parentElement;
    }
    const pos = { offsetTop:offsetTop , offsetLeft:offsetLeft };

    const searchQuery = (event.target as HTMLInputElement).value;
    this.onSearch.emit({
      pos:pos,
      data:searchQuery
    });
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
      color: color
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
      component: SearchMovieComponent
    }).then(modal => {
      modal.present();
    });
  }
}