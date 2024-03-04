import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Playlist } from '../model/Playlist';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiPlaylist = environment.apiUrl + '/playlist';
  private PosterList = environment.apiUrl + '/playlist/posters';
  private createList = environment.apiUrl + '/playlist';
  private movieList = environment.apiUrl + '/playlist';

  constructor(private http: HttpClient) {}




  getPlaylist(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiPlaylist);
  }


  getPostersForPlaylist(id: number): Observable<string[]> {
    const url = `${this.PosterList}/${id}/posters`;
    return this.http.get<string[]>(url);
  }

  postCreateList(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(this.createList, playlist);
  }

  getMovieList(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(this.movieList + id);
  }

}
