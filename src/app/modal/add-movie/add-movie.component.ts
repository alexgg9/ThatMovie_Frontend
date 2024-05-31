import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController, IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service'; // Ajusta la ruta según sea necesario
import { PlaylistService } from 'src/app/services/playlist.service'; // Ajusta la ruta según sea necesario
import { Movie } from 'src/app/model/movie';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddMovieComponent implements OnInit {
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
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

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
          this.moviesSearched = response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date
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

  async addMovieToPlaylist(movieId: number) {
    if (this.playlistId !== null) {
      try {
        await this.playlistService.postAddMovieToPlaylist(this.playlistId, movieId).toPromise();
        console.log('Película añadida con éxito');
        this.modalController.dismiss();
      } catch (error) {
        console.error('Error al añadir película a la lista:', error);
      }
    } else {
      console.error('ID de la lista no proporcionado');
    }
  }

  close() {
    this.modalController.dismiss();
  }
  getDirectors(): string {
    if (!this.movie || !this.movie.credits || !this.movie.credits.crew) {
      return '';
    }
    
    const directors = this.movie.credits.crew.filter(crew => crew.job === 'Director').map(crew => crew.name);
    return directors.join(', ');
  }

}
