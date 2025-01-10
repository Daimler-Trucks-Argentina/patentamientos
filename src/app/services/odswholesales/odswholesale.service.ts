import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { OdsWholesale } from 'src/app/models/wholesales/ods-wholesale.model';
import { BaseService } from '../base.service';
import { OdsWholesaleCreateDto } from 'src/app/models/wholesales/ods-wholesale-create.dto';

@Injectable()
export class OdsWholesaleService extends BaseService<OdsWholesale> {
  TAG = OdsWholesaleService.name;
  private readonly controller = 'OdsWholesales';
  private entitiesBehaviorSubject: BehaviorSubject<OdsWholesale[]>;
  public entitiesObservable: Observable<OdsWholesale[]>;
  private entityBehaviorSubject: BehaviorSubject<OdsWholesale | null>;
  public entityObservable: Observable<OdsWholesale | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'OdsWholesales');
    this.entitiesBehaviorSubject = new BehaviorSubject<OdsWholesale[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<OdsWholesale | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): OdsWholesale[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: OdsWholesale[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): OdsWholesale | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: OdsWholesale | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<OdsWholesale[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<OdsWholesale>>(url).pipe(
      map((response) => {
        let entities: OdsWholesale[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public getByFileId(fileId: string): Observable<OdsWholesale[]> {
    const url: string = `${this.controller}/get-by-file-id?fileId=${fileId}`;
    return this.HttpClient.get<BaseResponse<OdsWholesale>>(url).pipe(
      map((response) => {
        let entities: OdsWholesale[] = [];
        if (response.statusCode === 200) {
          console.log('Response', response);
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public saveWholesale(odsWholesaleCreateDto: OdsWholesaleCreateDto): Observable<OdsWholesale | null> {
    const url: string = `${this.controller}/save-wholesale`;
    return this.HttpClient.post<BaseResponse<OdsWholesale>>(url, odsWholesaleCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  // public create(
  //   OdsWholesaleCreateDto: OdsWholesaleCreateDto
  // ): Observable<OdsWholesale | null> {
  //   const url: string = `${this.controller}/create`;
  //   return this.HttpClient.post<BaseResponse<OdsWholesale>>(
  //     url,
  //     OdsWholesaleCreateDto
  //   ).pipe(
  //     map((response) => {
  //       if (response.statusCode !== 200) {
  //         return null;
  //       }
  //       return response.result;
  //     })
  //   );
  // }

  // public update(
  //   OdsWholesaleUpdateDto: OdsWholesaleCreateDto
  // ): Observable<OdsWholesale | null> {
  //   const url: string = `${this.controller}/update`;
  //   return this.HttpClient.put<BaseResponse<OdsWholesale>>(
  //     url,
  //     OdsWholesaleUpdateDto
  //   ).pipe(
  //     map((response) => {
  //       if (response.statusCode !== 200) {
  //         return null;
  //       }
  //       return response.result;
  //     })
  //   );
  // }

  // public deleteCache(id: string, callback?: any) {
  //   const url: string = `${this.controller}/delete-cache/${id}`;
  //   return this.HttpClient.delete(url).pipe(
  //     map((response) => {
  //       if (callback) {
  //         callback(response);
  //       }
  //     })
  //   );
  // }
}
