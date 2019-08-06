import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../places.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Place;
  form: FormGroup;
  isLoading = false;
  placeId: string;
  offerSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramsMap => {
      if (!paramsMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
      } else {
        this.placeId = paramsMap.get('placeId');
        this.isLoading = true;
        this.offerSub = this.placesService
          .getPlace(paramsMap.get('placeId'))
          .subscribe(
            place => {
              this.offer = place;

              this.form = new FormGroup({
                title: new FormControl(this.offer.title, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                description: new FormControl(this.offer.description, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                })
              });
              this.isLoading = false;
            },
            error => {
              this.alertCtrl
                .create({
                  header: 'An error occurred!',
                  message:
                    'Place could not be fetched. Please try again later.',
                  buttons: [
                    {
                      text: 'Okay',
                      handler: () => {
                        this.router.navigate(['/places/tabs/offers']);
                      }
                    }
                  ]
                })
                .then(alertEl => {
                  alertEl.present();
                });
            }
          );
      }
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating place...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService
          .updateOffer(
            this.offer.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/', 'places', 'tabs', 'offers']);
          });
      });
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }
}
