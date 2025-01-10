import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { OwnerCreateUpdateDto } from 'src/app/models/owners/owner-create-update.dto';
import { Owner } from 'src/app/models/owners/owner.model';
import { BaseService } from '../base.service';

@Injectable()
export class OwnerService extends BaseService<Owner> {
  TAG = OwnerService.name;
  private readonly controller = 'Owners';
  private entitiesBehaviorSubject: BehaviorSubject<Owner[]>;
  public entitiesObservable: Observable<Owner[]>;
  private entityBehaviorSubject: BehaviorSubject<Owner | null>;
  public entityObservable: Observable<Owner | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Owners');
    this.entitiesBehaviorSubject = new BehaviorSubject<Owner[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Owner | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Owner[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Owner[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Owner | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Owner | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Owner[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Owner>>(url).pipe(
      map((response) => {
        let entities: Owner[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    ownerCreateDto: OwnerCreateUpdateDto
  ): Observable<Owner | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Owner>>(url, ownerCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(
    ownerUpdateDto: OwnerCreateUpdateDto
  ): Observable<Owner | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Owner>>(url, ownerUpdateDto).pipe(
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
