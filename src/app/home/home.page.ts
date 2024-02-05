import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Movie } from '../model/movie';
import { MovieService } from '../services/movie.service';
import { MovieResponse } from '../model/movieResponse';
import { IonicModule} from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { RouterModule } from '@angular/router';
register();


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NavbarComponent, RouterModule],
})
export class HomePage {
  

  popularMovies: Movie[] =  [];
  nowPlayingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];


  constructor(private movieService: MovieService) {
    
   }

   ngAfterViewInit() {
    const swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      nested: true,
    });
  }

  ngOnInit(): void {
    this.getPopularMovies();
    this.getNowPlaying();
    this.getUpcomingMovies();
  }

  getPopularMovies() {
    this.movieService.getPopularMovies().subscribe((response: MovieResponse) => {
      console.log('Movies from service:', response.results);
      if (response.results) {
        this.popularMovies = response.results;
      } else {
        console.error('No se encontraron películas en la respuesta.');
      }
    });
  }

  getNowPlaying() {
    this.movieService.getUpcomingMovies().subscribe((response: MovieResponse) => {
      console.log('Movies from service:', response.results);
      if (response.results) {
        this.nowPlayingMovies = response.results;
      } else {
        console.error('No se encontraron más pelúculas en la respuesta.');
      }
    });
  }

  getUpcomingMovies() {
    this.movieService.getUpcomingMovies().subscribe((response: MovieResponse) => {
      console.log('Movies from service:', response.results);
      if (response.results) {
        this.upcomingMovies = response.results;
      } else {
        console.error('No se encontraron más pelúculas en la respuesta.');
      }
    });
  }
  
}
