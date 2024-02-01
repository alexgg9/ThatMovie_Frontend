import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse } from '../model/movieResponse';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private api = environment.apiUrl + '/api/movies/popular';

  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.api);
  }
  
}