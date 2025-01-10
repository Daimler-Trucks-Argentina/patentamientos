import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { BaseResponse } from "src/app/models/base-response.model";
// import { Order } from "src/app/models/query.dto";
import { BaseService } from "../base.service";
import { SecurityParameter } from "src/app/models/security-parameters/security-parameter.model";


@Injectable()
export class SecurityParameterService extends BaseService<SecurityParameter> {
    TAG = 'SecurityParameterService';
  private readonly controller = 'SecurityParameter';
  private entitiesBehaviorSubject: BehaviorSubject<SecurityParameter[]>;
  public entitiesObservable: Observable<SecurityParameter[]>;
  private entityBehaviorSubject: BehaviorSubject<SecurityParameter | null>;
  public entityObservable: Observable<SecurityParameter | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'SecurityParameter');
    this.entitiesBehaviorSubject = new BehaviorSubject<SecurityParameter[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<SecurityParameter | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): SecurityParameter[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: SecurityParameter[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): SecurityParameter | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: SecurityParameter | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  /************************* BEGIN: OVERRIDDEN BASE METHODS **************************/

  /**
   * Overridden base method
   */
  public override getAll(): Observable<SecurityParameter[]> {
    return super.getAll((entities: SecurityParameter[]) => {
      this.setEntities(entities);
    });
  }

  /**
   * Overridden base method
   */
  public override getById(id: string): Observable<SecurityParameter | null> {
    return super.getById(id, (entity: SecurityParameter | null) => {
      this.setEntity(entity);
    });
  }

  /**
   * Overridden base method
   */
  public override add(entity: SecurityParameter) {
    return super.add(entity, (response: number | null) => {
      this.entities.push(entity);
      this.setEntities(this.entities);
    });
  }

  /**
   * Overridden base method
   */
  public override edit(id: string, entity: SecurityParameter) {
    return super.edit(id, entity, (response: number | null) => {
      const index = this.entities.findIndex((e) => e.id == id);
      if (index >= 0) {
        this.entities[index] = entity;
        this.setEntities(this.entities);
      }
    });
  }

  /************************* END: OVERRIDDEN BASE METHODS **************************/

  // public getAllOrderBy(order?: Order): Observable<SecurityParameter[]> {
  //   let url: string = `${this.controller}/all2`;
  //   url = BaseService.toQueryParams(order, url);
  //   return this.HttpClient.get<BaseResponse<SecurityParameter>>(url).pipe(
  //     map((response) => {
  //       if (response.statusCode !== 200) {
  //         return [];
  //       }
  //       return response.results;
  //     })
  //   );
  // }

  public getAll2(): Observable<SecurityParameter[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<SecurityParameter>>(url).pipe(
      map((response) => {
        let entities: SecurityParameter[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}