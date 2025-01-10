import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { VehicleTypeCreateUpdateDto } from 'src/app/models/vehicle-types/vehicle-type-create-update.dto';
import { VehicleType } from 'src/app/models/vehicle-types/vehicle-type.model';
import { BaseService } from '../base.service';

@Injectable()
export class VehicleTypeService extends BaseService<VehicleType> {
  TAG = VehicleTypeService.name;
  private readonly controller = 'VehicleTypes';
  private entitiesBehaviorSubject: BehaviorSubject<VehicleType[]>;
  public entitiesObservable: Observable<VehicleType[]>;
  private entityBehaviorSubject: BehaviorSubject<VehicleType | null>;
  public entityObservable: Observable<VehicleType | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'VehicleTypes');
    this.entitiesBehaviorSubject = new BehaviorSubject<VehicleType[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<VehicleType | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): VehicleType[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: VehicleType[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): VehicleType | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: VehicleType | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<VehicleType[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<VehicleType>>(url).pipe(
      map((response) => {
        let entities: VehicleType[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    vehicleTypeCreateDto: VehicleTypeCreateUpdateDto
  ): Observable<VehicleType | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<VehicleType>>(
      url,
      vehicleTypeCreateDto
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
    vehicleTypeUpdateDto: VehicleTypeCreateUpdateDto
  ): Observable<VehicleType | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<VehicleType>>(
      url,
      vehicleTypeUpdateDto
    ).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public softDelete(id: string, callback?: any) {
    const url: string = `${this.controller}/soft-delete?id=${id}`;
    return this.HttpClient.delete(url).pipe(
      map((response) => {
        if (callback) {
          callback(response);
        }
      })
    );
  }
}
