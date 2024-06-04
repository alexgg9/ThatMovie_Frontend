import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { ModalController, IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';
import { PlaylistService } from 'src/app/services/playlist.service'; 
import { Movie } from 'src/app/model/movie';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddMovieComponent implements OnInit {
  @Input() playlist: Movie[] = [];
  @Input() playlistId: number | null = null;
  searchQuery: string = '';
  moviesSearched: any[] = [];
  searchInputClicked = false;
  searching = false;
  statusSearch = false;
  movie?: Movie;

  constructor(
    private movieService: MovieService,
    private playlistService: PlaylistService,
    private modalController: ModalController,
    private toastController: ToastController,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {}

  onSearch(event: any) {
    const query = event.target.value;
    if (query && query.trim() !== '') {
      this.searching = true;
      this.searchInputClicked = true;
      this.searchMovies(query);
    } else {
      this.moviesSearched = [];
      this.searching = false;
    }
  }

  searchMovies(query: string) {
    this.statusSearch = true;
    this.movieService.getSearchMovies(query).subscribe(
      (response: any) => {
        if (response.results) {
          console.log('Respuesta:', response);
          this.moviesSearched = response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            director: movie.credits?.crew ? movie.credits.crew.find((crewMember: any) => crewMember.job === 'Director')?.name : ''
          }));
        } else {
          console.error('No se encontraron películas en la respuesta.');
          this.moviesSearched = [];
        }
        this.statusSearch = false;
        this.searching = this.moviesSearched.length > 0;
      },
      (error: any) => {
        console.error('Error al obtener películas:', error);
        this.moviesSearched = [];
        this.statusSearch = false;
      }
    );
  }

  getImageUrl(posterPath: string): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return `${baseUrl}${posterPath}`;
  }

  async addMovieToPlaylist(movie: Movie) {
    if (this.playlistId != null) {
      try {
        const response = await this.playlistService.postAddMovieToPlaylist(this.playlistId, movie).toPromise();

        this.playlist = [...this.playlist, movie];
        this.changeDetectorRef.detectChanges();

        this.showToast('Película añadida con éxito', 'success');
        this.modalController.dismiss(this.playlist);
      } catch (error) {
        this.showToast('Error al añadir película a la lista', 'danger');
      }
    } else {
      this.showToast('ID de la lista no proporcionado', 'warning');
    }
  }

  close() {
    this.modalController.dismiss();
  }

  async showToast(msg: string, color: string = 'primary', duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color: color
    });
    toast.present();
  }

}
