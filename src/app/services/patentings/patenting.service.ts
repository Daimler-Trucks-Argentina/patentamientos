import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { PatentingCreateUpdateDto } from 'src/app/models/patentings/patenting-create-update.dto';
import { Patenting } from 'src/app/models/patentings/patenting.model';
import { BaseService } from '../base.service';
import { QueryParamsPatentings } from './patentings.model';

@Injectable()
export class PatentingService extends BaseService<Patenting> {
  TAG = PatentingService.name;
  private readonly controller = 'Patentings';
  private entitiesBehaviorSubject: BehaviorSubject<Patenting[]>;
  public entitiesObservable: Observable<Patenting[]>;
  private entityBehaviorSubject: BehaviorSubject<Patenting | null>;
  public entityObservable: Observable<Patenting | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Patentings');
    this.entitiesBehaviorSubject = new BehaviorSubject<Patenting[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Patenting | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Patenting[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Patenting[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Patenting | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Patenting | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Patenting[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Patenting>>(url).pipe(
      map((response) => {
        let entities: Patenting[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    patentingCreateDto: PatentingCreateUpdateDto
  ): Observable<Patenting | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Patenting>>(
      url,
      patentingCreateDto
    ).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(
    patentingUpdateDto: PatentingCreateUpdateDto
  ): Observable<Patenting | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Patenting>>(
      url,
      patentingUpdateDto
    ).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public softDelete(id: string, callback?: any) {
    const url: string = `${this.controller}/soft-delete?id=${id}`;
    return this.HttpClient.delete(url).pipe(
      map((response) => {
        if (callback) {
          callback(response);
        }
      })
    );
  }

  public getByFileId(fileId: string): Observable<any[]> {
    const url: string = `${this.controller}/patenting-by-fileId?fileId=${fileId}`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        let entities: any[] = [];
        if (response.statusCode === 200) {
          console.log('Response', response);
          entities = response.result;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getAllPatentings(): Observable<any[]> {
    const url: string = `${this.controller}/get-all-patentings`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        let entities: any[] = [];
        if (response.statusCode === 200) {
          console.log('Response', response);
          entities = response.result;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getPatentingsFiltered(
    dateFrom: string | null,
    dateTo: string,
    lastDischarge: boolean,
    errorType: string | null,
    fileId: string | null
  ): Observable<any[]> {
    const url: string = `${this.controller}/get-patentings-filtered?dateFrom=${dateFrom}&dateTo=${dateTo}&lastDischarge=${lastDischarge}&errorType=${errorType}&fileId=${fileId}`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        let entities: any[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getPatentingsByFilter(
    dateFrom: string | null,
    dateTo: string,
    lastDischarge: boolean,
    errorType: string | null,
    fileId: string | null,
    pageNumber: number | undefined,
    pageSize: number | undefined
  ): Observable<any> {
    // Construcción de la URL con query params
    const url: string = `${this.controller}/patentings-filtered?dateFrom=${dateFrom ?? ''}&dateTo=${dateTo}&lastDischarge=${lastDischarge}&errorType=${errorType ?? ''}&fileId=${fileId ?? ''}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.HttpClient.get(url)
  }
  
  

  public getLastFilePatenting(): Observable<any[]> {
    const url: string = `${this.controller}/get-last-patenting`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        let entities: any[] = [];
        if (response.statusCode === 200) {
          console.log('Response', response);
          entities = response.result;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getRulesByPatentingId(patentingId: string): Observable<any[]> {
    const url: string = `${this.controller}/rules-by-patentingId?patentingId=${patentingId}`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        let entities: any[] = [];
        if (response.statusCode === 200) {
          console.log('Response RULES', response);
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getDataByPatentingId(patentingId: string): Observable<any[]> {
    const url: string = `${this.controller}/patenting-by-id?patentingId=${patentingId}`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        let entities: any[] = [];
        if (response.statusCode === 200) {
          console.log('Response', response);
          entities = response.result;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public savePatenting(patentingData: any): Observable<any | null> {
    const url: string = `${this.controller}/save-patenting`;
    return this.HttpClient.post<BaseResponse<any>>(url, patentingData).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public fixErrorOfmm(ofmm: string): Observable<any | null> {
    const url: string = `${this.controller}/fix-error-ofmm?ofmm=${ofmm}`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }
}
