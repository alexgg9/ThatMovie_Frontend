import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Movie } from 'src/app/model/movie';
import { MovieResponse } from 'src/app/model/movieResponse';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class NavbarComponent  implements OnInit {
  @Input() title: string = 'ThatMovie';
  searchQuery: string | undefined;
  movies: Movie[] | undefined;
  filteredMovies: Movie[] = [];



  constructor(private movieService: MovieService) {
    this.searchMovies('');
  }

  ngOnInit() {
   
  }

  onSearchInput(event: CustomEvent) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    if (this.movies && this.searchQuery) {
      this.filteredMovies = this.movies.filter((movie) =>
      this.searchQuery &&  movie.title?.toLowerCase().includes(this.searchQuery?.toLowerCase())
      );
    }
    this.searchMovies(this.searchQuery); 
  }

   searchMovies(query: string) {
    this.movieService.getSearchMovies(query).subscribe(
      (response: any) => {
        if (response.results) {
          this.movies = response.results.map((movie: any) => ({
            title: movie.title,
            // Otras propiedades que necesites mapear
          }));
        } else {
          console.error('No se encontraron películas en la respuesta.');
          this.movies = [];
        }
      },
      (error: any) => {
        console.error('Error al obtener películas:', error);
        this.movies = [];
      }
    );
  }

  onMovieSelected(event: any) {
    // Manejar la selección de la película aquí
    console.log('Película seleccionada:', event);
  }

}
