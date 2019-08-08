export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceLocation extends Coordinates {
  address: Address;
}

export interface Address extends Coordinates {
  city: string;
  country: string;
  country_code: string;
  county: string;
  postcode: string;
  suburb: string;
  town: string;
}
