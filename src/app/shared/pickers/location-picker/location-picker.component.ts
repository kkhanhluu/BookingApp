import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  AlertController
} from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  PlaceLocation,
  Address,
  Coordinates
} from 'src/app/places/location.model';
import { Capacitor, Plugins } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<Address>();
  @Input() showPreview = false;
  isLoading = false;
  selectedLocationImage: string;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Please choose',
        buttons: [
          {
            text: 'Auto locate',
            handler: () => {
              this.locateUser();
            }
          },
          {
            text: 'Pick on map',
            handler: () => {
              this.openMap();
            }
          },
          {
            text: 'Cancel',
            role: 'Cancel'
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick the location',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  private openMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent
      })
      .then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
        modalEl.present();
      });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null
    };
    this.getAddess(lat, lng).subscribe(address => {
      pickedLocation.address = {
        ...address,
        lat,
        lng
      };
      this.selectedLocationImage = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s(${
        pickedLocation.lng
      },${pickedLocation.lat})/
    ${pickedLocation.lng},${
        pickedLocation.lat
      },10,0,0/300x200?access_token=pk.eyJ1Ijoia2toYW5obHV1IiwiYSI6ImNqejF2cnpjZzBwYmIzZGxvMnl0ZGcxM2UifQ.9CODXiqDDccpSiexvQ6WCg`;
      this.locationPick.emit(pickedLocation.address);
    });
  }

  private getAddess(lat: number, lng: number) {
    return this.http
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
      .pipe(
        map((geoData: any) => {
          return geoData.address;
        })
      );
  }
}
