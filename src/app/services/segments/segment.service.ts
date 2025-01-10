import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { SegmentCreateDto } from 'src/app/models/segments/segment-create.dto';
import { Segment } from 'src/app/models/segments/segment.model';
import { BaseService } from '../base.service';

@Injectable()
export class SegmentService extends BaseService<Segment> {
  TAG = SegmentService.name;
  private readonly controller = 'Segments';
  private entitiesBehaviorSubject: BehaviorSubject<Segment[]>;
  public entitiesObservable: Observable<Segment[]>;
  private entityBehaviorSubject: BehaviorSubject<Segment | null>;
  public entityObservable: Observable<Segment | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Segments');
    this.entitiesBehaviorSubject = new BehaviorSubject<Segment[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Segment | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Segment[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Segment[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Segment | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Segment | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Segment[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Segment>>(url).pipe(
      map((response) => {
        let entities: Segment[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    segmentCreateDto: SegmentCreateDto
  ): Observable<Segment | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Segment>>(
      url,
      segmentCreateDto
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
    segmentUpdateDto: SegmentCreateDto
  ): Observable<Segment | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Segment>>(
      url,
      segmentUpdateDto
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
