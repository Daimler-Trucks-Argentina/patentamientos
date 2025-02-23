import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscriber } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Permission } from 'src/app/models/permissions/permission.model';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../base.service';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  TAG = PermissionService.name;
  private readonly controller = 'Permissions';
  private entitiesBehaviorSubject: BehaviorSubject<Permission[]>;
  public entitiesObservable: Observable<Permission[]>;
  private entityBehaviorSubject: BehaviorSubject<Permission | null>;
  public entityObservable: Observable<Permission | null>;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    super(httpClient, 'Permissions');
    this.entitiesBehaviorSubject = new BehaviorSubject<Permission[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Permission | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Permission[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Permission[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Permission | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Permission | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  /************************* BEGIN: OVERRIDDEN BASE METHODS **************************/

  /**
   * Overridden base method
   */
  public override getAll(): Observable<Permission[]> {
    return super.getAll((entities: Permission[]) => {
      this.setEntities(entities);
    });
  }

  /**
   * Overridden base method
   */
  public override getById(id: string): Observable<Permission | null> {
    return super.getById(id, (entity: Permission | null) => {
      this.setEntity(entity);
    });
  }

  /**
   * Overridden base method
   */
  public override add(entity: Permission) {
    return super.add(entity, (response: number | null) => {
      this.entities.push(entity);
      this.setEntities(this.entities);
    });
  }

  /**
   * Overridden base method
   */
  public override edit(id: string, entity: Permission) {
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

  public getByRoleId(roleId: string | null): Observable<Permission[]> {
    let url: string = `${this.controller}/by-rid?roleId=${roleId}`;
    return this.HttpClient.get<BaseResponse<Permission>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return [];
        }
        return response.results;
      })
    );
  }

  public getGranted(
    roleId: string | null
  ): Observable<Permission[] | undefined> {
    const user = this.authService.user;
    if (
      user &&
      user.role &&
      user.role.permissions &&
      user.role.permissions.length > 0
    ) {
      return new Observable(
        (observer: Subscriber<Permission[] | undefined>) => {
          observer.next(user?.role?.permissions);
          observer.complete();
        }
      );
    }
    let url: string = `${this.controller}/granted?roleId=${roleId}`;
    return this.HttpClient.get<BaseResponse<Permission>>(url).pipe(
      map((response) => {
        let results: Permission[] = [];
        if (response.statusCode === 200) {
          results = response.results;
        }
        if (user && user.role) {
          user.role.permissions = results;
          this.authService.setUser(user);
        }
        return results;
      })
    );
  }
}
