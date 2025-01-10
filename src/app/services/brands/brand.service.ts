import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { BrandCreateUpdateDto } from 'src/app/models/brands/brand-create-update.dto';
import { Brand } from 'src/app/models/brands/brand.model';
import { BaseService } from '../base.service';

@Injectable()
export class BrandService extends BaseService<Brand> {
  TAG = BrandService.name;
  private readonly controller = 'Brands';
  private entitiesBehaviorSubject: BehaviorSubject<Brand[]>;
  public entitiesObservable: Observable<Brand[]>;
  private entityBehaviorSubject: BehaviorSubject<Brand | null>;
  public entityObservable: Observable<Brand | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Brands');
    this.entitiesBehaviorSubject = new BehaviorSubject<Brand[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Brand | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Brand[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Brand[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Brand | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Brand | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Brand[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Brand>>(url).pipe(
      map((response) => {
        let entities: Brand[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    brandCreateDto: BrandCreateUpdateDto
  ): Observable<Brand | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Brand>>(url, brandCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(
    brandUpdateDto: BrandCreateUpdateDto
  ): Observable<Brand | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Brand>>(url, brandUpdateDto).pipe(
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
