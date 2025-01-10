import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { BodyStyle } from 'src/app/models/body-styles/body-style.model';
import { BaseService } from '../base.service';

@Injectable()
export class BodyStyleService extends BaseService<BodyStyle> {
  TAG = BodyStyleService.name;
  private readonly controller = 'BodyStyles';
  private entitiesBehaviorSubject: BehaviorSubject<BodyStyle[]>;
  public entitiesObservable: Observable<BodyStyle[]>;
  private entityBehaviorSubject: BehaviorSubject<BodyStyle | null>;
  public entityObservable: Observable<BodyStyle | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'BodyStyles');
    this.entitiesBehaviorSubject = new BehaviorSubject<BodyStyle[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<BodyStyle | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): BodyStyle[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: BodyStyle[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): BodyStyle | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: BodyStyle | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<BodyStyle[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<BodyStyle>>(url).pipe(
      map((response) => {
        let entities: BodyStyle[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
