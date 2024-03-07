import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';

import { Movie } from 'src/app/model/movie';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from 'src/app/model/playlist';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MovieListComponent implements OnInit {
  movies: Movie[] | undefined; // Suponiendo que Movie representa el modelo de datos de las películas


  constructor(private route: ActivatedRoute, private playlistService: PlaylistService) { }

  ngOnInit() {
    const playlistIdString = this.route.snapshot.paramMap.get('id');
    if (playlistIdString !== null) {
      const playlistId = parseInt(playlistIdString, 10);
      if (!isNaN(playlistId)) {
        this.getMovieList(playlistId);
      } else {
        console.error('El ID de la lista de reproducción no es un número válido.');
      }
    } else {
      console.error('El parámetro "id" es nulo o no está presente en la URL.');
    }
  }

  getMovieList(playlistId: number) {
    this.playlistService.getMovieList(playlistId).subscribe((playlist: Playlist) => {
      this.movies = playlist.movies; // Suponiendo que la propiedad que contiene las películas se llama "movies"
    });
  }

  

}
