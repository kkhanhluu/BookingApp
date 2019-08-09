import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { switchMap, take } from 'rxjs/operators';
import { Address } from '../../location.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  locationImage: string;
  placeSub: Subscription;
  addressLabel = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private bookingsService: BookingService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramsMap => {
      if (!paramsMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
      }
      let fetchedUserId: string;
      this.authService
        .getUserId()
        .pipe(
          take(1),
          switchMap(userId => {
            if (!userId) {
              throw new Error('No user found');
            }
            fetchedUserId = userId;
            return this.placesService.getPlace(paramsMap.get('placeId'));
          })
        )
        .subscribe(
          place => {
            this.place = place;
            this.getAddressLabel(place.address);
            this.isBookable = place.userId !== fetchedUserId;
            this.locationImage = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s(${
              place.address.lng
            },${place.address.lat})/
              ${place.address.lng},${
              place.address.lat
            },10,0,0/300x200?access_token=pk.eyJ1Ijoia2toYW5obHV1IiwiYSI6ImNqejF2cnpjZzBwYmIzZGxvMnl0ZGcxM2UifQ.9CODXiqDDccpSiexvQ6WCg`;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error occured',
                message: 'Could not load place. Please try again later!',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/discover']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            }
          },
          { text: 'Cancel', role: 'destructive' }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { bookedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({
              message: 'Booking place...'
            })
            .then(loadingEl => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingsService
                .adddBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                  this.router.navigate(['/bookings']);
                });
            });
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: { lat: this.place.address.lat, lng: this.place.address.lng },
          selectable: false
        }
      })
      .then(modalEl => modalEl.present());
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  private getAddressLabel(address: Address) {
    if (address.road) {
      this.addressLabel += address.road + ', ';
    }
    if (address.house_number) {
      this.addressLabel += address.house_number + ', ';
    }
    if (address.postcode) {
      this.addressLabel += address.postcode + ', ';
    }
    if (address.city) {
      this.addressLabel += address.city + ', ';
    }
    if (address.state) {
      this.addressLabel += address.state + ', ';
    }
    if (address.country) {
      this.addressLabel += address.country;
    }
  }
}
