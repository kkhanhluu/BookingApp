import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import { map, tap } from 'rxjs/operators';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  logout() {
    this.user.next(null);
  }

  getUserIsAuthenticated() {
    return this.user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.getToken();
        }
        return false;
      })
    );
  }

  getUserId() {
    return this.user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        }
        return null;
      })
    );
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
          environment.firebaseAPIKey
        }`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(
        tap(userData => {
          this.setUserData(userData);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
          environment.firebaseAPIKey
        }`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(tap(userData => this.setUserData(userData)));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this.user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationDate
      )
    );
  }
}
