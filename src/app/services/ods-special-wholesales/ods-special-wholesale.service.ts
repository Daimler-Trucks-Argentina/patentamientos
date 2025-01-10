import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { OdsSpecialWholesale } from 'src/app/models/special-wholesales/ods-special-wholesale.model';
import { BaseService } from '../base.service';

@Injectable()
export class OdsSpecialWholesaleService extends BaseService<OdsSpecialWholesale> {
  TAG = OdsSpecialWholesaleService.name;
  private readonly controller = 'OdsOwnerClassifications';
  private entitiesBehaviorSubject: BehaviorSubject<OdsSpecialWholesale[]>;
  public entitiesObservable: Observable<OdsSpecialWholesale[]>;
  private entityBehaviorSubject: BehaviorSubject<OdsSpecialWholesale | null>;
  public entityObservable: Observable<OdsSpecialWholesale | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'OdsOwnerClassifications');
    this.entitiesBehaviorSubject = new BehaviorSubject<OdsSpecialWholesale[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<OdsSpecialWholesale | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): OdsSpecialWholesale[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: OdsSpecialWholesale[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): OdsSpecialWholesale | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: OdsSpecialWholesale | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<OdsSpecialWholesale[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<OdsSpecialWholesale>>(url).pipe(
      map((response) => {
        let entities: OdsSpecialWholesale[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getByFileId(fileId: string): Observable<OdsSpecialWholesale[]> {
    const url: string = `${this.controller}/get-by-file-id?fileId=${fileId}`;
    return this.HttpClient.get<BaseResponse<OdsSpecialWholesale>>(url).pipe(
      map((response) => {
        let entities: OdsSpecialWholesale[] = [];
        if (response.statusCode === 200) {
          console.log('Response', response);
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
