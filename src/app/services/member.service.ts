import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private apiMembers = environment.apiUrl + '/member';
  private currentMemberSubject = new BehaviorSubject<Member | null>(null);
  currentMember$ = this.currentMemberSubject.asObservable();

  constructor(private http: HttpClient) { }

  setCurrentMember(member: Member) {
    this.currentMemberSubject.next(member);
  }

  getCurrentMember(): Member | null {
    return this.currentMemberSubject.value;
  }

  loadCurrentMember(userId: number): void {
    this.getMemberById(userId).subscribe(
      member => this.setCurrentMember(member),
      error => console.error('Error al obtener la información del usuario', error)
    );
  }

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiMembers);
  }

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiMembers}/id/${id}`);
  }

  createMember(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiMembers, member);
  }

  updateMember(member: Member): Observable<Member> {
    return this.http.post<Member>(`${this.apiMembers}`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiMembers}/${id}`);
  }

  getMemberByUsername(username: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiMembers}/username/${username}`);
  }
}
