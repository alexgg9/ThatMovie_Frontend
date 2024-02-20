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

  constructor(private http: HttpClient) {}




  getPlaylist(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(this.apiPlaylist);
  }


  getPostersForPlaylist(id: number): Observable<string[]> {
    const url = `${this.PosterList}/${id}/posters`;
    return this.http.get<string[]>(url);
  }


}
