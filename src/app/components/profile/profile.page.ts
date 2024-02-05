import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  movie?: Movie | undefined;

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
      console.log('Movie profile:', this.movie);
    });
  }
}
