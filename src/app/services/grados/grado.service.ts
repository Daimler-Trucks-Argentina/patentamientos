import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { GradoCreateDto } from 'src/app/models/grados/grado-create.dto';
import { Grado } from 'src/app/models/grados/grado.model';
import { BaseService } from '../base.service';

@Injectable()
export class GradoService extends BaseService<Grado> {
  TAG = GradoService.name;
  private readonly controller = 'Grados';
  private entitiesBehaviorSubject: BehaviorSubject<Grado[]>;
  public entitiesObservable: Observable<Grado[]>;
  private entityBehaviorSubject: BehaviorSubject<Grado | null>;
  public entityObservable: Observable<Grado | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Grados');
    this.entitiesBehaviorSubject = new BehaviorSubject<Grado[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Grado | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Grado[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Grado[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Grado | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Grado | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Grado[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Grado>>(url).pipe(
      map((response) => {
        let entities: Grado[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(gradoCreateDto: GradoCreateDto): Observable<Grado | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Grado>>(url, gradoCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(gradoUpdateDto: GradoCreateDto): Observable<Grado | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Grado>>(url, gradoUpdateDto).pipe(
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
