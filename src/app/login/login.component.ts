import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { ConfigService } from '@app/core/app-config/config.service';
import { catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';

export interface ElandSlide {
  visualMain: string;
}
@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  health: any;
  display = false;
  slides: ElandSlide[];
  sliderConfig: SwiperConfigInterface;
  showPassword = false;

  username: string;
  password: string;
  config: any;
  returnUrl: string;
  tokenInfo: string;
  errorMessage: Boolean = false;

  constructor(
    private translateService: TranslateService,
    private keycloakService: KeycloakService,
    private configService: ConfigService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.sliderConfig = {
      a11y: {
        enabled: true
      },
      direction: 'horizontal',
      slideClass: 'eland-slide',
      freeMode: true,
      mousewheel: true,
      scrollbar: false,
      watchSlidesProgress: true,
      watchSlidesVisibility: false,
      navigation: false,
      pagination: false,
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      centeredSlides: true,
      loop: true,
      initialSlide: 0,
      slidesPerView: 1,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false
      },
      speed: 2000,
      simulateTouch: true,
      effect: 'fade',
      grabCursor: false,
      passiveListeners: false,
      updateOnWindowResize: true
    };
  }

  ngOnInit(): void {

    this.config = this.configService.getDefaultConfig('EXTERNAL_SERVICES.keycloak');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.returnUrl === '/') {
      this.returnUrl = '/home';
    }

    this.translateService.get(['LOGIN']).subscribe(values => {
      this.slides = [
        {
          visualMain: '../../assets/layout/images/eland-background-brown.png'
        }
      ];
    });
  }

  submit() {

    this.getTokenKeyCloak(this.username, this.password)
      .subscribe(data => {
        this.keycloakService.init(
          {
            config: {
              url: this.config.keyCloakUrl,
              realm: this.config.keyCloakRealm,
              clientId: this.config.keyCloakClientId
            },
            initOptions: {
              checkLoginIframe: false,

              token: data.access_token,
              idToken: data.id_token,
              refreshToken: data.refresh_token,
              redirectUri: this.returnUrl,
            },
          })
        .then(res => {
          localStorage.setItem('token', JSON.stringify(data));

          window.location.replace(this.returnUrl);
          window.history.replaceState(window.history.state, null, this.returnUrl);
        })
        .catch(error => {
           this.handleError(error);
        });

      },
      error => {
        // console.error(error.message + ' : ' + error.error.description);
        this.handleError(error);
        if (error.status === 401) {
          this.errorMessage = true;
          this.password = '';
        }
      }
    );

  }

  getTokenKeyCloak(username: string, password: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams({
      fromObject: {
        grant_type: 'password',
        client_id: this.config.keyCloakClientId,
        username: username,
        password: password,
        scope: 'openid',
      },
    });

    const url = `${this.config.keyCloakUrl}/realms/${this.config.keyCloakRealm}/protocol/openid-connect/token`;

    return this.http.post(url, params, httpOptions)
    .pipe(
        tap((response: any) => {
          this.tokenInfo = response.access_token;
        }),
        catchError(this.handleError)
    );

  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }


}
