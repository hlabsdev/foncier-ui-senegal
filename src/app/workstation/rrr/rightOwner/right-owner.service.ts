import { Injectable } from '@angular/core';
import { environment as config } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResults } from '@app/core/models/paginatedResults.model';
import Utils from '@app/core/utils/utils';
import { catchError, map } from 'rxjs/operators';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { FoncierApiHttpErrorResponse } from '@app/core/models/foncierApiHttpErrorResponse.model';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { AlertService } from '@app/core/layout/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class RightOwnerService {
  private endpointUrl = `${config.api}`;
  private countrySpecificUrl = '/sn/v1/ba-units';
  private requestUrl = this.endpointUrl + this.countrySpecificUrl;

  constructor(private http: HttpClient, private alertService: AlertService) { }

  getRarties(args: any = {}): Observable<PaginatedResults> {
    let params = new HttpParams();
    if (args.registered) {
      params = params.set('isRegistered', String(args.registered));
      if (args.withoutActiveTransactions) {
        params = params.set('withoutActiveTransactions', String(args.withoutActiveTransactions));
      }
    }
    if (args.search) {
      const value = String(args.search);
      if (value.indexOf('/') > -1) {
        const values: string[] = value.split('/');
        params = params.set('titleId', values[0]);
        params = params.set('registryCode', values[1].toUpperCase());
      } else {
        params = params.set('titleId', args.search);
        params = params.set('registryCode', args.search.toUpperCase());
      }
    }

    params = Utils.setParamsFromArgs(params, args);

    return this.http.get<PaginatedResults>(this.requestUrl, { params: params })
      .pipe(map(response => {
          response.content = response.content.map(baUnit => new BAUnit(baUnit));
          return new PaginatedResults(response);
        }),
        catchError(this.handleError));
  }

  private handleError(error: FoncierApiHttpErrorResponse) {
    console.error('An error occurred', error);
    this.alertService.apiError(error);
    return observableThrowError(error);
  }

}
