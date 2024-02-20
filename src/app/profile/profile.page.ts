import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent]
})
export class ProfilePage implements AfterViewInit, OnInit {

  movie?: Movie | undefined;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('container') container!: ElementRef
  calculatedHeightVariable!: number;
  loaded:WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    const movieIdString = this.route.snapshot.paramMap.get('id');
    if (movieIdString !== null) {
      const movieId = parseInt(movieIdString, 10);
      if (!isNaN(movieId)) {
        this.getMovieProfile(movieId);
      } else {
        // Manejar el caso en el que el ID de la película no es un número válido
        console.error('El ID de la película no es un número válido.');
      }
    } else {
      // Manejar el caso en el que el parámetro 'id' es null o no está presente en la URL
      console.error('El parámetro "id" es nulo o no está presente en la URL.');
    }
  }


  getMovieProfile(id: number) {
    this.movieService.getProfileMovies(id).subscribe((movie) => {
      this.movie = movie;
      this.loaded.set(true);
      console.log('Movie profile:', this.movie);
    });
  }

  

  ngAfterViewInit(): void {
    
    const swiper = new Swiper(this.swiperContainer.nativeElement, {
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

    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },200)
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
  const calculatedHeight = windowHeight - 80; // Ajusta según el tamaño del encabezado
  console.log('Altura calculada:', calculatedHeight);
  if (this.container) {
    this.container.nativeElement.style.height = calculatedHeight + 'px';
  }
}

  
}
