import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Power } from 'src/app/models/powers/power.model';
import { BaseService } from '../base.service';

@Injectable()
export class PowerService extends BaseService<Power> {
  TAG = PowerService.name;
  private readonly controller = 'Powers';
  private entitiesBehaviorSubject: BehaviorSubject<Power[]>;
  public entitiesObservable: Observable<Power[]>;
  private entityBehaviorSubject: BehaviorSubject<Power | null>;
  public entityObservable: Observable<Power | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Powers');
    this.entitiesBehaviorSubject = new BehaviorSubject<Power[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Power | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Power[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Power[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Power | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Power | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Power[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Power>>(url).pipe(
      map((response) => {
        let entities: Power[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
