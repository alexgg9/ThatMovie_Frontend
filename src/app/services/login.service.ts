import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiLogin = environment.apiUrl + '/auth/login'
  private apiRegister = environment.apiUrl + '/auth/register'


  constructor(private http: HttpClient) {}


  getlogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiLogin, { email, password });
  }
  getRegister(member : Member): Observable<Member> {
    return this.http.post<Member>(this.apiRegister, member);
  }

}
