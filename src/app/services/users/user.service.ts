import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { BaseResponse } from 'src/app/models/base-response.model';
// import { Filter, QueryDto } from 'src/app/models/query.dto';
import { User } from 'src/app/models/users/user.model';
import { UserCreateDto } from 'src/app/models/users/user-create.dto';
// import { ChangePasswordDto } from 'src/app/models/users/change-password.dto';
// import { ResetPwdDto } from 'src/app/models/users/reset-pwd.dto';
// import { PbiParameters } from 'src/app/models/pbi-report/pbi-report.model';


@Injectable()
export class UserService extends BaseService<User> {
  TAG = UserService.name;
  private readonly controller = 'Users';
  private entitiesBehaviorSubject: BehaviorSubject<User[]>;
  public entitiesObservable: Observable<User[]>;
  private entityBehaviorSubject: BehaviorSubject<User | null>;
  public entityObservable: Observable<User | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Users');
    User;
    this.entitiesBehaviorSubject = new BehaviorSubject<User[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<User | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): User[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: User[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): User | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: User | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  /************************* BEGIN: OVERRIDDEN BASE METHODS **************************/

  /**
   * Overridden base method
   */
  public override getAll(): Observable<User[]> {
    const url: string = `${this.controller}/all`;
    return this.HttpClient.get<BaseResponse<User>>(url).pipe(
      map((response) => {
        let entities: User[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  /**
   * Overridden base method
   */
  public override getById(id: string): Observable<User | null> {
    const url: string = `${this.controller}/by-id?id=${id}`;
    return this.HttpClient.get<BaseResponse<User>>(url).pipe(
      map((response) => {
        let entity: User | null = null;
        if (response.statusCode === 200) {
          entity = response.result;
        }
        this.setEntity(entity);
        return entity;
      })
    );
  }

  /**
   * Overridden base method
   */
//   public override add(entity: User) {
//     return super.add(entity, (response: number | null) => {
//       this.entities.push(entity);
//       this.setEntities(this.entities);
//     });
//   }

  /**
   * Overridden base method
   */
//   public override edit(id: string, entity: User) {
//     return super.edit(id, entity, (response: number | null) => {
//       const index = this.entities.findIndex((e) => e.id == id);
//       if (index >= 0) {
//         this.entities[index] = entity;
//         this.setEntities(this.entities);
//       }
//     });
//   }

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

//   public count2(filters: Filter[]): Observable<number | null> {
//     const url: string = `${this.controller}/page/count`;
//     return this.HttpClient.post<BaseResponse<number>>(url, filters).pipe(
//       map((response) => {
//         if (response.statusCode !== 200) {
//           return null;
//         }
//         return response.result;
//       })
//     );
//   }

//   public paginate(queryDto: QueryDto<User>): Observable<QueryDto<User> | null> {
//     const url: string = `${this.controller}/page/paginate`;
//     return this.HttpClient.post<BaseResponse<QueryDto<User>>>(
//       url,
//       queryDto
//     ).pipe(
//       map((response) => {
//         if (response.statusCode !== 200) {
//           return null;
//         }
//         return response.result;
//       })
//     );
//   }

  public getAllDummy(): Observable<User[]> {
    // return super.getAll((response) => {
    //   this.setEntities(response);
    // });
    const url = `/assets/dummy/user-list.dummy.json`;
    return this.HttpClient.get<BaseResponse<User>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return [];
        }
        return response.results;
      })
    );
  }

  public getByIdDummy(id: string | null): Observable<User | null> {
    // return super.getAll((response) => {
    //   this.setEntities(response);
    // });
    const url = `/assets/dummy/user.dummy.json`;
    return this.HttpClient.get<BaseResponse<User>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public create(userCreateDto: UserCreateDto): Observable<User | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<User>>(url, userCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public createOrUpdate(userCreateDto: UserCreateDto): Observable<User | null> {
    const url: string = `${this.controller}/create-or-update`;
    return this.HttpClient.put<BaseResponse<User>>(url, userCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(userCreateDto: UserCreateDto): Observable<User | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<User>>(url, userCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

//   public changePwd(
//     changePasswordDto: ChangePasswordDto
//   ): Observable<User | null> {
//     const url: string = `${this.controller}/change-pwd`;
//     return this.HttpClient.put<BaseResponse<User>>(url, changePasswordDto).pipe(
//       map((response) => {
//         if (response.statusCode !== 200) {
//           return null;
//         }
//         return response.result;
//       })
//     );
//   }

//   public resetPwd(resetPwdDto: ResetPwdDto): Observable<User | null> {
//     const url: string = `${this.controller}/reset-pwd`;
//     return this.HttpClient.put<BaseResponse<User>>(url, resetPwdDto).pipe(
//       map((response) => {
//         if (response.statusCode !== 200) {
//           return null;
//         }
//         return response.result;
//       })
//     );
//   }

//   public GetToken(parameters: PbiParameters) {
//     const url = 'https://apiportalreport.azurewebsites.net/api/' + 'PBI/GetToken';
//     return this.HttpClient.post(url, parameters).pipe(
//       map((response: any) => {
//         return JSON.parse(response);
//       })
//     );
//   }
}
