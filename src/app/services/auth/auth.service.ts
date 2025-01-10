import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from 'src/app/models/base-response.model';
import { SignInDto } from 'src/app/models/sign-in/sign-in.dto';
import { SetPwdDto } from 'src/app/models/users/set-pwd.dto';
import { User } from 'src/app/models/users/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  TAG = 'AuthService';
  controller = 'Users';
  private userBehaviorSubject: BehaviorSubject<User | null>;
  public userObservable: Observable<User | null>;
  public onDrawerOpenedEmitter: EventEmitter<boolean> = new EventEmitter(true);
  public onHeaderEmitter: EventEmitter<boolean> = new EventEmitter(true);

  constructor(private httpClient: HttpClient, private router: Router) {
    const userStr = localStorage.getItem(environment.localStorageItemName);
    const user = userStr ? JSON.parse(userStr) : null;
    this.userBehaviorSubject = new BehaviorSubject<User | null>(user);
    this.userObservable = this.userBehaviorSubject.asObservable();
    const token = user?.token;
  }

  public get user(): User | null {
    const userStr = localStorage.getItem(environment.localStorageItemName);
    const user: User = userStr ? JSON.parse(userStr) : null;
    if (user) {
      user.displayName =
        user && user.name && user.surname
          ? `${user.name} ${user.surname}`
          : '-';
      // if (user.object && user.object.name) {
      //   user.displayName += ` | ${user.object.name}`;
      // }
    }
    return user;
  }

  setUser(user: User | null): void {
    localStorage.setItem(
      environment.localStorageItemName,
      user ? JSON.stringify(user) : ''
    );
    this.userBehaviorSubject.next(user);
  }

  public get token(): string | null {
    const user = this.user;
    const token = user?.token ?? null;
    console.log(`${this.TAG} > getToken > token`, token);
    return token;
  }

  signIn(signInDto: SignInDto): Observable<User | null> {
    const url = `${environment.api.main}Users/sign-in`;
    return this.httpClient.post<BaseResponse<User>>(url, signInDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        const user = response.result;
        this.setUser(user);
        return user;
      })
    );
  }

  refreshToken(): Observable<string | null> {
    const url = `${this.controller}/refresh-token`;
    return this.httpClient.post<BaseResponse<string>>(url, null).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        setTimeout(() => {
          const user = this.user;
          if (user) {
            user.token = response.result;
            this.setUser(user);
          }
        }, 1 * 1000);
        return response.result;
      })
    );
  }

  setPwd(setPwdDto: SetPwdDto): Observable<User | null> {
    const url: string = `${this.controller}/set-pwd`;
    return this.httpClient.post<BaseResponse<User>>(url, setPwdDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        const user = response.result;
        this.setUser(user);
        return user;
      })
    );
  }

  signOut(redirect: boolean = true): void {
    // this.ngxPermissionsService.flushPermissions();
    this.setUser(null);
    localStorage.removeItem(environment.localStorageItemName);
    if (redirect) {
      this.router.navigate([`/pages/sign-in`]);
    }
  }
}
