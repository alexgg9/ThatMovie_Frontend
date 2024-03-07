import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PlaylistService } from '../services/playlist.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, of } from 'rxjs';
import { CreateListComponent } from '../modal/create-list/create-list.component';
import { RouterModule } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { Playlist } from 'src/app/model/playlist';


@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.page.html',
    styleUrls: ['./playlist.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterModule, NavbarComponent]
})
export class PlaylistPage implements OnInit {
  playlist: Playlist[] = [];
  posters: string[] = [];
  router: any;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;


  public moviesSearched:{
    id: number,
    title: string,
    poster_path: string    
  }[] = [];
  public searching = false;
  public statusSearch=false;
  private searchInputClicked = false;
 

  constructor(private playlistService: PlaylistService, private modalController: ModalController, private movieService: MovieService) { }


  onSearch(event: any) {
    console.log(event.pos);  
    if (event) {
      this.searching = true;
      this.searchInputClicked = true;
      this.searchMovies(event.data);
    } else {
      this.searching = false;
    }

  }

  searchMovies(query: string) {
    console.log(query)
    this.statusSearch = true;
    this.movieService.getSearchMovies(query).subscribe(
      (response: any) => {
        console.log(response)
        if (response.results) {
          this.moviesSearched = response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
          }));
        } else {
          console.error('No se encontraron películas en la respuesta.');
          this.moviesSearched = [];
        }
        this.statusSearch = false;
        if (this.moviesSearched.length === 0) {
          this.searching = false; // Ocultar el div de búsqueda si no hay resultados
        }
      },
      (error: any) => {
        console.error('Error al obtener películas:', error);
        this.moviesSearched = [];
        this.statusSearch = false;
      }
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!this.searchInputClicked && !event.target.closest('.searchResults')) {
      this.searching = false;
    }
    this.searchInputClicked = false;
  }
  

  @HostListener('window:load', ['$event'])
  onLoad(event: any) {
    this.calculateHeight();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeight(); 
  }
  
  private calculateHeight() {
    const windowHeight = window.innerHeight;
    const calculatedHeight = windowHeight - 80; // Ajusta según el tamaño del encabezado
    console.log('Altura calculada:', calculatedHeight);
    if (this.container) {
      this.container.nativeElement.style.height = calculatedHeight + 'px';
    }
  }
  





  ngOnInit(): void {
    this.allplaylist();
  }



/*PLAYLIST   */
  allplaylist(): void {
    
    this.playlistService.getPlaylist().subscribe((data: Playlist[]) => {
      
      this.playlist = data; 
    });
  }

  getPostersForPlaylist(playlistId: number | undefined): Observable<string[]> {
    if (playlistId !== undefined) {
      return this.playlistService.getPostersForPlaylist(playlistId);
    } else {
      return of([]); 
    }
  }

  obtenerYAsignarPosters(playlistId: number | undefined) {
    this.getPostersForPlaylist(playlistId).subscribe((result) => {
      this.posters = result;
    }, (error) => {
      console.error('Error al obtener los posters:', error);
    });
  }


  async openCreateListModal() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      componentProps: {
       
      }
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
  
    
    window.location.reload();
  }
  
 


}