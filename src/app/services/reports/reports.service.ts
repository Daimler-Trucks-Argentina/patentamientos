import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PbiParameters } from 'src/app/models/pbi-parameters/pbi-parameters.model';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable()
export class ReportService extends BaseService<any> {
  TAG = ReportService.name;
  private readonly controller = 'report';

  constructor(httpClient: HttpClient) {
    super(httpClient, 'report');
  }

  public GetToken(parameters: PbiParameters) {
    const url = environment.api.reportUrl + 'PBI/GetToken';
    return this.HttpClient.post(url, parameters).pipe(
      map((response: any) => {
        return JSON.parse(response);
      })
    );
  }

  public getReport(
    dateFrom: string | null,
    dateTo: string,
    pageNumber: number | undefined,
    pageSize: number | undefined
  ): Observable<any> {
    const url: string = `${
      this.controller
    }/commercial?FechaPatentamientoDesde=${
      dateFrom ?? ''
    }&FechaPatentamientoHasta=${
      dateTo ?? ''
    }&PageSize=${pageSize}&PageNumber=${pageNumber}`;
    return this.HttpClient.get(url);
  }
}
