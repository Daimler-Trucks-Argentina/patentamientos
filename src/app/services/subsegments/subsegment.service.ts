import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Subsegment } from 'src/app/models/subsegments/subsegment.model';
import { BaseService } from '../base.service';

@Injectable()
export class SubsegmentService extends BaseService<Subsegment> {
  TAG = SubsegmentService.name;
  private readonly controller = 'Subsegments';
  private entitiesBehaviorSubject: BehaviorSubject<Subsegment[]>;
  public entitiesObservable: Observable<Subsegment[]>;
  private entityBehaviorSubject: BehaviorSubject<Subsegment | null>;
  public entityObservable: Observable<Subsegment | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Subsegments');
    this.entitiesBehaviorSubject = new BehaviorSubject<Subsegment[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Subsegment | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Subsegment[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Subsegment[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Subsegment | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Subsegment | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Subsegment[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Subsegment>>(url).pipe(
      map((response) => {
        let entities: Subsegment[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
