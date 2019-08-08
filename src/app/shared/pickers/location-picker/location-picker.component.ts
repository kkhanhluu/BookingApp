import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Address } from 'src/app/places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<Address>();

  selectedLocationImage: string;
  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl
      .create({
        component: MapModalComponent
      })
      .then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
          const pickedLocation: PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null
          };
          this.getAddess(modalData.data.lat, modalData.data.lng).subscribe(
            address => {
              pickedLocation.address = {
                ...address,
                lat: modalData.data.lat,
                lng: modalData.data.lng
              };
              this.selectedLocationImage = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s(${
                pickedLocation.lng
              },${pickedLocation.lat})/
            ${pickedLocation.lng},${
                pickedLocation.lat
              },10,0,0/300x200?access_token=pk.eyJ1Ijoia2toYW5obHV1IiwiYSI6ImNqejF2cnpjZzBwYmIzZGxvMnl0ZGcxM2UifQ.9CODXiqDDccpSiexvQ6WCg`;
              this.locationPick.emit(pickedLocation.address);
            }
          );
        });
        modalEl.present();
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
