import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  @ViewChild('f', { static: false }) form: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingElement => {
        loadingElement.present();
        let authObs: Observable<AuthResponseData>;

        if (!this.isLogin) {
          authObs = this.authService.signup(email, password);
        } else {
          authObs = this.authService.login(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingElement.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            loadingElement.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up. Please try again!';
            if (code === 'EMAIL_EXISTS') {
              message = 'This emal adress already exists';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'Email address could not be found. Please try again!';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Invalid password. Please try again!';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSubmitForm(form: NgForm) {
    this.isLoading = true;

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({ header: 'Authentication failed', message, buttons: ['Okay'] })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
