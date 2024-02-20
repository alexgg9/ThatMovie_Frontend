import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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

  constructor(private elRef:ElementRef) {
    
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



}