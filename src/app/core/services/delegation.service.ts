import { environment as config } from 'environments/environment';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResults } from '@app/core/models/paginatedResults.model';
import Utils from '@app/core/utils/utils';
import { Delegation } from '../models/delegation.model';

@Injectable({
  providedIn: 'root'
})
export class DelegationService {

  private apiUrl = `${config.api}`;
  private countrySpecificUrl = '/sn/v1';
  private requestUrl = this.apiUrl + this.countrySpecificUrl;

  constructor(private http: HttpClient) {

  }

  getDelegationList(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();

    params = Utils.setParamsFromArgs(params, args);

    return this.http.get<PaginatedResults>(`${this.requestUrl}/delegation`, { params })
      .pipe(map(response => {
        response.content = response.content.map(app => new Delegation(app));
        return new PaginatedResults(response);
      }),
        catchError(this.handleError));
  }

  createDelegation(delegation: Delegation): Observable<Delegation> {
    return this.http
      .post<Delegation>(`${this.requestUrl}/delegation`, delegation)
      .pipe(
        map(response => new Delegation(response)),
        catchError(this.handleError)
      );
  }

  updateDelegation(delegation: Delegation): Observable<Delegation> {
    return this.http
      .put<Delegation>(`${this.requestUrl}/delegation/${delegation.id}`, delegation)
      .pipe(
        map(response => new Delegation(response)),
        catchError(this.handleError)
      );
  }

  getDelegation(id: string): Observable<Delegation> {
    return this.http
      .get<Delegation>(`${this.requestUrl}/delegation/${id}`)
      .pipe(
        map(response => new Delegation(response)),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }
}
