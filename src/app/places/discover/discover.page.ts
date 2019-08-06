import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.getPlaces().subscribe(places => {
      this.places = places;
      this.relevantPlaces = places;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }
  // onOpenMenu() {
  //   this.menuCtrl.toggle('m1');
  // }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.places;
    } else {
      this.relevantPlaces = this.places.filter(
        p => p.userId !== this.authService.getUserId()
      );
    }
    this.listedLoadedPlaces = this.relevantPlaces.slice(1);
  }

  ngOnDestroy() {
    this.placesSub.unsubscribe();
  }
}
