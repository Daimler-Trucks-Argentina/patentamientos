import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Bodywork } from 'src/app/models/bodyworks/bodywork.model';
import { BaseService } from '../base.service';

@Injectable()
export class BodyworkService extends BaseService<Bodywork> {
  TAG = BodyworkService.name;
  private readonly controller = 'Bodyworks';
  private entitiesBehaviorSubject: BehaviorSubject<Bodywork[]>;
  public entitiesObservable: Observable<Bodywork[]>;
  private entityBehaviorSubject: BehaviorSubject<Bodywork | null>;
  public entityObservable: Observable<Bodywork | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Bodyworks');
    this.entitiesBehaviorSubject = new BehaviorSubject<Bodywork[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Bodywork | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Bodywork[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Bodywork[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Bodywork | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Bodywork | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Bodywork[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Bodywork>>(url).pipe(
      map((response) => {
        let entities: Bodywork[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
