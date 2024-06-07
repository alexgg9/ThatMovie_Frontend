import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Review } from '../model/review';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-review-modal',
  templateUrl: './edit-review-modal.component.html',
  styleUrls: ['./edit-review-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, FontAwesomeModule, ReactiveFormsModule]
})
export class EditReviewModalComponent implements OnInit {
  @Input() review!: Review; 
  editReviewForm: FormGroup;
  starArray = [1, 2, 3, 4, 5];
  faStar = faStar;
  
  constructor(private fb: FormBuilder, private modalController: ModalController) {
    this.editReviewForm = this.fb.group({
      rating: [0, Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.review) {
      this.editReviewForm.patchValue({
        rating: this.review.rating,
        content: this.review.content
      });
    }
  }
  

  dismissModal(): void {
    this.modalController.dismiss();
  }
  
  saveReview(): void {
    if (this.editReviewForm.valid) {
      const updatedReview = {
        ...this.review,
        ...this.editReviewForm.value
      };
      this.modalController.dismiss(updatedReview);
    }
  }

  setRating(rating: number): void {
    this.editReviewForm.patchValue({ rating });
  }
}
