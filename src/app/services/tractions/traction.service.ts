import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Traction } from 'src/app/models/tractions/traction.model';
import { BaseService } from '../base.service';

@Injectable()
export class TractionService extends BaseService<Traction> {
  TAG = TractionService.name;
  private readonly controller = 'Tractions';
  private entitiesBehaviorSubject: BehaviorSubject<Traction[]>;
  public entitiesObservable: Observable<Traction[]>;
  private entityBehaviorSubject: BehaviorSubject<Traction | null>;
  public entityObservable: Observable<Traction | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Tractions');
    this.entitiesBehaviorSubject = new BehaviorSubject<Traction[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Traction | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Traction[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Traction[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Traction | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Traction | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Traction[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Traction>>(url).pipe(
      map((response) => {
        let entities: Traction[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
