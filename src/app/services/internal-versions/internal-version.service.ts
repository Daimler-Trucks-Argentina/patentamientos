import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { InternalVersionCreateDto } from 'src/app/models/internal-versions/internal-version-create.dto';
import { InternalVersion } from 'src/app/models/internal-versions/internal-version.model';
import { BaseService } from '../base.service';

@Injectable()
export class InternalVersionService extends BaseService<InternalVersion> {
  TAG = InternalVersionService.name;
  private readonly controller = 'InternalVersions';
  private entitiesBehaviorSubject: BehaviorSubject<InternalVersion[]>;
  public entitiesObservable: Observable<InternalVersion[]>;
  private entityBehaviorSubject: BehaviorSubject<InternalVersion | null>;
  public entityObservable: Observable<InternalVersion | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'InternalVersions');
    this.entitiesBehaviorSubject = new BehaviorSubject<InternalVersion[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<InternalVersion | null>(
      null
    );
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): InternalVersion[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: InternalVersion[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): InternalVersion | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: InternalVersion | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<InternalVersion[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<InternalVersion>>(url).pipe(
      map((response) => {
        let entities: InternalVersion[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getLastId(): Observable<number | null> {
    const url: string = `${this.controller}/get-last-id`;
    return this.HttpClient.get<BaseResponse<number>>(url).pipe(
      map((response) => {
        if (response.statusCode === 200) {
          return response.result;
        }
        return null;
      })
    );
  }

  public create(
    internalVersionCreateDto: InternalVersionCreateDto
  ): Observable<InternalVersion | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<InternalVersion>>(
      url,
      internalVersionCreateDto
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
    internalVersionUpdateDto: InternalVersionCreateDto
  ): Observable<InternalVersion | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<InternalVersion>>(
      url,
      internalVersionUpdateDto
    ).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public deleteCache(id: string, callback?: any) {
    const url: string = `${this.controller}/delete-cache/${id}`;
    return this.HttpClient.delete(url).pipe(
      map((response) => {
        if (callback) {
          callback(response);
        }
      })
    );
  }
}
