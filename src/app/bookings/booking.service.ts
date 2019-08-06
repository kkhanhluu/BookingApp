import { Injectable } from '@angular/core';

import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) {}

  getBookings() {
    return this.bookings.asObservable();
  }

  adddBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.getUserId(),
      placeTitle,
      placeImage,
      firstName,
      lastName,
      dateFrom,
      dateTo,
      guestNumber
    );
    return this.getBookings().pipe(
      take(1),
      delay(1500),
      tap(bookings => {
        this.bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(id: string) {
    return this.bookings.pipe(
      take(1),
      delay(1500),
      tap(bookings => {
        this.bookings.next(bookings.filter(b => b.id !== id));
      })
    );
  }
}
