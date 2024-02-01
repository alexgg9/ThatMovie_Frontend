import { Component } from '@angular/core';
import { Movie } from '../model/movie';
import { MovieService } from '../services/movie.service';
import { MovieResponse } from '../model/movieResponse';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  popularMovies: Movie[] =  [];

  constructor(private movieService: MovieService) { }
  ngOnInit(): void {
    this.getPopularMovies();
  }

  getPopularMovies() {
    this.movieService.getPopularMovies().subscribe((response: MovieResponse) => {
      console.log('Movies from service:', response.results);
      if (response.results) {
        this.popularMovies = response.results;
      } else {
        // Manejar el caso en el que 'results' es undefined
        console.error('No se encontraron películas en la respuesta.');
      }
    });
  }
}
