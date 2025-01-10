import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BaseResponse } from '../models/base-response.model';
import { Base } from '../models/base.model';

export class BaseService<T extends Base> {
  public readonly HttpClient: HttpClient;
  private readonly Controller: string;

  constructor(private _httpClient: HttpClient, controller: string) {
    this.HttpClient = _httpClient;
    this.Controller = controller;
  }

  public getAll(callback?: any): Observable<T[]> {
    const url: string = `${this.Controller}/all`;
    return this.HttpClient.get<BaseResponse<T>>(url).pipe(
      map((response) => {
        let entities: T[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        if (callback) {
          callback(entities);
        }
        return entities;
      })
    );
  }

  public getById(id: string, callback?: any): Observable<T | null> {
    const url: string = `${this.Controller}/id/${id}`;
    return this.HttpClient.get<BaseResponse<T>>(url).pipe(
      map((response) => {
        let entity: T | null = null;
        if (response.statusCode === 200) {
          entity = response.result;
        }
        if (callback) {
          callback(entity);
        }
        return entity;
      })
    );
  }

  public delete(id: string, callback?: any): Observable<number | null> {
    const url: string = `${this.Controller}/delete/${id}`;
    return this.HttpClient.delete<BaseResponse<number>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        if (callback) {
          callback(response);
        }
        return response.result;
      })
    );
  }

  public edit(
    id: string,
    entity: T,
    callback?: any
  ): Observable<number | null> {
    const url: string = `${this.Controller}/edit/${id}`;
    return this.HttpClient.put<BaseResponse<number>>(url, entity).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        if (callback) {
          callback(response);
        }
        return response.result;
      })
    );
  }

  public add(entity: T, callback?: any): Observable<number | null> {
    const url: string = `${this.Controller}/add`;
    return this.HttpClient.post<BaseResponse<number>>(url, entity).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        if (callback) {
          callback(response);
        }
        return response.result;
      })
    );
  }
}
