import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as config } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Fusion } from '../models/fusion.model';

@Injectable()
export class FusionService {
  private apiUrl = `${config.api}`;
  private countrySpecificUrl = '/sn/v1';
  private fusion = '';
  private requestUrl = this.apiUrl + this.countrySpecificUrl;

  constructor(private http: HttpClient) { }

  getFusions(): Observable<Fusion[]> {
    return this.http
      .get<Fusion[]>(`${this.requestUrl}/${this.fusion}`)
      .pipe(
        map(response => response.map(ec => new Fusion(ec))),
        catchError(this.handleError)
      );
  }

  getFusion(fusion: Fusion): Observable<Fusion> {
    return this.http
      .get<Fusion>(`${this.requestUrl}/${this.fusion}/${fusion.id}`)
      .pipe(
        map(response => new Fusion(response)),
        catchError(this.handleError)
      );
  }

  updateFusion(fusion: Fusion): Observable<Fusion> {
    return this.http
      .put<Fusion>(`${this.requestUrl}/${this.fusion}/${fusion.id}`, fusion)
      .pipe(
        map(response => new Fusion(response)),
        catchError(this.handleError)
      );
  }
  createFusion(fusion: Fusion): Observable<Fusion> {
    return this.http
      .post<Fusion>(`${this.requestUrl}/${this.fusion}`, fusion)
      .pipe(
        map(response => new Fusion(response)),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }

}
