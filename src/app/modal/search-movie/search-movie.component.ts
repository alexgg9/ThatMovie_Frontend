import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
})
export class SearchMovieComponent implements OnInit {
  moviesSearched: any[] = [];
  searchInputClicked = false;
  statusSearch = false;
  searching = false;
  constructor(private modalCtrl: ModalController, private movieService: MovieService, private router: Router ) { }

  ngOnInit() {}

  
  onSearch(event: any) {
    const query = event.target.value;
    if (query && query.trim() !== '') {
      this.searching = true;
      this.searchInputClicked = true;
      this.searchMovies(query);
    } else {
      this.moviesSearched = [];
      this.searching = false;
    }
  }

  searchMovies(query: string) {
    this.statusSearch = true;
    this.movieService.getSearchMovies(query).subscribe(
      (response: any) => {
        if (response.results) {
          console.log('Respuesta:', response);
          this.moviesSearched = response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            director: movie.credits?.crew ? movie.credits.crew.find((crewMember: any) => crewMember.job === 'Director')?.name : ''
          }));
        } else {
          console.error('No se encontraron películas en la respuesta.');
          this.moviesSearched = [];
        }
        this.statusSearch = false;
        this.searching = this.moviesSearched.length > 0;
      },
      (error: any) => {
        console.error('Error al obtener películas:', error);
        this.moviesSearched = [];
        this.statusSearch = false;
      }
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  
  openProfile(movieId: number) {
    this.modalCtrl.dismiss(); 
    this.router.navigateByUrl(`/profile/${movieId}`); 
  }

}
