export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceLocation extends Coordinates {
  address: Address;
}

export interface Address extends Coordinates {
  city: string;
  city_district: string;
  country: string;
  country_code: string;
  county: string;
  house_number: string;
  lat: number;
  lng: number;
  neighbourhood: string;
  postcode: string;
  road: string;
  state: string;
  state_district: string;
  suburb: string;
}
