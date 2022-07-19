import { Injectable } from '@angular/core';
import { environment as config } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RRRValidation } from '@app/admin/rrr-validation/model/rrr-validation.model';

@Injectable()
export class RRRValidationService {
  private endpointUrl = `${config.api}/v1/rrr-validations`;

  constructor(private http: HttpClient) { }

  /**
   * get all rrr validations
   * @param args
   */
  getRRRValidations(args: any = {}): Observable<RRRValidation[]> {
    const params = new HttpParams();

    if (args.search) {
      params.set('search', args.search);
    }

    return this.http
      .get<RRRValidation[]>(`${this.endpointUrl}`, { params: params })
      .pipe(
        map((response: RRRValidation[]) => response.map(rrrValidation => new RRRValidation(rrrValidation))),
        catchError(this.handleError)
      );
  }

  /**
   * get rrr validation by id
   * @param Id
   */
  getRRRValidationById(id: string): Observable<RRRValidation> {
    return this.http
      .get<RRRValidation>(`${this.endpointUrl}/${id}`)
      .pipe(
        map(response => new RRRValidation(response)),
        catchError(this.handleError)
      );
  }

  /**
   * get rrr validation by id
   * @param rrrValidation
   */
  getRRRValidation(rrrValidation: RRRValidation): Observable<RRRValidation> {
    return this.http
      .get<RRRValidation>(`${this.endpointUrl}/${rrrValidation.id}`)
      .pipe(
        map(response => new RRRValidation(response)),
        catchError(this.handleError)
      );
  }

  /**
   * create rrr validation
   * @param rrrValidation
   */
  createRRRValidation(rrrValidation: RRRValidation): Observable<RRRValidation> {
    return this.http
      .post<RRRValidation>(`${this.endpointUrl}`, rrrValidation)
      .pipe(
        map(response => new RRRValidation(response)),
        catchError(this.handleError)
      );
  }

  /**
   * update rrr validation
   * @param rrrValidation
   */
  updateRRRValidation(rrrValidation: RRRValidation): Observable<RRRValidation> {
    return this.http
      .put<RRRValidation>(`${this.endpointUrl}/${rrrValidation.id}`, rrrValidation)
      .pipe(
        map(response => new RRRValidation(response)),
        catchError(this.handleError)
      );
  }

  /**
   * delete rrr validation
   * @param rrrValidation
   */
  deleteRRRValidation(rrrValidation: RRRValidation): any {
    return this.http
      .delete(`${this.endpointUrl}/${rrrValidation.id}`)
      .pipe(
        map((response: any) => {
          return response;
        }), catchError(this.handleError));
  }

  /**
   * handle errors
   * @param error
   */
  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }

}
