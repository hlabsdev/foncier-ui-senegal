import { Component, OnInit } from '@angular/core';
import { ApplicationPreferences } from '@app/core/models/branding/application-preferences.model';
import { ApplicationPreferencesService } from '@app/core/services/application-preferences.service';
import { TranslateService } from '@ngx-translate/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

export interface ElandSlide {
  visualMain: string;
  visualSecondary: string;
  titleHeaderSpan: string;
  link: string;
  disableCopy: boolean;
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  health: any;
  display = false;
  slides: ElandSlide[] = [];
  sliderConfig: SwiperConfigInterface;

  // shared application preference
  applicationPreferences: ApplicationPreferences;

  constructor(
    private applicationPreferencesService: ApplicationPreferencesService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initSlider();
    this.applicationPreferences = new ApplicationPreferences();
    this.sharingAppPrefs();

    this.translateService.get(['HOME']).subscribe(values => {
      this.slides = [
        {
          visualMain: this.applicationPreferences.appSliderVisual_1,
          visualSecondary: '',
          titleHeaderSpan: values.HOME.SLIDER_TITLE_HEADER,
          link: 'https://sogematech.com/en/lamp',
          disableCopy: false
        },
        {
          visualMain: this.applicationPreferences.appSliderVisual_2,
          visualSecondary: '',
          titleHeaderSpan: '',
          link: '',
          disableCopy: true
        },
        {
          visualMain: this.applicationPreferences.appSliderVisual_3,
          visualSecondary: '',
          titleHeaderSpan: '',
          link: '',
          disableCopy: true
        }
      ];
    });
  }

  initSlider() {
    this.sliderConfig = {
      a11y: true,
      direction: 'horizontal',
      slideClass: 'eland-slide',
      freeMode: true,
      slidesPerView: 1,
      slideToClickedSlide: true,
      mousewheel: true,
      scrollbar: false,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      navigation: false,
      pagination: false,
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      centeredSlides: true,
      loop: true,
      roundLengths: false,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      spaceBetween: -1,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false
      },
      speed: 2000,
      simulateTouch: true,
      effect: 'fade',
      grabCursor: false,
      passiveListeners: true,
      updateOnWindowResize: true,
      breakpoints: {
        640: {
          slidesPerView: 1
        }
      }
    };
  }

  sharingAppPrefs() {
    this.applicationPreferencesService.applicationPreferences_sharing.subscribe(
      (appPrefs) => {
        this.applicationPreferences = appPrefs;
        this.slides[0].visualMain = this.applicationPreferences.appSliderVisual_1;
        this.slides[1].visualMain = this.applicationPreferences.appSliderVisual_2;
        this.slides[2].visualMain = this.applicationPreferences.appSliderVisual_3;
      });
  }

  showQLAddDialog() {
    this.display = true;
  }
  closeQuicklinkAddDialog() {
    this.display = false;
  }
}
