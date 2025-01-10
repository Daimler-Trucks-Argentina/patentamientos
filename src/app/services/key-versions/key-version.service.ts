import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { KeyVersionCreateDto } from 'src/app/models/key-versions/key-version-create.dto';
import { KeyVersion } from 'src/app/models/key-versions/key-version.model';
import { BaseService } from '../base.service';

@Injectable()
export class KeyVersionService extends BaseService<KeyVersion> {
  TAG = KeyVersionService.name;
  private readonly controller = 'KeyVersions';
  private entitiesBehaviorSubject: BehaviorSubject<KeyVersion[]>;
  public entitiesObservable: Observable<KeyVersion[]>;
  private entityBehaviorSubject: BehaviorSubject<KeyVersion | null>;
  public entityObservable: Observable<KeyVersion | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'KeyVersions');
    this.entitiesBehaviorSubject = new BehaviorSubject<KeyVersion[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<KeyVersion | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): KeyVersion[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: KeyVersion[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): KeyVersion | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: KeyVersion | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<KeyVersion[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<KeyVersion>>(url).pipe(
      map((response) => {
        let entities: KeyVersion[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    keyVersionCreateDto: KeyVersionCreateDto
  ): Observable<KeyVersion | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<KeyVersion>>(
      url,
      keyVersionCreateDto
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
    keyVersionUpdateDto: KeyVersionCreateDto
  ): Observable<KeyVersion | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<KeyVersion>>(
      url,
      keyVersionUpdateDto
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
