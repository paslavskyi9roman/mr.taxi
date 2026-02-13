import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environment/environment';

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
  relative_time_description?: string;
}

export interface PlaceDetailsResponse {
  reviews: GoogleReview[];
  rating: number;
  totalRatings: number;
}

export interface ReviewsWithMeta {
  reviews: GoogleReview[];
  rating: number;
  totalRatings: number;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleReviewsService {
  // Firebase Cloud Function URL for fetching reviews
  // Set this in environment.ts after deploying the Cloud Function
  private readonly functionUrl = (environment as any).googleReviewsFunctionUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches reviews with rating and total count (for slider and header).
   */
  public getReviewsWithMeta(): Observable<ReviewsWithMeta> {
    const fallback: ReviewsWithMeta = {
      reviews: this.getMockReviews(),
      rating: 5,
      totalRatings: 57
    };
    if (!this.functionUrl) {
      console.warn('Google Reviews function URL not configured. Using mock data.');
      return of(fallback);
    }
    return this.http.get<PlaceDetailsResponse>(this.functionUrl).pipe(
      map(response => ({
        reviews: response.reviews?.length ? response.reviews : fallback.reviews,
        rating: response.rating ?? fallback.rating,
        totalRatings: response.totalRatings ?? fallback.totalRatings
      })),
      catchError(error => {
        console.error('Error fetching Google reviews:', error);
        return of(fallback);
      })
    );
  }

  /** @deprecated Use getReviewsWithMeta() */
  public getReviews(): Observable<GoogleReview[]> {
    return this.getReviewsWithMeta().pipe(map(m => m.reviews));
  }

  /**
   * Mock reviews as fallback when API is not configured
   * These will be replaced with real reviews once Cloud Function is set up
   */
  private getMockReviews(): GoogleReview[] {
    return [
      {
        author_name: 'Sarah M.',
        rating: 5,
        text: 'Excellent service! The driver was on time, professional, and the car was very clean. I\'ll definitely use Mr. Taxi again for my airport transfers.',
        time: Date.now()
      },
      {
        author_name: 'John D.',
        rating: 5,
        text: 'Best taxi service in the region. Fair prices, comfortable ride, and easy online booking. Highly recommended!',
        time: Date.now()
      },
      {
        author_name: 'Maria K.',
        rating: 5,
        text: 'Very reliable and professional. The driver helped with my luggage and got me to Schiphol on time. Great experience!',
        time: Date.now()
      }
    ];
  }
}

