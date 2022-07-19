import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RRR } from './rrr.model';
import { Injectable } from '@angular/core';
import { environment as config } from 'environments/environment';
import { RRRType, RRRTypeEnum } from './rrrType.model';
import { RightType, RightTypeEnum } from './rightType.model';
import { ResponsibilityType, ResponsibilityTypeEnum } from './responsibilityType.model';
import { RestrictionType, RestrictionTypeEnum } from './restrictionType.model';
import { ModelFactory } from '@app/core/utils/model.factory';

@Injectable()
export class RRRService {
  private endpointUrl = `${config.api}/v1`;
  private rrrEndpointUrl = `${config.api}/sn/v1`;

  constructor(private http: HttpClient) { }

  getRRRTypes(args: any = {}): Observable<RRRType[]> {

    return this.http.get(`${this.endpointUrl}/rrr-types`)
      .pipe(
        map((response: RRRTypeEnum[]) => {
          return response.map(rrrType => new RRRType(rrrType));
        }),
        catchError(this.handleError)
      );
  }

  getRightSubTypes(args: any = {}): Observable<RightType[]> {

    return this.http.get(`${this.endpointUrl}/rrr-types/right-types`)
      .pipe(
        map((response: RightTypeEnum[]) => {
          return response.map(rightType => new RightType(rightType));
        }),
        catchError(this.handleError)
      );
  }

  getRestrictionSubTypes(args: any = {}): Observable<RestrictionType[]> {

    return this.http.get(`${this.endpointUrl}/rrr-types/restriction-types`)
      .pipe(
        map((response: RestrictionTypeEnum[]) => {
          return response.map(restrictionType => new RestrictionType(restrictionType));
        }),
        catchError(this.handleError)
      );
  }

  getResponsibilitySubTypes(args: any = {}): Observable<ResponsibilityType[]> {

    return this.http.get(`${this.endpointUrl}/rrr-types/responsibility-types`)
      .pipe(
        map((response: ResponsibilityTypeEnum[]) => {
          return response.map(responsibilityType => new ResponsibilityType(responsibilityType));
        }),
        catchError(this.handleError)
      );
  }

  getRRR(rrrId: string): Observable<RRR> {

    return this.http
      .get(`${this.rrrEndpointUrl}/rrrs/${rrrId}`)
      .pipe(
        map((response: RRR) => {
          return ModelFactory.manageRRRPolymorphism(response);
        }),
        catchError(this.handleError)
      );

  }

  updateRRR(rrr: RRR): Observable<RRR> {
    return this.http
      .put(`${this.rrrEndpointUrl}/rrrs/${rrr.rid}`, rrr)
      .pipe(
        map((response: RRR) => {
          return ModelFactory.manageRRRPolymorphism(response);
        }),
        catchError(this.handleError)
      );
  }

  createRRR(rrr: RRR): Observable<RRR> {
    return this.http
      .post(`${this.rrrEndpointUrl}/rrrs`, rrr)
      .pipe(
        map((response: RRR) => {
          return ModelFactory.manageRRRPolymorphism(response);
        }),
        catchError(this.handleError)
      );
  }

  getRRRs(args: any = {}): Observable<RRR[]> {
    const params = new HttpParams();

    if (args.search) {
      params.set('search', args.search);
    }

    return this.http.get(`${this.rrrEndpointUrl}/rrrs`, { params: params })
      .pipe(
        map((response: RRR[]) => {
          return response.map(ModelFactory.manageRRRPolymorphism);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return observableThrowError(error);
  }

}
