import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { CarModelCreateUpdateDto } from 'src/app/models/car-models/car-model-create-update.dto';
import { CarModel } from 'src/app/models/car-models/car-model.model';
import { BaseService } from '../base.service';

@Injectable()
export class CarModelService extends BaseService<CarModel> {
  TAG = CarModelService.name;
  private readonly controller = 'CarModels';
  private entitiesBehaviorSubject: BehaviorSubject<CarModel[]>;
  public entitiesObservable: Observable<CarModel[]>;
  private entityBehaviorSubject: BehaviorSubject<CarModel | null>;
  public entityObservable: Observable<CarModel | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'CarModels');
    this.entitiesBehaviorSubject = new BehaviorSubject<CarModel[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<CarModel | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): CarModel[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: CarModel[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): CarModel | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: CarModel | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<CarModel[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<CarModel>>(url).pipe(
      map((response) => {
        let entities: CarModel[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getNoAssigned(): Observable<CarModel> {
    const url: string = `${this.controller}/get-no-assigned`;
    return this.HttpClient.get<BaseResponse<CarModel>>(url).pipe(
      map((response) => {
        let entity: CarModel = new CarModel();
        if (response.statusCode === 200) {
          entity = response.result!;
        }
        this.setEntity(entity);
        return entity;
      })
    );
  }

  public create(
    carModelCreateDto: CarModelCreateUpdateDto
  ): Observable<CarModel | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<CarModel>>(
      url,
      carModelCreateDto
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
    carModelUpdateDto: CarModelCreateUpdateDto
  ): Observable<CarModel | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<CarModel>>(
      url,
      carModelUpdateDto
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
