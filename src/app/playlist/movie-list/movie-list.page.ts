import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Movie } from 'src/app/model/movie';
import { ActivatedRoute } from '@angular/router';
import { AddMovieComponent } from 'src/app/modal/add-movie/add-movie.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ToastController } from '@ionic/angular/standalone';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, RouterLink], 
})
export class MovieListComponent implements OnInit {
  movies: Movie[] | undefined;
  playlistName: string | undefined;
  @Input() playlist: any;
  showDeleteButtons: boolean = false;


  constructor(
    private route: ActivatedRoute, 
    private playlistService: PlaylistService,
    private modalController: ModalController,
    private toastController: ToastController
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
    this.playlistService.getMovieList(playlistId).subscribe((playlist: any) => {
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

  async removeMovie(movieId: number) {
    const playlistId = parseInt(this.route.snapshot.paramMap.get('id') || '', 10);
    if (isNaN(playlistId)) return;

    try {
        await this.playlistService.removeMovieFromPlaylist(playlistId, movieId).toPromise();
        this.movies = this.movies?.filter(movie => movie.id !== movieId);
        this.getMovieList(playlistId);
        this.showToast('Película eliminada correctamente.', 'success');
    } catch (error) {
        console.error('Error removing movie:', error);
        if (error instanceof HttpErrorResponse && error.status === 200) {
            this.showToast('Película eliminada correctamente.', 'success');
        } else {
            this.showToast('Ocurrió un error al eliminar la película.', 'danger');
        }
    }
}

toggleDeleteButtons() {
  this.showDeleteButtons = !this.showDeleteButtons;
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
