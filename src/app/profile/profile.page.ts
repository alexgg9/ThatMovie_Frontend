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
import { Member } from '../model/member';
import { ToastController } from '@ionic/angular/standalone';
register();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, FontAwesomeModule, RouterModule],
})
export class ProfilePage implements AfterViewInit, OnInit {
  faStar = faStar;
  rating = 0;
  defaultRating = 0;
  content: string = '';
  movie?: Movie;
  averageRating = 0;
  similarMovies: Movie[] = [];
  member?: Member;
  reviews: Review[] = [];
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('similarContainer') similarContainer!: ElementRef
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;
  loaded:WritableSignal<boolean> = signal<boolean>(false);
  titleCast: string = '';
  titleSimilarMovies: string = '';

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private memberService: MemberService,
    private toastController: ToastController
  ) {}
  /**
   * @param rating 
   * setea el rating
   * 
   */
  setRating(rating: number): void {
    if (this.rating === rating) {
      this.rating = 0;
    } else {
      this.rating = rating;
    }
  }
  
  /**
   * 
   * @param event  evento 
   */
  onReviewInput(event: Event): void {
    const target = event.target as HTMLIonTextareaElement;
    this.content = target.value || '';
  }


ngOnInit(): void {
  this.getMember();
  const movieIdString = this.route.snapshot.paramMap.get('id');
  if (movieIdString !== null) {
    const movieId = parseInt(movieIdString, 10);
    if (!isNaN(movieId)) {
      this.getMovieProfile(movieId);
      this.getSimilarMovies(movieId);
      this.getAverageRating(movieId);
    } else {
      console.error('El ID de la película no es un número válido.');
    }
  } else {
    console.error('El parámetro "id" es nulo o no está presente en la URL.');
  }
}
/**
 *  
 * @returns void 
 */
getMember(): void {
  const userId = localStorage.getItem('userId');
  if (userId) {
    this.memberService.getMemberById(+userId).subscribe(
      (member: Member) => {
        this.member = member;
        console.log('Member:', this.member);
        const movieIdString = this.route.snapshot.paramMap.get('id');
        if (movieIdString !== null) {
          const movieId = parseInt(movieIdString, 10);
          if (!isNaN(movieId)) {
            this.loadUserReview(movieId);
          }
        }
      },
      (error) => {
        console.error('Error fetching member:', error);
      }
    );
  } else {
    console.error('No se pudo obtener el ID del usuario desde el localStorage.');
  }
}
/**
 * 
 * @param movieId   id de la pelicula
 */
loadUserReview(movieId: number): void {
  const userId = localStorage.getItem('userId');
  if (userId) {
    this.reviewService.getUserMemberForMovie(+userId, movieId).subscribe(
      (review: Review | undefined) => {
        if (review) {
          this.rating = review.rating || 0;
          this.content = review.content || '';
        }
      },
      (error: any) => {
        console.error('Error al obtener la reseña del usuario:', error);
      }
    );
  } else {
    console.error('No se pudo obtener el ID del usuario desde el localStorage.');
  }
}



/**
 *  
 * @param movieId id de la pelicula 
 */
getAverageRating(movieId: number): void {
  this.reviewService.getAverageRating(movieId).subscribe(
    (rating) => {
      this.averageRating = rating;
    },
    (error) => {
      console.error('Error fetching average rating:', error);
    }
  );
}

/**
 * 
 * @param id id de la pelicula
 */
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

  /**
   * 
   * @param id id de la pelicula
   * 
   */

  getMovieProfile(id: number) {
    this.movieService.getProfileMovies(id).subscribe((movie) => {
      this.movie = movie;
      this.loaded.set(true);
      this.titleCast = 'Cast';
      this.titleSimilarMovies = 'Similar Movies';
    });
  }
  /**
   * 
   * @param gender genero del cast
   * @returns  url del cast
   */
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

  
  /**
   *  
   * 
   */
  ngAfterViewInit(): void {
    const movieSwiper = new Swiper(this.swiperContainer.nativeElement, {
      direction: 'horizontal',
      slidesPerView: 7,
      spaceBetween: 20,
      loop: true,
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
  /**
   * 
   * 
   */
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

    const similarSwiper = new Swiper(this.similarContainer.nativeElement, {
      direction: 'horizontal',
      slidesPerView: 7,
      spaceBetween: 20,
      loop: true,
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
    })
  }
  /**
   *  
   * @param event  evento 
   */
  @HostListener('window:load', ['$event'])
  onLoad(event: any) {
    this.calculateHeight();
  }
  /**
   * 
   * @param event 
   * calcula la altura del swiper
   * 
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeight(); 
  }
  /**
   *  
   * @param event  evento de click en el input de busqueda
   * calcula la altura del swiper
   * 
   */
  private calculateHeight() {
    const windowHeight = window.innerHeight;
    const calculatedHeight = windowHeight - 80;
    console.log('Altura calculada:', calculatedHeight);
    if (this.container) {
      this.container.nativeElement.style.height = calculatedHeight + 'px';
    }
  }
  /**
   * 
   * @returns director de la pelicula
   * 
   */
  getDirectors(): string {
    if (!this.movie || !this.movie.credits || !this.movie.credits.crew) {
      return '';
    }
    
    const directors = this.movie.credits.crew.filter(crew => crew.job === 'Director').map(crew => crew.name);
    return directors.join(', ');
  }
  /**
   * 
   * @param id id de la pelicula
   */
  submitReview(): void {
    console.log(this.rating, this.content, this.member, this.movie);
    const review: Review = {
      rating: this.rating,
      content: this.content,
      member: this.member,
      movie: this.movie,
    };
    
    this.reviewService.createReview(review).subscribe(
      (response) => {
        this.showToast('Revisión creada con exito', 'success', 2000);
        if (this.movie && this.movie.id) {  
          this.getAverageRating(this.movie.id);
        }
      },
      (error) => {
        this.showToast('Error al crear la revisión', 'danger', 2000);
      }
    );
  }
  /**
   * 
   * @param msg  mensaje para mostrar en el toast
   * @param color color del toast
   * @param duration duracion del toast
   */
  async showToast(msg: string, color: string = 'primary', duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color: color
    });
    toast.present();
  }
  
  

}
