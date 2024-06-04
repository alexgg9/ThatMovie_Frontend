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
  constructor(private modalCtrl: ModalController, private movieService: MovieService, private router: Router ) { }

  ngOnInit() {}

  
  onSearch(event: any) {
    const query = event.target.value;
    if (query && query.trim() !== '') {
      this.searchInputClicked = true;
      this.searchMovies(query);
    } else {
      this.moviesSearched = [];
      this.searchInputClicked = false;
    }
  }

  async searchMovies(query: string) {
    this.statusSearch = true;
    try {
      const response = await this.movieService.getSearchMovies(query).toPromise();
      if (response && response.results && response.results.length > 0) {
        this.moviesSearched = response.results;
      } else {
        this.moviesSearched = [];
      }
    } catch (error) {
      console.error('Error searching for movies:', error);
    } finally {
      this.statusSearch = false;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getImageUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  
  openProfile(movieId: number) {
    this.modalCtrl.dismiss(); // Cierra el modal
    this.router.navigateByUrl(`/profile/${movieId}`); // Navega a la página del perfil de la película
  }

}
