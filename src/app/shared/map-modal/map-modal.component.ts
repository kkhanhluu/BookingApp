import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { icon, Map, marker, tileLayer, circle } from 'leaflet';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map;
  clickListener: any;
  @Input() center = { lat: 21.044739, lng: 105.80832 };
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  leafletMap() {
    // In setView add latLng and zoom
    this.map = new Map('map').setView([this.center.lat, this.center.lng], 10);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
        <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`
    }).addTo(this.map);

    marker([this.center.lat, this.center.lng], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    })
      .addTo(this.map)
      .bindPopup('Author is here.')
      .openPopup();

    // this.map.locate({ setView: true, maxZoom: 28 }).on('locationfound', e => {
    //   console.log(e);
    //   const radius = e.accuracy;
    //   marker(e.latlng, {
    //     icon: icon({
    //       iconSize: [25, 41],
    //       iconAnchor: [13, 41],
    //       iconUrl: 'leaflet/marker-icon.png',
    //       shadowUrl: 'leaflet/marker-shadow.png'
    //     })
    //   })
    //     .addTo(this.map)
    //     .bindPopup('You are within ' + radius + ' meters from this point')
    //     .openPopup();
    //   circle(e.latlng, radius).addTo(this.map);
    // });
    if (this.selectable) {
      this.clickListener = this.map.on('click', e => {
        const selectedCoords = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        };
        this.modalCtrl.dismiss(selectedCoords);
      });
    }
  }

  ionViewDidEnter() {
    this.leafletMap();
  }

  ngAfterViewInit() {
    // this.getGoogleMap()
    //   .then(googleMaps => {
    //     const mapEl = this.mapElementRef.nativeElement;
    //     const map = new googleMaps.Map(mapEl, {
    //       center: { lat: -34.397, lng: 150.644 },
    //       zoom: 16
    //     });
    //     googleMaps.event.addListenerOnce(map, 'idle', () => {
    //       this.renderer.addClass(mapEl, 'visible');
    //     });
    //     map.addListener('click', event => {
    //       const selectedCoords = {
    //         lat: event.latLng.lat(),
    //         lng: event.latLng.lng()
    //       };
    //       this.modalCtrl.dismiss(selectedCoords);
    //     });
    //   })
    //   .catch(error => console.log(error));
    // this.map.setTarget('map');
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.map.off('click');
    }
  }
  // private getGoogleMap(): Promise<any> {
  // const osmModule = (window as any).OSM;
  // const win = window as any;
  // const googleModule = win.google;
  // if (googleModule && googleModule.maps) {
  //   return Promise.resolve(googleModule.maps);
  // }
  // return new Promise((resolve, reject) => {
  //   const script = document.createElement('script');
  //   script.src = 'https://maps.googleapis.com/maps/api/js?key=';
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);
  //   script.onload = () => {
  //     const loadedGoogleModule = win.google;
  //     if (loadedGoogleModule && loadedGoogleModule.maps) {
  //       resolve(loadedGoogleModule.maps);
  //     } else {
  //       reject('Google maps SDK not available');
  //     }
  //   };
  // });
  // }
}
