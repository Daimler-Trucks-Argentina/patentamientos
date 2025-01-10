import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
// import { Order } from 'src/app/models/query.dto';
// import { RoleCreateDto } from 'src/app/models/roles/role-create.dto';
import { Role } from 'src/app/models/roles/role';
import { BaseService } from '../base.service';
import { RoleCreateDto } from 'src/app/models/roles/role-create.dto';

@Injectable()
export class RoleService extends BaseService<Role> {
  TAG = RoleService.name;
  private readonly controller = 'Roles';
  private entitiesBehaviorSubject: BehaviorSubject<Role[]>;
  public entitiesObservable: Observable<Role[]>;
  private entityBehaviorSubject: BehaviorSubject<Role | null>;
  public entityObservable: Observable<Role | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Roles');
    this.entitiesBehaviorSubject = new BehaviorSubject<Role[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Role | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Role[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Role[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Role | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Role | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  /************************* BEGIN: OVERRIDDEN BASE METHODS **************************/

  /**
   * Overridden base method
   */
  public override getAll(): Observable<Role[]> {
    return super.getAll((entities: Role[]) => {
      this.setEntities(entities);
    });
  }

  /**
   * Overridden base method
   */
  public override getById(id: string): Observable<Role | null> {
    return super.getById(id, (entity: Role | null) => {
      this.setEntity(entity);
    });
  }

  /**
   * Overridden base method
   */
  public override add(entity: Role) {
    return super.add(entity, (response: number | null) => {
      this.entities.push(entity);
      this.setEntities(this.entities);
    });
  }

  /**
   * Overridden base method
   */
  public override edit(id: string, entity: Role) {
    return super.edit(id, entity, (response: number | null) => {
      const index = this.entities.findIndex((e) => e.id == id);
      if (index >= 0) {
        this.entities[index] = entity;
        this.setEntities(this.entities);
      }
    });
  }

  /**
   * Overridden base method
   */
  public override delete(id: string) {
    return super.delete(id, (response: number | null) => {
      const index = this.entities.findIndex((e) => e.id == id);
      if (index >= 0) {
        this.entities.splice(index, 1);
        this.setEntities(this.entities);
      }
    });
  }

  /************************* END: OVERRIDDEN BASE METHODS **************************/

  // public getAllOrderBy(order?: Order): Observable<Role[]> {
  //   let url: string = `${this.controller}/all2`;
  //   url = BaseService.toQueryParams(order, url);
  //   return this.HttpClient.get<BaseResponse<Role>>(url).pipe(
  //     map((response) => {
  //       if (response.statusCode !== 200) {
  //         return [];
  //       }
  //       return response.results;
  //     })
  //   );
  // }

  public getAll3(): Observable<Role[]> {
    const url: string = `${this.controller}/all3`;
    return this.HttpClient.get<BaseResponse<Role>>(url).pipe(
      map((response) => {
        let entities: Role[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }


  public updatePermissions(role: Role): Observable<boolean | null> {
    const url: string = `${this.controller}/update-permissions`;
    return this.HttpClient.put<BaseResponse<boolean>>(url, role).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public create(
    roleCreateDto: RoleCreateDto
  ): Observable<Role | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Role>>(
      url,
      roleCreateDto
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
    groupCreateDto: RoleCreateDto
  ): Observable<Role | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Role>>(
      url,
      groupCreateDto
    ).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

}
