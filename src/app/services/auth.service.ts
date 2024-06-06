import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiAuthRegister = environment.apiUrl + '/auth/signup';
  private apiAuthLogin = environment.apiUrl + '/auth/login';
  private apiUserInfo = environment.apiUrl + '/member/id';
  private apiCheckUsername = environment.apiUrl + '/member/usernameExists';
  


  constructor(private http: HttpClient) { }

  register(member: any): Observable<any> {
    return this.http.post<any>(this.apiAuthRegister, member);
  }
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiCheckUsername}/${username}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiAuthLogin, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('isLoggedIn', 'true');
        const userId = response.userId;
        this.setLoggedInUserId(userId);
      })
    );
  }

  setLoggedInUserId(userId: number): void {
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    } else {
      console.error('El userId es indefinido o nulo.');
    }
  }

  getLoggedInUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

  isLogin(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn == 'true';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
  }

  getUserInfo(userId: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUserInfo}/${userId}`);
  }
  updateUserInfo(user: Member): Observable<any> {
    return this.http.put<any>(this.apiAuthRegister, user);
  }
}