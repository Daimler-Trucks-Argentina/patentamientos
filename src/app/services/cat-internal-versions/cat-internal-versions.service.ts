import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model'; 
import { BaseService } from '../base.service'; 
import { CatInternalVersion } from 'src/app/models/cat-internal-versions/cat-internal-versions.model';
import { CatInternalVersionCreateDto } from 'src/app/models/cat-internal-versions/cat-internal-version-create.dto';

@Injectable()
export class CatInternalVersionService extends BaseService<CatInternalVersion> {
  TAG = CatInternalVersionService.name;
  private readonly controller = 'Cat_InternalVersions';
  private entitiesBehaviorSubject: BehaviorSubject<CatInternalVersion[]>;
  public entitiesObservable: Observable<CatInternalVersion[]>;
  private entityBehaviorSubject: BehaviorSubject<CatInternalVersion | null>;
  public entityObservable: Observable<CatInternalVersion | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Cat_InternalVersions');
    this.entitiesBehaviorSubject = new BehaviorSubject<CatInternalVersion[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<CatInternalVersion | null>(
      null
    );
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): CatInternalVersion[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: CatInternalVersion[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): CatInternalVersion | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: CatInternalVersion | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<CatInternalVersion[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<CatInternalVersion>>(url).pipe(
      map((response) => {
        let entities: CatInternalVersion[] = [];
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
    catInternalVersionCreateDto: CatInternalVersionCreateDto
  ): Observable<CatInternalVersion | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<CatInternalVersion>>(
      url,
      catInternalVersionCreateDto
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
    catInternalVersionUpdateDto: CatInternalVersionCreateDto
  ): Observable<CatInternalVersion | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<CatInternalVersion>>(
      url,
      catInternalVersionUpdateDto
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
