import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';
import { LoginRequest } from '../login/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiLogin = environment.apiUrl + '/auth/login'
  private apiRegister = environment.apiUrl + '/auth/register'


  constructor(private http: HttpClient) {}


  getlogin(loginRequest: LoginRequest): Observable<LoginRequest> {
    return this.http.post<LoginRequest>(this.apiLogin, { ...loginRequest });
  }
  getRegister(member : Member): Observable<Member> {
    return this.http.post<Member>(this.apiRegister, member);
  }

}
