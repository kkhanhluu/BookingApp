import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  placesSubscription: Subscription;
  isLoading = false;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSubscription = this.placesService
      .getPlaces()
      .subscribe(places => {
        this.offers = places;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEditOffer(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy() {
    this.placesSubscription.unsubscribe();
  }
}
