import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Movie } from '../model/movie';
import { MovieService } from '../services/movie.service';
import { MovieResponse } from '../model/movieResponse';
import { IonContent, IonicModule} from '@ionic/angular';
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
  imports: [IonicModule, NavbarComponent, RouterModule]
})
export class HomePage implements AfterViewInit, OnInit{
  
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;
  public moviesSearched:{
    id: number,
    title: string,
    poster_path: string    
  }[] = [];
  public searching = false;
  public statusSearch=false;
  

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
    this.getPopularMovies();
    this.getNowPlaying();
    this.getUpcomingMovies();
    this.calculateHeight();
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
    this.movieService.getNowPlaying().subscribe((response: MovieResponse) => {
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


  onSearch(event: any) {
    console.log(event);
    if(event){
      this.searching=true;
      this.searchMovies(event);
    }else{
      this.searching=false;
    }

  }

  searchMovies(query: string) {
    console.log(query)
    this.statusSearch=true;
    this.movieService.getSearchMovies(query).subscribe(
      (response: any) => {
        console.log(response)
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
        this.statusSearch=false;
      },
      (error: any) => {
        console.error('Error al obtener películas:', error);
        this.moviesSearched = [];
        this.statusSearch=false;
      }
    );
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
    this.calculatedHeightVariable = calculatedHeight;
    if (this.container) {
      this.container.nativeElement.style.height = calculatedHeight + 'px';
    }
  }
  
  
}