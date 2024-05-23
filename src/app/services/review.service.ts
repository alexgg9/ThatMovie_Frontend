import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Review } from '../model/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiReviews = environment.apiUrl + '/reviews';
  private apiMembersReviews = environment.apiUrl + '/reviews/member';
  constructor(private http: HttpClient) { }

  getMemberReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiMembersReviews}/${id}`);
  }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiReviews);
  }
  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiReviews}/${id}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiReviews, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiReviews}/${id}`);
  }

  getAverageRating(movieId: number): Observable<number> {
    return this.http.get<number>(`${this.apiReviews}/average-rating/${movieId}`);
  }

}
