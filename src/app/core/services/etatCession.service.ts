import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as config } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { EtatCession } from '../models/etatCession.model';

@Injectable()
export class EtatCessionService {
  private apiUrl = `${config.api}`;
  private countrySpecificUrl = '/sn/v1';
  private etatCessions = '';
  private requestUrl = this.apiUrl + this.countrySpecificUrl;

  constructor(private http: HttpClient) { }

  getEtatCessions(): Observable<EtatCession[]> {
    return this.http
      .get<EtatCession[]>(`${this.requestUrl}/${this.etatCessions}`)
      .pipe(
        map(response => response.map(ec => new EtatCession(ec))),
        catchError(this.handleError)
      );
  }

  getEtatCession(etatCession: EtatCession): Observable<EtatCession> {
    return this.http
      .get<EtatCession>(`${this.requestUrl}/${this.etatCessions}/${etatCession.id}`)
      .pipe(
        map(response => new EtatCession(response)),
        catchError(this.handleError)
      );
  }

  updateEtatCession(etatCession: EtatCession): Observable<EtatCession> {
    return this.http
      .put<EtatCession>(`${this.requestUrl}/${this.etatCessions}/${etatCession.id}`, etatCession)
      .pipe(
        map(response => new EtatCession(response)),
        catchError(this.handleError)
      );
  }
  createEtatCession(etatCession: EtatCession): Observable<EtatCession> {
    return this.http
      .post<EtatCession>(`${this.requestUrl}/${this.etatCessions}`, etatCession)
      .pipe(
        map(response => new EtatCession(response)),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }

}
