import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { CategoryCreateDto } from 'src/app/models/categories/category-create.dto';
import { Category } from 'src/app/models/categories/category.model';
import { BaseService } from '../base.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
  TAG = CategoryService.name;
  private readonly controller = 'Categories';
  private entitiesBehaviorSubject: BehaviorSubject<Category[]>;
  public entitiesObservable: Observable<Category[]>;
  private entityBehaviorSubject: BehaviorSubject<Category | null>;
  public entityObservable: Observable<Category | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Categories');
    this.entitiesBehaviorSubject = new BehaviorSubject<Category[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Category | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Category[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Category[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Category | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Category | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Category[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Category>>(url).pipe(
      map((response) => {
        let entities: Category[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    categoryCreateDto: CategoryCreateDto
  ): Observable<Category | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Category>>(
      url,
      categoryCreateDto
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
    categoryUpdateDto: CategoryCreateDto
  ): Observable<Category | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Category>>(
      url,
      categoryUpdateDto
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
