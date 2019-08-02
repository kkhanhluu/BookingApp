import { Injectable } from '@angular/core';
import { Place } from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHw0tt3gO34ZgswfwD8CmbXXVcmfw3QFUbdXZCkTF4Y5-qAl1LoA',
      149.99
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris',
      'https://cdn-images-1.medium.com/max/1600/1*t-nXIcaD3oP6CS4ydXV1xw.jpeg',
      149.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://wallpaperplay.com/walls/full/1/8/6/215620.jpg',
      149
    )
  ];

  getPlaces(): Place[] {
    return [...this.places];
  }

  getPlace(id: string) {
    return { ...this.places.find(place => place.id === id) };
  }

  constructor() {}
}
