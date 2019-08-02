import { Component, OnInit } from '@angular/core';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
  offers: Place[];

  constructor(private placesService: PlacesService) {
    this.offers = this.placesService.getPlaces();
  }

  ngOnInit() {}
}
