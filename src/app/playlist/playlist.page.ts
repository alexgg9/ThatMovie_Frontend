import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Playlist } from '../model/Playlist';
import { PlaylistService } from '../services/playlist.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, of } from 'rxjs';
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


  constructor(private playlistService: PlaylistService) { }

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




 
 
 


}