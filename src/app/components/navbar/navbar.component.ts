import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class NavbarComponent  {
  @Input() title: string = 'ThatMovie';
  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  isSmallScreen: boolean = false;
  isLargeScreen: boolean = false;

  constructor(private elRef:ElementRef, public authService: AuthService, private router: Router, private toastController: ToastController) {}

  

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
    this.authService.isLogout();
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

}