import { NgxUiLoaderConfig, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';

// to be reworked relatively to the - dynamic/customizable -branding norms
export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'rgb(198,165,49)',
  bgsOpacity: 1,
  bgsPosition: POSITION.bottomRight,
  bgsType: SPINNER.ballSpinClockwiseFadeRotating,
  fgsType: SPINNER.ballSpinClockwiseFadeRotating,
  fgsColor: 'rgb(198,165,49)',
  fgsPosition: POSITION.centerCenter,
  blur: 15,
  delay: 0,
  fastFadeOut: true,
  fgsSize: 55,
  bgsSize: 40,
  gap: 24,
  logoPosition: POSITION.centerCenter,
  logoSize: 120,
  logoUrl: 'assets/layout/images/eland-logo-mark-w.svg',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: 'rgb(198,165,49)',
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  hasProgressBar: true,
  text: 'One moment please, the page is loading..',
  textColor: '#FFFFFF',
  textPosition: POSITION.centerCenter,
  maxTime: -1,
  minTime: 500
};

export const noBackgroundPreloading: string[] = [
  '/parameters',
  '/parameters?param=territory&territory=Country',
  '/parameters?param=territory&territory=Region',
  '/parameters?param=territory&territory=Circle',
  '/parameters?param=territory&territory=Division',
  '/parameters?param=territory&territory=District'
];
