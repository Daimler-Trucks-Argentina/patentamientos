import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { FactoryCreateUpdateDto } from 'src/app/models/factories/factory-create-update.dto';
import { Factory } from 'src/app/models/factories/factory.model';
import { BaseService } from '../base.service';

@Injectable()
export class FactoryService extends BaseService<Factory> {
  TAG = FactoryService.name;
  private readonly controller = 'Factories';
  private entitiesBehaviorSubject: BehaviorSubject<Factory[]>;
  public entitiesObservable: Observable<Factory[]>;
  private entityBehaviorSubject: BehaviorSubject<Factory | null>;
  public entityObservable: Observable<Factory | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Factories');
    this.entitiesBehaviorSubject = new BehaviorSubject<Factory[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Factory | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Factory[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Factory[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Factory | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Factory | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Factory[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Factory>>(url).pipe(
      map((response) => {
        let entities: Factory[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    factoryCreateDto: FactoryCreateUpdateDto
  ): Observable<Factory | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Factory>>(
      url,
      factoryCreateDto
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
    factoryUpdateDto: FactoryCreateUpdateDto
  ): Observable<Factory | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Factory>>(
      url,
      factoryUpdateDto
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
