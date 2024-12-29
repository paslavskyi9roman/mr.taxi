export interface TaxiBookingData {
  from: string;
  to: string;
  passengerName: string;
  passengerPhoneNumber: string;
  numberOfPassengers: number;
  comment: string;
  additionalStops: string[];
  luggage: string;
  flightNumber: string;
  rideDate: string;
  rideTime: string;
}
