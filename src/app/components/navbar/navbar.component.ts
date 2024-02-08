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


  constructor(private movieService: MovieService) {
    this.searchMovies('');
  }

  ngOnInit() {
   
  }

  onSearchInput(event: CustomEvent) {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.searchMovies(this.searchQuery); 
  }

  searchMovies(query: string) {
    this.movieService.getSearchMovies(query).subscribe((response: MovieResponse) => {
      this.movies = this.transformMovieResponse(response); 
    });
  }



  transformMovieResponse(response: MovieResponse): Movie[] {
  
    if (response.results) {
      return response.results.map(movie => ({
        title: movie.title,
        // Otras propiedades que necesites mapear
      }));
    } else {
   
      console.error('No se encontraron películas en la respuesta.');
      return [];
    }
  }



}
