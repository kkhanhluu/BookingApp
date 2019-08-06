import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIsAuthenticated = true;
  private userId = 'xyz';

  constructor() {}

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }

  getUserIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  getUserId() {
    return this.userId;
  }
}
