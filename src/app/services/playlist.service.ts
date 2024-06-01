import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { MemberService } from './member.service';
import { playlist } from '../model/playlist';
import { Movie } from '../model/movie';
import { catchError, throwError } from 'rxjs';










@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiPlaylist = environment.apiUrl + '/playlist';
  private PosterList = environment.apiUrl + '/playlist/5/posters';
  private addmovie = environment.apiUrl + '/playlist/playlist/{id}/addMovie  ';  
  private createList = environment.apiUrl + '/playlist';
  private movieList = environment.apiUrl + '/playlist';
  private addMovieList = environment.apiUrl + '/playlist/playlist/{id}/addMovie';

  constructor(private http: HttpClient,private memberService: MemberService) {}




  getPlaylist(): Observable<playlist[]> {
    return this.http.get<playlist[]>(this.apiPlaylist);
  }


  
  getPostersForPlaylist(id: number): Observable<string[]> {
    const url = `${environment.apiUrl}/playlist/${id}/posters`;
    console.log('URL para obtener posters:', url);
    return this.http.get<string[]>(url);
  }

  postCreateList(playlist: playlist): Observable<playlist> {
    return this.http.post<playlist>(this.createList, playlist);
  }



  getMovieList(id: number): Observable<playlist> {
    const url = `${this.movieList}/${id}`;
    return this.http.get<playlist>(url);
  }

  addMovieToList(playlistId: string, movieId: string): Observable<any> {
    const url = this.addMovieList.replace('{id}', playlistId);
    return this.http.post(url, { movieId: movieId });
  }

  postAddMovieToPlaylist(playlistId: number, movie: Movie): Observable<any> {
    const url = this.addmovie.replace('{id}', playlistId.toString());
    return this.http.post(url, movie, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(`Error al añadir la película: ${error.message}`));
      })
    );
  }

}
