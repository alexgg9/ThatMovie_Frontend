import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReviewService } from '../services/review.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Review } from '../model/review';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { MemberService } from '../services/member.service';
import { Member } from '../model/member';

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
  member?: Member;
  
  constructor(private reviewService: ReviewService, private memberService: MemberService) { }

  ngOnInit(): void {
    this.getMember();
    this.getReviews();
  }
  
  
  getMember(): void {
    const currentMember = this.memberService.getCurrentMember();
    if (currentMember) {
      this.member = currentMember;
      console.log('Member:', this.member);
    } else {
      console.error('No se pudo obtener la información del usuario.');
    }
  }
  
  
  getReviews() {
    if (this.member && this.member.id != null) { 
      this.reviewService.getMemberReviews(this.member.id).subscribe(
        (data: Review[]) => { 
          this.reviews = data;
          console.log(data);
        },
        (error: any) => {
          console.error('Error al obtener las revisiones del usuario:', error);
        }
      );
    } else {
      console.error('ID de miembro no válido.');
    }
  }
  
  
  

  getStarArray(rating: number | undefined): any[] {
    if (rating === undefined) {
      return [];
    }
    return Array(rating).fill(0);
  }
  
  editReview(review: Review): void {
    
  }
  
  deleteReview(review: Review): void {
    if (review.id !== undefined) {
      this.reviewService.deleteReview(review.id).subscribe(
        () => {
          this.reviews = this.reviews.filter(r => r.id !== review.id);
        }
      );
    } else {
      console.error('Review ID is undefined');
    }
  }

}
