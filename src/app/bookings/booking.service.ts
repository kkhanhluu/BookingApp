import { Injectable } from '@angular/core';

import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  getBookings() {
    return this.bookings.asObservable();
  }

  fetchBookings() {
    return this.http
      .get(
        `https://ionic-travel-app-773ae.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.getUserId()}"`
      )
      .pipe(
        tap(resData => {
          console.log(resData);
          const bookingList = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookingList.push(
                new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userid,
                  resData[key].placeTitle,
                  resData[key].placeImage,
                  resData[key].firstName,
                  resData[key].lastName,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo),
                  resData[key].guestNumber
                )
              );
            }
          }
          this.bookings.next(bookingList);
        })
      );
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
    return this.http
      .post('https://ionic-travel-app-773ae.firebaseio.com/bookings.json', {
        ...newBooking,
        id: null
      })
      .pipe(
        switchMap(resData => {
          return this.bookings;
        }),
        take(1),
        tap((bookings: Booking[]) => {
          this.bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(id: string) {
    return this.http
      .delete(
        `https://ionic-travel-app-773ae.firebaseio.com/bookings/${id}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          this.bookings.next(bookings.filter(b => b.id !== id));
        })
      );
  }
}
