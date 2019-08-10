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
    let fetchUserId: string;
    return this.authService.getUserId().pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user found');
        }
        fetchUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http.get(
          `https://ionic-travel-app-773ae.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${fetchUserId}"&auth=${token}`
        );
      }),
      tap(resData => {
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
    let newBooking: Booking;
    let fetchedUserId: string;
    return this.authService.getUserId().pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          dateFrom,
          dateTo,
          guestNumber
        );
        return this.http.post(
          `https://ionic-travel-app-773ae.firebaseio.com/bookings.json${token}`,
          {
            ...newBooking,
            id: null
          }
        );
      }),
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
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
          .delete(
            `https://ionic-travel-app-773ae.firebaseio.com/bookings/${id}.json?auth=${token}`
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
      })
    );
  }
}
