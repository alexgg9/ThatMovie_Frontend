import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Playlist } from '../model/Playlist';
import { PlaylistService } from '../services/playlist.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, of } from 'rxjs';
import { CreateListComponent } from '../modal/create-list/create-list.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PlaylistPage implements OnInit {
  playlist: Playlist[] = [];
  posters: string[] = [];

  constructor(private playlistService: PlaylistService, private modalController: ModalController) { }

  ngOnInit(): void {
    this.allplaylist();
  }

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
      // Manejar errores si es necesario
    });
  }


  async openCreateListModal() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      componentProps: {
        // Aquí puedes pasar cualquier dato que necesites al modal
      }
    });
    return await modal.present();
  }

 
  
 


}