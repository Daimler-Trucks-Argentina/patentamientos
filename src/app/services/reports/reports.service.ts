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

  public getComercialReport(
    dateFrom?: string | null,
    dateTo?: string | null,
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    anioPeriodoCierre?: number | null,
    mesPeriodoCierre?: number | null,
    plate?: string | null,
    chasis?: string | null,
    ofmm?: string | null,
    cuitTitular?: string | null,
  ): Observable<any> {
    const url: string = `${
      this.controller
    }/commercial?FechaPatentamientoDesde=${dateFrom ?? ''}
    &FechaPatentamientoHasta=${dateTo ?? ''}
    &PageNumber=${pageNumber}
    &PageSize=${pageSize}
    &AñoPeriodoCierre=${anioPeriodoCierre  ?? ''}
    &MesPeriodoCierre=${mesPeriodoCierre  ?? ''}
    &Plate=${plate  ?? ''}
    &Chasis=${chasis ?? ''}
    &Ofmm=${ofmm ?? ''}
    &CuitTitular=${cuitTitular ?? ''}`;
    return this.HttpClient.get(url);
  }
  public getParkReport(
    pageNumber: number | undefined,
    pageSize: number | undefined,
    year: number | undefined,
    month: number | undefined
  ): Observable<any> {
    const url: string = `${
      this.controller
    }/VehicleFleet?
    PageSize=${pageSize}
    &PageNumber=${pageNumber}
    &year=${year}
    &month=${month}`;
    return this.HttpClient.get(url);
  }
  public getDailyReport(
    pageNumber: number | null,
    pageSize: number | undefined,
    patentingDate: string,
  ): Observable<any> {
    const url: string = `${
    this.controller
    }/daily?PageSize=${pageSize}&PageNumber=${pageNumber}&FechaPatentamiento=${patentingDate}`;
    return this.HttpClient.get(url);
  }
}
