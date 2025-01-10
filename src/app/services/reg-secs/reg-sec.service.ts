import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { RegSec } from 'src/app/models/reg-secs/reg-sec.model';
import { BaseService } from '../base.service';
import { RegSecCreateUpdateDto } from 'src/app/models/reg-secs/reg-sec-create-update.dto';

@Injectable()
export class RegSecService extends BaseService<RegSec> {
  TAG = RegSecService.name;
  private readonly controller = 'RegSecs';
  private entitiesBehaviorSubject: BehaviorSubject<RegSec[]>;
  public entitiesObservable: Observable<RegSec[]>;
  private entityBehaviorSubject: BehaviorSubject<RegSec | null>;
  public entityObservable: Observable<RegSec | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'RegSecs');
    this.entitiesBehaviorSubject = new BehaviorSubject<RegSec[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<RegSec | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): RegSec[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: RegSec[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): RegSec | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: RegSec | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<RegSec[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<RegSec>>(url).pipe(
      map((response) => {
        let entities: RegSec[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    regSecCreateDto: RegSecCreateUpdateDto
  ): Observable<RegSec | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<RegSec>>(
      url,
      regSecCreateDto
    ).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public uploadFile(form: {
    base64: string | ArrayBuffer | null;
    fileName: string;
  }): Observable<RegSec | null> {
    const url: string = `${this.controller}/upload-file`;
    return this.HttpClient.post<BaseResponse<RegSec>>(url, form).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(
    regSecUpdateDto: RegSecCreateUpdateDto
  ): Observable<RegSec | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<RegSec>>(url, regSecUpdateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }
}
