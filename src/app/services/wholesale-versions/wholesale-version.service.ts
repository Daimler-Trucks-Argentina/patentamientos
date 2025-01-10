import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model'; 
import { BaseService } from '../base.service'; 
import { WholesaleVersion } from 'src/app/models/wholesale-versions/wholesale-version.model';
import { WholesaleVersionCreateDto } from 'src/app/models/wholesale-versions/wholesale-version-create.dto';

@Injectable()
export class WholesaleVersionService extends BaseService<WholesaleVersion> {
  TAG = WholesaleVersionService.name;
  private readonly controller = 'WholesaleVersions';
  private entitiesBehaviorSubject: BehaviorSubject<WholesaleVersion[]>;
  public entitiesObservable: Observable<WholesaleVersion[]>;
  private entityBehaviorSubject: BehaviorSubject<WholesaleVersion | null>;
  public entityObservable: Observable<WholesaleVersion | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'WholesaleVersions');
    this.entitiesBehaviorSubject = new BehaviorSubject<WholesaleVersion[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<WholesaleVersion | null>(
      null
    );
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): WholesaleVersion[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: WholesaleVersion[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): WholesaleVersion | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: WholesaleVersion | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<WholesaleVersion[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<WholesaleVersion>>(url).pipe(
      map((response) => {
        let entities: WholesaleVersion[] = [];
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
    wholesaleVersionCreateDto: WholesaleVersionCreateDto
  ): Observable<WholesaleVersion | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<WholesaleVersion>>(
      url,
      wholesaleVersionCreateDto
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
    wholesaleVersionUpdateDto: WholesaleVersionCreateDto
  ): Observable<WholesaleVersion | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<WholesaleVersion>>(
      url,
      wholesaleVersionUpdateDto
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
