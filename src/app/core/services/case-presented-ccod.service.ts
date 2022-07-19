import { environment as config } from 'environments/environment';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application } from '@app/core/models/application.model';
import { PaginatedResults } from '@app/core/models/paginatedResults.model';
import { ApplicationStatus } from '@app/core/models/applicationStatus.model';
import Utils from '@app/core/utils/utils';
import { CasePresentedCcod } from '../models/case-presented-ccod.model';

@Injectable({
  providedIn: 'root'
})
export class CasePresentedCcodService {

  private apiUrl = `${config.api}`;
  private countrySpecificUrl = '/sn/v1';
  private requestUrl = this.apiUrl + this.countrySpecificUrl;

  constructor(private http: HttpClient) {

  }

  getCasePresentedCcodList(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();

    params = Utils.setParamsFromArgs(params, args);

    return this.http.get<PaginatedResults>(`${this.requestUrl}/casepresentedccod`, { params })
      .pipe(map(response => {
        response.content = response.content.map(app => new CasePresentedCcod(app));
        return new PaginatedResults(response);
      }),
        catchError(this.handleError));
  }

  createCasePresentedCcod(casePresentedCcod: CasePresentedCcod): Observable<CasePresentedCcod> {
    return this.http
      .post<CasePresentedCcod>(`${this.requestUrl}/casepresentedccod`, casePresentedCcod)
      .pipe(
        map(response => new CasePresentedCcod(response)),
        catchError(this.handleError)
      );
  }

  updateCasePresentedCcod(casePresentedCcod: CasePresentedCcod): Observable<CasePresentedCcod> {
    return this.http
      .put<CasePresentedCcod>(`${this.requestUrl}/casepresentedccod/${casePresentedCcod.id}`, casePresentedCcod)
      .pipe(
        map(response => new CasePresentedCcod(response)),
        catchError(this.handleError)
      );
  }

  getCasePresentedCcod(id: string): Observable<CasePresentedCcod> {
    return this.http
      .get<CasePresentedCcod>(`${this.requestUrl}/casepresentedccod/${id}`)
      .pipe(
        map(response => new CasePresentedCcod(response)),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }
}
