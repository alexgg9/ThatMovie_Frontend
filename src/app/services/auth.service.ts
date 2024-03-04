import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiAuthRegister = environment.apiUrl + '/auth/register';
  private apiAuthLogin = environment.apiUrl + '/auth/login';

  constructor(private http: HttpClient) { }

  register(Member: any): Observable<any> {
    return this.http.post<any>(this.apiAuthRegister, {
      Member
    })
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiAuthLogin, {
      username, password
    })
  }
}
