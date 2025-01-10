import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { TmmvCreateUpdateDto } from 'src/app/models/tmmvs/tmmv-create-update.dto';
import { Tmmv } from 'src/app/models/tmmvs/tmmv.model';
import { BaseService } from '../base.service';

@Injectable()
export class TmmvService extends BaseService<Tmmv> {
  TAG = TmmvService.name;
  private readonly controller = 'Tmmvs';
  private entitiesBehaviorSubject: BehaviorSubject<Tmmv[]>;
  public entitiesObservable: Observable<Tmmv[]>;
  private entityBehaviorSubject: BehaviorSubject<Tmmv | null>;
  public entityObservable: Observable<Tmmv | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Tmmvs');
    this.entitiesBehaviorSubject = new BehaviorSubject<Tmmv[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Tmmv | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Tmmv[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Tmmv[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Tmmv | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Tmmv | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Tmmv[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Tmmv>>(url).pipe(
      map((response) => {
        let entities: Tmmv[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getVerPats(carModelId: string): Observable<Tmmv[]> {
    const url: string = `${this.controller}/get-ver-pats?carModelId=${carModelId}`;
    return this.HttpClient.get<BaseResponse<Tmmv>>(url).pipe(
      map((response) => {
        let entities: Tmmv[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    tmmvCreateDto: TmmvCreateUpdateDto
  ): Observable<Tmmv | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Tmmv>>(url, tmmvCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(
    tmmvUpdateDto: TmmvCreateUpdateDto
  ): Observable<Tmmv | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Tmmv>>(url, tmmvUpdateDto).pipe(
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
