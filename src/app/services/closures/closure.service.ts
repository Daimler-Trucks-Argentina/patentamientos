import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Closure } from 'src/app/models/closures/closure.model';
import { BaseService } from '../base.service';
import { ClosureCreateDto } from 'src/app/models/closures/closure-create.dto';

@Injectable()
export class ClosureService extends BaseService<Closure> {
  TAG = ClosureService.name;
  private readonly controller = 'Closures';
  private entitiesBehaviorSubject: BehaviorSubject<Closure[]>;
  public entitiesObservable: Observable<Closure[]>;
  private entityBehaviorSubject: BehaviorSubject<Closure | null>;
  public entityObservable: Observable<Closure | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Closures');
    this.entitiesBehaviorSubject = new BehaviorSubject<Closure[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Closure | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Closure[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Closure[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Closure | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Closure | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Closure[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Closure>>(url).pipe(
      map((response) => {
        let entities: Closure[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    closureCreateDto: ClosureCreateDto
  ): Observable<Closure | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Closure>>(url, closureCreateDto).pipe(
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
