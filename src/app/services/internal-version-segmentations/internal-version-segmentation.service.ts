import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { InternalVersionSegmentationCreateDto } from 'src/app/models/internal-version-segmentations/internal-version-segmentation-create.dto';
import { InternalVersionSegmentation } from 'src/app/models/internal-version-segmentations/internal-version-segmentation.model';
import { BaseService } from '../base.service';
import { InternalVersionSegmentationCatalogs } from 'src/app/models/internal-version-segmentations/internal-version-segmentation-catalogs.model';

@Injectable()
export class InternalVersionSegmentationService extends BaseService<InternalVersionSegmentation> {
  TAG = InternalVersionSegmentationService.name;
  private readonly controller = 'InternalVersionSegmentations';
  private entitiesBehaviorSubject: BehaviorSubject<InternalVersionSegmentation[]>;
  public entitiesObservable: Observable<InternalVersionSegmentation[]>;
  private entityBehaviorSubject: BehaviorSubject<InternalVersionSegmentation | null>;
  public entityObservable: Observable<InternalVersionSegmentation | null>;
  private entityCatalogBehaviorSubject: BehaviorSubject<InternalVersionSegmentationCatalogs | null>;
  public entityCatalogObservable: Observable<InternalVersionSegmentationCatalogs | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'InternalVersionSegmentations');
    this.entitiesBehaviorSubject = new BehaviorSubject<InternalVersionSegmentation[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<InternalVersionSegmentation | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
    this.entityCatalogBehaviorSubject = new BehaviorSubject<InternalVersionSegmentationCatalogs | null>(null);
    this.entityCatalogObservable = this.entityCatalogBehaviorSubject.asObservable();
  }

  public get entities(): InternalVersionSegmentation[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: InternalVersionSegmentation[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): InternalVersionSegmentation | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: InternalVersionSegmentation | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public get entityCatalog(): InternalVersionSegmentationCatalogs | null {
    return this.entityCatalogBehaviorSubject.value;
  }

  public setEntityCatalogs(entity: InternalVersionSegmentationCatalogs | null): void {
    this.entityCatalogBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<InternalVersionSegmentation[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<InternalVersionSegmentation>>(url).pipe(
      map((response) => {
        let entities: InternalVersionSegmentation[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getCatalogs(): Observable<InternalVersionSegmentationCatalogs | null> {
    const url: string = `${this.controller}/get-catalogs`;
    return this.HttpClient.get<BaseResponse<InternalVersionSegmentationCatalogs>>(url).pipe(
      map((response) => {        
        let entity: InternalVersionSegmentationCatalogs | null = null
        if (response.statusCode === 200) {
          entity = response.result;
        }
        this.setEntityCatalogs(entity);
        return entity;
      })
    );
  }

  public create(
    internalVersionSegmentationCreateDto: InternalVersionSegmentationCreateDto
  ): Observable<InternalVersionSegmentation | null> {
    const url: string = `${this.controller}/create2`;
    return this.HttpClient.post<BaseResponse<InternalVersionSegmentation>>(
      url,
      internalVersionSegmentationCreateDto
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
    internalVersionSegmentationUpdateDto: InternalVersionSegmentationCreateDto
  ): Observable<InternalVersionSegmentation | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<InternalVersionSegmentation>>(
      url,
      internalVersionSegmentationUpdateDto
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
