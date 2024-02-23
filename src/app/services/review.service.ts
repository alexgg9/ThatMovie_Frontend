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
  constructor(private http: HttpClient) { }

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

}
