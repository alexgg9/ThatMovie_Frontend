import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../model/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private apiMembers = environment.apiUrl + '/member';
  private currentMember: Member | undefined;

  constructor(private http: HttpClient) { }

  setCurrentMember(member: Member) {
    this.currentMember = member;
  }

  getCurrentMember(): Member | undefined {
    return this.currentMember;
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

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiMembers}/${id}`);
  }

  getMemberByUsername(username: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiMembers}/username/${username}`);
  }
}
