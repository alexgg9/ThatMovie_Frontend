import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ReviewService } from '../services/review.service';
import { Review } from '../model/review';
import { MemberService } from '../services/member.service';
import { MovieResponse } from '../model/movieResponse';
register();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, FontAwesomeModule, RouterModule]
})
export class ProfilePage implements AfterViewInit, OnInit {
  faStar = faStar;
  rating = 0;
  content: string = '';
  movie?: Movie | undefined;
  similarMovies: Movie[] = [];
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('similarContainer') similarContainer!: ElementRef
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;
  loaded:WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private memberService: MemberService
  ) {}
  

  setRating(rating: number) {
    this.rating = rating;
  }

  onReviewInput(event: Event): void {
    const target = event.target as HTMLIonTextareaElement;
    this.content = target.value || '';
  }


ngOnInit(): void {
  const movieIdString = this.route.snapshot.paramMap.get('id');
  if (movieIdString !== null) {
    const movieId = parseInt(movieIdString, 10);
    if (!isNaN(movieId)) {
      this.getMovieProfile(movieId);
      this.getSimilarMovies(movieId);
    } else {
      console.error('El ID de la película no es un número válido.');
    }
  } else {
    console.error('El parámetro "id" es nulo o no está presente en la URL.');
  }
}

getSimilarMovies(id: number): void {
  this.movieService.getSimilarMovies(id).subscribe((response: MovieResponse) => {
    console.log('Similar movies:', response.results);
    if (response.results) {
      this.similarMovies = response.results;
    } else {
      console.error('No se encontraron películas similares en la respuesta.');
    }
  });
}



  getMovieProfile(id: number) {
    this.movieService.getProfileMovies(id).subscribe((movie) => {
      this.movie = movie;
      this.loaded.set(true);
      console.log('Movie profile:', this.movie);
    });
  }

  getGenderAvatar(gender: number): string {
    switch(gender){
      case 1:
        return '../../assets/defaultWomenCastPic.jpg';
      case 2:
        return '../../assets/defaultMenCastPic.jpg';
      default:
        return '../../assets/defaultMenCastPic.jpg';    
    }
  }

  

  ngAfterViewInit(): void {
    const movieSwiper = new Swiper(this.swiperContainer.nativeElement, {
      direction: 'horizontal',
      slidesPerView: 7,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 7,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      }
    });
  
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

    const similarSwiper = new Swiper(this.similarContainer.nativeElement, {
      direction: 'horizontal',
      slidesPerView: 7,
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
    })
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

  getDirectors(): string {
    if (!this.movie || !this.movie.credits || !this.movie.credits.crew) {
      return '';
    }
    
    const directors = this.movie.credits.crew.filter(crew => crew.job === 'Director').map(crew => crew.name);
    return directors.join(', ');
  }
  
  submitReview(): void {
    console.log('Valor de this.rating:', this.rating);
    console.log('Valor de this.content:', this.content);
    
    if (this.rating !== 0 && this.content !== '') {
        const userId = 1; 
        const perfilId = this.route.snapshot.paramMap.get('id');
        console.log('ID del perfil:', perfilId);

        if (perfilId !== null) {
            this.memberService.getMemberById(userId).subscribe(
                (member) => {
                    const nuevaReview: Review = {
                        movie_id: +perfilId,
                        rating: this.rating,
                        content: this.content,
                        author: member.id,
                        created_at: new Date()
                    };
                    this.reviewService.createReview(nuevaReview).subscribe(
                        (response) => {
                            console.log('Revisión creada exitosamente:', response);
                        },
                        (error) => {
                            console.error('Error al crear la revisión:', error);
                        }
                    );
                },
                (error) => {
                    console.error('Error al obtener el miembro:', error);
                }
            );
        } else {
            console.error('El ID del perfil es null.');
        }
    } else {
        console.error('Por favor seleccione una calificación y escriba un comentario antes de enviar la revisión.');
    }
}
  
}
