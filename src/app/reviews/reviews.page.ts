import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ReviewService } from '../services/review.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Review } from '../model/review';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { EditReviewModalComponent } from '../edit-review-modal/edit-review-modal.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent, FontAwesomeModule]
})
export class ReviewsPage implements OnInit {
  reviews: Review[] = [];
  FaStar = faStar;
  userId?: number;
  
  constructor(
      private reviewService: ReviewService,
      private modalController: ModalController
    ) { }

  ngOnInit(): void {
    this.loadUserId();
    this.getReviews();
  }
/**
 * Load user ID from local storage and log it to the console.
 * If the user ID is not found, log an error message.
 * @returns void 
 */
  loadUserId(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userId = Number(userId);
      console.log('User ID:', this.userId);
    } else {
      console.error('No se pudo obtener el ID del usuario.');
    }
  }
/**
 * Get reviews.
 * @returns void
 * @throws Error al obtener las revisiones del usuario
 */
  getReviews(): void {
    if (this.userId != null) { 
      this.reviewService.getMemberReviews(this.userId).subscribe(
        (data: Review[]) => { 
          this.reviews = data;
          console.log(data);
        },
        (error: any) => {
          console.error('Error al obtener las revisiones del usuario:', error);
        }
      );
    } else {
      console.error('ID de usuario no válido.');
    }
  }
  /**
   * 
   * @param rating  rating de la reseña 
   * @returns 
   */
  getStarArray(rating: number | undefined): any[] {
    if (rating === undefined) {
      return [];
    }
    return Array(rating).fill(0);
  }
  /**
   * 
   * @param review review
   * @returns 
   */
  async editReview(review: Review): Promise<void> {
    const modal = await this.modalController.create({
      component: EditReviewModalComponent,
      componentProps: {
        review: review
      }
    });
  /**
   * 
   * @param result  result de la reseña 
   */
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.reviewService.createReview(result.data).subscribe(
          updatedReview => {
            const index = this.reviews.findIndex(r => r.id === updatedReview.id);
            if (index !== -1) {
              this.reviews[index] = updatedReview;
            }
          },
          error => {
            console.error('Error al actualizar la reseña:', error);
          }
        );
      }
    });
  
    await modal.present();
  }
  
  /**
   * 
   * @param review review recibido por parametro
   */
  deleteReview(review: Review): void {
    if (review.id != undefined) {
      this.reviewService.deleteReview(review.id).subscribe(
        () => {
          this.reviews = this.reviews.filter(r => r.id !== review.id);
        },
        error => {
          console.error('Error al eliminar la reseña:', error);
        }
      );
    } else {
      console.error('Review ID is undefined');
    }
  }
}
