import { Injectable } from '@angular/core';

import { TaxiBookingData } from '../models/taxi-booking-data.model';
import { environment } from '../../../environment/environemnt';

@Injectable({
  providedIn: 'root'
})
export class TaxiOrderService {
  private readonly driversPhoneNumber = environment.driversPhoneNumber;

  public bookATaxi(bookingData: TaxiBookingData): void {
    const message = this.createBookMessage(bookingData);
    this.sendMessage(message);
  }

  private createBookMessage(bookingData: TaxiBookingData): string {
    const luggageText = bookingData.luggage ? bookingData.luggage : 'None';
    const additionalStopsText =
      bookingData.additionalStops.length > 0 ? bookingData.additionalStops.join(', ') : 'None';
    let message = `Booking Details:\n- Pick-up: ${bookingData.from}\n- Destination: ${bookingData.to}\n- Passenger Name: ${bookingData.passengerName}\n- Passenger Phone: ${bookingData.passengerPhoneNumber}\n- Passengers: ${bookingData.numberOfPassengers}\n- Comment: ${bookingData.comment}\n- Additional Stops: ${additionalStopsText}\n- Luggage: ${luggageText}`;

    if (bookingData.rideDate) {
      message += `\n- Ride Date: ${bookingData.rideDate}`;
    }
    if (bookingData.rideTime) {
      message += `\n- Ride Time: ${bookingData.rideTime}`;
    }
    if (bookingData.flightNumber) {
      message += `\n- Flight Number: ${bookingData.flightNumber}`;
    }

    return message;
  }

  private sendMessage(message: string): void {
    const url = `https://wa.me/${this.driversPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
