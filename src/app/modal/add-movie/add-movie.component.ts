import { Component, OnInit, Input } from '@angular/core';
import { IonInput, IonTitle, IonButton, ModalController } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service'; // Ajusta la ruta según sea necesario
import { PlaylistService } from 'src/app/services/playlist.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonTitle, IonInput],
})
export class AddMovieComponent implements OnInit {
  @Input() playlistId: number | null = null;
  searchQuery: string = '';
  moviesSearched: any[] = [];
  searchInputClicked = false;
  searching = false;
  statusSearch = false;

  constructor(
    private movieService: MovieService,
    private playlistService: PlaylistService,
    private modalController: ModalController // Inyecta ModalController
  ) { }

  ngOnInit() {}

  onSearch(event: any) {
    if (event) {
      this.searching = true;
      this.searchInputClicked = true;
      this.searchMovies(event.data);
    } else {
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

  getImageUrl(posterPath: string): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return `${baseUrl}${posterPath}`;
  }

  async addMovieToPlaylist(movieId: number) {
    if (this.playlistId !== null) {
      try {
        await this.playlistService.postAddMovieToPlaylist(this.playlistId, movieId).toPromise();
        console.log('Película añadida con éxito');
        this.modalController.dismiss(); // Cierra el modal después de añadir la película
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
}
