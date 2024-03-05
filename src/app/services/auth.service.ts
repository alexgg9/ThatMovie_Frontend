import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiAuthRegister = environment.apiUrl + '/auth/signup';
  private apiAuthLogin = environment.apiUrl + '/auth/login';
  isLoggedIn = false;
  constructor(private http: HttpClient) { }

  register(member: any): Observable<any> {
    return this.http.post<any>(this.apiAuthRegister, member);
  }
  

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiAuthLogin, { username, password });
  }

  
  isLogin() {
    this.isLoggedIn = true;
  }

  isLogout() {
    this.isLoggedIn = false;
  }
}
