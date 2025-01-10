import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Usage } from 'src/app/models/usages/usage.model';
import { BaseService } from '../base.service';

@Injectable()
export class UsageService extends BaseService<Usage> {
  TAG = UsageService.name;
  private readonly controller = 'Usages';
  private entitiesBehaviorSubject: BehaviorSubject<Usage[]>;
  public entitiesObservable: Observable<Usage[]>;
  private entityBehaviorSubject: BehaviorSubject<Usage | null>;
  public entityObservable: Observable<Usage | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Usages');
    this.entitiesBehaviorSubject = new BehaviorSubject<Usage[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Usage | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Usage[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Usage[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Usage | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Usage | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Usage[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Usage>>(url).pipe(
      map((response) => {
        let entities: Usage[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
