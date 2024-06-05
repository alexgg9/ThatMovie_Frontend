import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { PlaylistService } from '../services/playlist.service';
import { Observable } from 'rxjs/internal/Observable';
import { CreateListComponent } from '../modal/create-list/create-list.component';
import { RouterModule } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { playlist } from '../model/playlist';
import { MatListModule } from '@angular/material/list';
import { ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';




@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.page.html',
    styleUrls: ['./playlist.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterModule, NavbarComponent, MatListModule]
})
export class PlaylistPage implements OnInit {
  playlist: playlist[] = [];
  posters: { [key: number]: string[] } = {}; 
  router: any;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;


  public moviesSearched:{
    id: number,
    title: string,
    poster_path: string    
  }[] = [];
  lists: any[] = [];
  public searching = false;
  public statusSearch=false;
  private searchInputClicked = false;
 

  constructor(private playlistService: PlaylistService, private authService: AuthService,private modalController: ModalController, private movieService: MovieService, private toastController: ToastController) { }


  ngOnInit(): void {
    this.allplaylistUser();
  }



/**
 * Obtiene todas las listas
 * @param playlistId - El identificador de la lista
 * @returns void
 * @description Obtiene todas las listas
 * @param playlistId - El identificador de la lista
 * @returns void
  */ 
allplaylistUser(): void {
  this.playlistService.getPlaylistsUser(this.authService.getLoggedInUserId()).subscribe((data) => {
    this.playlist = data;
    this.playlist.forEach(list => {
      if (list.id !== undefined) {
        this.obtenerYAsignarPosters(list.id);
      }
    });
  });
}

getPostersForPlaylist(playlistId: number): Observable<string[]> {
  return this.playlistService.getPostersForPlaylist(playlistId);
}

obtenerYAsignarPosters(playlistId: number) {
  this.getPostersForPlaylist(playlistId).subscribe((result) => {
    if (result && result.length) {
      const posterUrls = result.map(posterPath => this.getImageUrl(posterPath));
      if (posterUrls.length > 1) {
        this.posters[playlistId] = posterUrls;
      } else {
        this.posters[playlistId] = posterUrls.concat(['assets/default-poster.png', 'assets/default-poster.png']);
      }
    } else {
      this.posters[playlistId] = ['assets/default-poster.png', 'assets/default-poster.png', 'assets/default-poster.png'];
    }
  }, (error) => {
    this.posters[playlistId] = ['assets/default-poster.png', 'assets/default-poster.png', 'assets/default-poster.png'];
  });
}



trackById(index: number, item: playlist): number {    
  return item.id !== undefined ? item.id : index; 
}


getImageUrl(posterPath: string): string {
  const baseUrl = 'https://image.tmdb.org/t/p/w500'; 
  const fullUrl = `${baseUrl}${posterPath}`;
  console.log('Construyendo URL de imagen:', fullUrl);
  return fullUrl;
}


handleImageError(event: Event, playlistId: number | undefined, index: number) {
  if (playlistId !== undefined) {
    const target = event.target as HTMLImageElement;
    this.posters[playlistId][index] = 'assets/default-poster.png';
  }
}

deletePlaylist(listId: number, event: Event) {
  event.stopPropagation(); 
  event.preventDefault();

  this.playlistService.deletePlaylist(listId).subscribe(
    () => {
      this.showToast('Lista eliminada con éxito', 'success');
      this.lists = this.lists.filter((list: any) => list.id !== listId);
      this.allplaylistUser();
    },
    (error) => {
      this.showToast('Error al eliminar la lista', 'danger');
    }
  );
}

/**
 * @returns void
 * @description Abre el modal para crear una nueva lista
 */
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
  
 
  async showToast(message: string, status: string) {
    const toast = await this.toastController.create({
      message,
      color: status,
      duration: 2000
    });
    await toast.present();
  }

}