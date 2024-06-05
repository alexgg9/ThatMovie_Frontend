import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { Movie } from '../model/movie';
import { MovieService } from '../services/movie.service';
import { MovieResponse } from '../model/movieResponse';
import { IonicModule} from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SearchMovieComponent } from '../modal/search-movie/search-movie.component';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { RouterModule } from '@angular/router';
register();


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NavbarComponent, RouterModule, SearchMovieComponent],
})
export class HomePage implements AfterViewInit, OnInit{
  
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;
  public searching = false;
  public statusSearch=false;
  private searchInputClicked = false;
  

  popularMovies: Movie[] =  [];
  nowPlayingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];


  constructor(private movieService: MovieService) {
    
   }

   ngAfterViewInit(): void {
    new Swiper('.swiper-container', {
      direction: 'horizontal',
      slidesPerView: 7,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      touchMoveStopPropagation: false,
      breakpoints: {
        1024: {
          slidesPerView: 7,
        },
        768: {
          slidesPerView: 5,
        },
        640: {
          slidesPerView: 3,
        },
        320: {
          slidesPerView: 2,
        },
      }
    });
  }

  

  ngOnInit(): void {
    this.calculateHeight();
    this.getPopularMovies();
    this.getNowPlaying();
    this.getUpcomingMovies();
  }

  getPopularMovies() {
    this.movieService.getPopularMovies().subscribe((response: MovieResponse) => {
      if (response.results) {
        this.popularMovies = response.results;
      } else {
        console.error('No se encontraron películas en la respuesta.');
      }
    });
  }

  getNowPlaying() {
    this.movieService.getNowPlaying().subscribe((response: MovieResponse) => {
      if (response.results) {
        this.nowPlayingMovies = response.results.reverse();
      } else {
        console.error('No se encontraron más pelúculas en la respuesta.');
      }
    });
  }

  getUpcomingMovies() {
    this.movieService.getUpcomingMovies().subscribe((response: MovieResponse) => {
      if (response.results) {
        this.upcomingMovies = response.results.reverse();
      } else {
        console.error('No se encontraron más pelúculas en la respuesta.');
      }
    });
  }


  

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!this.searchInputClicked && !event.target.closest('.searchResults')) {
      this.searching = false;
    }
    this.searchInputClicked = false;
  }
  

  @HostListener('window:load', ['$event'])
  onLoad(event: any) {
    this.calculateHeight();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeight(); 
  }
  
  private calculateHeight() {
    const windowHeight = window.innerHeight;
    const calculatedHeight = windowHeight - 80;
    console.log('Altura calculada:', calculatedHeight);
    if (this.container) {
      this.container.nativeElement.style.height = calculatedHeight + 'px';
    }
  }
  
  
}