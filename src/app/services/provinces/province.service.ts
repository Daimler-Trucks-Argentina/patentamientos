import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Province } from 'src/app/models/provinces/province.model';
import { BaseService } from '../base.service';

@Injectable()
export class ProvinceService extends BaseService<Province> {
  TAG = ProvinceService.name;
  private readonly controller = 'Provinces';
  private entitiesBehaviorSubject: BehaviorSubject<Province[]>;
  public entitiesObservable: Observable<Province[]>;
  private entityBehaviorSubject: BehaviorSubject<Province | null>;
  public entityObservable: Observable<Province | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Provinces');
    this.entitiesBehaviorSubject = new BehaviorSubject<Province[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Province | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Province[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Province[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Province | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Province | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Province[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Province>>(url).pipe(
      map((response) => {
        let entities: Province[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
