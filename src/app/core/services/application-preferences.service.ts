import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationPreferences } from '@app/core/models/branding/application-preferences.model';
import { environment as config } from 'environments/environment';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApplicationPreferencesService {
  private endpointUrl = `${config.api}/v1`;
  private fasApiUrl = `${config.translationApi}/v1`;

  // sharing application preferences
  private applicationPreferences = new BehaviorSubject<ApplicationPreferences>(new ApplicationPreferences({
    appPrefsId: undefined,
    orgName: 'Sogema Technologies',
    orgWebsite: 'https://sogematech.com',
    orgVisualIdentity: '../../assets/layout/images/sogema-logo-mark-w.svg',
    appSliderVisual_1: '../../assets/layout/images/eland-background-brown.png',
    appSliderVisual_2: '../../assets/layout/images/country-visual-1.png',
    appSliderVisual_3: '../../assets/layout/images/country-visual-2.png',
    saveQuicklinksValue: undefined,
    quicklinksGroups: [],
    orgMainColor: undefined,
    appMyTasksButtonColor: undefined,
    appClaimsButtonColor: undefined,
    appAllTasksButtonColor: undefined,
  }));
  public applicationPreferences_sharing = this.applicationPreferences.asObservable();

  constructor(
    private http: HttpClient
  ) {

  }

  setPreferencesToload(_dataToPreload: ApplicationPreferences) {
    this.applicationPreferences.next(_dataToPreload);
  }

  getApplicationPreferences(appPrefsId: string): Observable<ApplicationPreferences> {
    return this.http
      .get<ApplicationPreferences>(`${this.endpointUrl}/api/application-preferences/${appPrefsId}`)
      .pipe(
        map(response => new ApplicationPreferences(response)),
        catchError(this.handleError)
      );
  }

  updateApplicationPreferences(applicationPreferences: ApplicationPreferences): Observable<ApplicationPreferences> {
    return this.http
      .put<ApplicationPreferences>(
        `${this.endpointUrl}/api/application-preferences/${applicationPreferences.appPrefsId}`, applicationPreferences)
      .pipe(
        map(response => new ApplicationPreferences(response)),
        catchError(this.handleError)
      );
  }

  createApplicationPreferences(applicationPreferences: ApplicationPreferences): Observable<ApplicationPreferences> {
    applicationPreferences.appPrefsId = '1';
    return this.http
      .post<ApplicationPreferences>(`${this.endpointUrl}/api/application-preferences/`, applicationPreferences)
      .pipe(
        map(response => new ApplicationPreferences(response)),
        catchError(this.handleError));
  }

  deleteApplicationPreferences(appPrefsId: string): any {
    return this.http.delete(`${this.endpointUrl}/api/application-preferences/${appPrefsId}`)
      .subscribe(() => { }, error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }
}
