import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { BaseService } from '../base.service';
import { PatentingVersion } from 'src/app/models/patenting-versions/patenting-version.model';
import { PatentingVersionCreateDto } from 'src/app/models/patenting-versions/patenting-version-create.dto';

@Injectable()
export class PatentingVersionService extends BaseService<PatentingVersion> {
  TAG = PatentingVersionService.name;
  private readonly controller = 'PatentingVersions';
  private entitiesBehaviorSubject: BehaviorSubject<PatentingVersion[]>;
  public entitiesObservable: Observable<PatentingVersion[]>;
  private entityBehaviorSubject: BehaviorSubject<PatentingVersion | null>;
  public entityObservable: Observable<PatentingVersion | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'PatentingVersions');
    this.entitiesBehaviorSubject = new BehaviorSubject<PatentingVersion[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<PatentingVersion | null>(
      null
    );
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): PatentingVersion[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: PatentingVersion[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): PatentingVersion | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: PatentingVersion | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<PatentingVersion[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<PatentingVersion>>(url).pipe(
      map((response) => {
        let entities: PatentingVersion[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
          console.log("🚀 ~ PatentingVersionService ~ map ~ response.results:", response.results)
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
    patentingVersionCreateDto: PatentingVersionCreateDto
  ): Observable<PatentingVersion | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<PatentingVersion>>(
      url,
      patentingVersionCreateDto
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
    patentingVersionUpdateDto: PatentingVersionCreateDto
  ): Observable<PatentingVersion | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<PatentingVersion>>(
      url,
      patentingVersionUpdateDto
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
