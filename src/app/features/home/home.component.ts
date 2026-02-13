import { Component, inject, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TaxiOrderFormComponent } from '../taxi-order-form/taxi-order-form.component';
import { TariffService } from '../tariffs/tariff.service';
import { Observable, map } from 'rxjs';
import { Tariff } from '../tariffs/tariff.model';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environment/environment';
import { PriceCalculatorComponent } from '../../shared/components/price-calculator/price-calculator.component';
import { GoogleReviewsService, GoogleReview } from '../../core/services/google-reviews.service';

@Component({
  selector: 'app-home',
  imports: [
    TranslatePipe,
    TranslateModule,
    CommonModule,
    TaxiOrderFormComponent,
    RouterLink,
    MatIconModule,
    PriceCalculatorComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('bookingForm', { static: false }) bookingFormRef!: ElementRef;
  @ViewChild('bookingFormComponent', { static: false }) bookingFormComponent!: TaxiOrderFormComponent;

  private tariffService = inject(TariffService);
  private googleReviewsService = inject(GoogleReviewsService);
  private cdr = inject(ChangeDetectorRef);
  
  public tariffs$: Observable<Tariff[]> = this.tariffService.getTariffs();
  public airportTariffs: Tariff[] = [];
  public phoneNumber = environment.driversPhoneNumber;
  public googleReviews: GoogleReview[] = [];
  public reviewsRating = 5;
  public reviewsTotal = 0;
  public currentReviewIndex = 0;
  /** Disable track transition when wrapping last↔first to avoid long jump animation */
  public skipTrackTransition = false;

  ngOnInit(): void {
    this.tariffs$.subscribe((tariffs) => {
      this.airportTariffs = tariffs.filter((tariff) => {
        const to = tariff.route.to.toLowerCase();
        return (
          to.includes('schiphol') ||
          to.includes('rotterdam') ||
          to.includes('eindhoven') ||
          to.includes('airport')
        );
      });
    });

    this.googleReviewsService.getReviewsWithMeta().subscribe((meta) => {
      this.googleReviews = meta.reviews;
      this.reviewsRating = meta.rating;
      this.reviewsTotal = meta.totalRatings;
    });
  }

  get displayReviews(): GoogleReview[] {
    return this.googleReviews.length > 0 ? this.googleReviews : [];
  }

  onReviewImageError(review: GoogleReview): void {
    review.profile_photo_url = '';
    this.cdr.detectChanges();
  }

  goPrevReview(): void {
    if (this.displayReviews.length === 0) return;
    const len = this.displayReviews.length;
    if (len <= 1) return;
    if (this.currentReviewIndex === 0) {
      this.skipTrackTransition = true;
      this.currentReviewIndex = len - 1;
      setTimeout(() => (this.skipTrackTransition = false), 50);
    } else {
      this.currentReviewIndex = this.currentReviewIndex - 1;
    }
  }

  goNextReview(): void {
    if (this.displayReviews.length === 0) return;
    const len = this.displayReviews.length;
    if (len <= 1) return;
    if (this.currentReviewIndex === len - 1) {
      this.skipTrackTransition = true;
      this.currentReviewIndex = 0;
      setTimeout(() => (this.skipTrackTransition = false), 50);
    } else {
      this.currentReviewIndex = this.currentReviewIndex + 1;
    }
  }

  goToReview(i: number): void {
    if (i >= 0 && i < this.displayReviews.length) this.currentReviewIndex = i;
  }

  public scrollToBookingForm(destination?: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    // Wait for view to be initialized
    setTimeout(() => {
      const formElement = document.querySelector('.hero-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Pre-fill destination if provided
        if (destination && this.bookingFormComponent) {
          setTimeout(() => {
            this.bookingFormComponent.taxiOrderForm.patchValue({
              to: destination
            });
          }, 500);
        }
      }
    }, 100);
  }
}
