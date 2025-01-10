import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Location } from 'src/app/models/locations/location.model';
import { BaseService } from '../base.service';

@Injectable()
export class LocationService extends BaseService<Location> {
  TAG = LocationService.name;
  private readonly controller = 'Locations';
  private entitiesBehaviorSubject: BehaviorSubject<Location[]>;
  public entitiesObservable: Observable<Location[]>;
  private entityBehaviorSubject: BehaviorSubject<Location | null>;
  public entityObservable: Observable<Location | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Locations');
    this.entitiesBehaviorSubject = new BehaviorSubject<Location[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Location | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Location[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Location[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Location | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Location | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Location[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Location>>(url).pipe(
      map((response) => {
        let entities: Location[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
