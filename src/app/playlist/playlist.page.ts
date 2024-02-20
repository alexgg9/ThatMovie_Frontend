import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Playlist } from '../model/Playlist';
import { PlaylistService } from '../services/playlist.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
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
      // Manejar el caso en el que playlistId es undefined
      return new Observable<string[]>(); // O devolver un Observable vacío o con un valor por defecto
    }
  }
}