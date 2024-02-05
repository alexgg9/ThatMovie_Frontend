import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse } from '../model/movieResponse';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiPopular = environment.apiUrl + '/api/movies/popular';
  private apiUpcoming = environment.apiUrl + '/api/movies/upcoming';
  private apiNowPlaying = environment.apiUrl + '/api/movies/now_playing';

  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.apiPopular);
  }

  getNowPlaying(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.apiNowPlaying);
  }

  getUpcomingMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.apiUpcoming);
  }
  
}