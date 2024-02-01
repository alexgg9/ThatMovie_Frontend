import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class NavbarComponent  implements OnInit {
  @Input() title:string = 'ThatMovie';
  constructor() { }

  ngOnInit() {}

}
