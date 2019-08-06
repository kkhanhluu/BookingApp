import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
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
          this.getAddess(modalData.data.lat, modalData.data.lng).subscribe(
            () => {}
          );
        });
        modalEl.present();
      });
  }

  private getAddess(lat: number, lng: number) {
    return this.http
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=`
      )
      .pipe(
        map(geoData => {
          console.log(geoData);
        })
      );
  }
}
