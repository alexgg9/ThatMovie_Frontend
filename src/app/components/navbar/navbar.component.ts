import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class NavbarComponent  {
  @Input() title: string = 'ThatMovie';
  @Output() onSearch: EventEmitter<string> = new EventEmitter();



  onSearchInput(event: CustomEvent) {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.onSearch.emit(searchQuery);
  }



}