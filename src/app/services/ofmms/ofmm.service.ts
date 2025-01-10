import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { OfmmCreateUpdateDto } from 'src/app/models/ofmms/ofmm-create-update.dto';
import { Ofmm } from 'src/app/models/ofmms/ofmm.model';
import { BaseService } from '../base.service';

@Injectable()
export class OfmmService extends BaseService<Ofmm> {
  TAG = OfmmService.name;
  private readonly controller = 'Ofmms';
  private entitiesBehaviorSubject: BehaviorSubject<Ofmm[]>;
  public entitiesObservable: Observable<Ofmm[]>;
  private entityBehaviorSubject: BehaviorSubject<Ofmm | null>;
  public entityObservable: Observable<Ofmm | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Ofmms');
    this.entitiesBehaviorSubject = new BehaviorSubject<Ofmm[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Ofmm | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Ofmm[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Ofmm[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Ofmm | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Ofmm | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Ofmm[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Ofmm>>(url).pipe(
      map((response) => {
        let entities: Ofmm[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(ofmmCreateDto: OfmmCreateUpdateDto): Observable<Ofmm | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Ofmm>>(url, ofmmCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public createMultipleOfmms(
    ofmmCreateDtos: OfmmCreateUpdateDto[]
  ): Observable<Ofmm[] | null> {
    const url: string = `${this.controller}/create-multiple-ofmms`;
    return this.HttpClient.post<BaseResponse<Ofmm[]>>(url, ofmmCreateDtos).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(ofmmUpdateDto: OfmmCreateUpdateDto): Observable<Ofmm | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Ofmm>>(url, ofmmUpdateDto).pipe(
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
