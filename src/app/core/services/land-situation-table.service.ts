import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as config } from '../../../environments/environment';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { PaginatedResults } from '@app/core/models/paginatedResults.model';
import { catchError, map } from 'rxjs/operators';
import { LandSituationTable } from '@app/core/models/landSituationTable.model';

@Injectable({
    providedIn: 'root'
})
export class LandSituationTableService {

    private apiUrl = `${config.api}`;
    private countrySpecificUrl = '/sn/v1';
    private requestUrl = this.apiUrl + this.countrySpecificUrl;
    private response = [];

    constructor(private http: HttpClient) {
    }

    getLandSituationTable(args: any = {}): Observable<PaginatedResults> {
        return this.http.get<PaginatedResults>(`${this.requestUrl}/landSituationTable`)
            .pipe(map(response => {
                    response.content = response.content.map(app => new LandSituationTable(app));
                    return new PaginatedResults(response);
                }),
                catchError(this.handleError)
            );

    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return observableThrowError(error);
    }
}
