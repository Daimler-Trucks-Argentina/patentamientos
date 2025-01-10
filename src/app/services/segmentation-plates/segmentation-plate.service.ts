import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { SegmentationPlate } from 'src/app/models/segmentation-plates/segmentation-plate.model';
import { BaseService } from '../base.service';

@Injectable()
export class SegmentationPlateService extends BaseService<SegmentationPlate> {
  TAG = SegmentationPlateService.name;
  private readonly controller = 'SegmentationPlates';
  private entitiesBehaviorSubject: BehaviorSubject<SegmentationPlate[]>;
  public entitiesObservable: Observable<SegmentationPlate[]>;
  private entityBehaviorSubject: BehaviorSubject<SegmentationPlate | null>;
  public entityObservable: Observable<SegmentationPlate | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'SegmentationPlates');
    this.entitiesBehaviorSubject = new BehaviorSubject<SegmentationPlate[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<SegmentationPlate | null>(
      null
    );
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): SegmentationPlate[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: SegmentationPlate[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): SegmentationPlate | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: SegmentationPlate | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  // public override getAll(): Observable<SegmentationPlate[]> {
  //   const url: string = `${this.controller}/all2`;
  //   return this.HttpClient.get<BaseResponse<SegmentationPlate>>(url).pipe(
  //     map((response) => {
  //       let entities: SegmentationPlate[] = [];
  //       if (response.statusCode === 200) {
  //         entities = response.results;
  //       }
  //       this.setEntities(entities);
  //       return entities;
  //     })
  //   );
  // }

  public getByCategory(category: string): Observable<SegmentationPlate[]> {
    const url: string = `${this.controller}/get-by-category?category=${category}`;
    return this.HttpClient.get<BaseResponse<SegmentationPlate>>(url).pipe(
      map((response) => {
        let entities: SegmentationPlate[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getByFileId(fileId: string): Observable<SegmentationPlate[]> {
    const url: string = `${this.controller}/get-by-fileId?fileId=${fileId}`;
    return this.HttpClient.get<BaseResponse<SegmentationPlate>>(url).pipe(
      map((response) => {
        let entities: SegmentationPlate[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public processSegmentations(
    dateFrom: string,
    dateTo: string
  ): Observable<any | null> {
    const url: string = `${this.controller}/process-segmentations?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    return this.HttpClient.post<BaseResponse<any>>(url, {
      dateFrom,
      dateTo,
    }).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }
}
