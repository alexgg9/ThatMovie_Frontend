import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Movie } from 'src/app/model/movie';
import { ActivatedRoute } from '@angular/router';
import { playlist } from 'src/app/model/playlist';
import { AddMovieComponent } from 'src/app/modal/add-movie/add-movie.component';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class MovieListComponent implements OnInit {
  movies: Movie[] | undefined;
  playlistName: string | undefined;

  constructor(
    private route: ActivatedRoute, 
    private playlistService: PlaylistService,
    private modalController: ModalController
  ) { }

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
    this.playlistService.getMovieList(playlistId).subscribe((playlist: playlist) => {
      this.playlistName = playlist.name;
      this.movies = playlist.movies; 
    });
  }

  async openAddMovieModal() {
    const modal = await this.modalController.create({
      component: AddMovieComponent,
      componentProps: {
        playlistId: this.route.snapshot.paramMap.get('id'),
        playlist: this.movies
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.movies = data.data;
      }
    });

    return await modal.present();
  }
}
