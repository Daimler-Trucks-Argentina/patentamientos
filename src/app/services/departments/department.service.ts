import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Department } from 'src/app/models/departments/department.model';
import { BaseService } from '../base.service';

@Injectable()
export class DepartmentService extends BaseService<Department> {
  TAG = DepartmentService.name;
  private readonly controller = 'Departments';
  private entitiesBehaviorSubject: BehaviorSubject<Department[]>;
  public entitiesObservable: Observable<Department[]>;
  private entityBehaviorSubject: BehaviorSubject<Department | null>;
  public entityObservable: Observable<Department | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Departments');
    this.entitiesBehaviorSubject = new BehaviorSubject<Department[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Department | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Department[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Department[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Department | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Department | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Department[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Department>>(url).pipe(
      map((response) => {
        let entities: Department[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
