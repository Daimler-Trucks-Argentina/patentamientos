/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthCanActivate implements CanActivate {
  TAG = 'AuthCanActivate';

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    console.log(`${this.TAG} > canActivate`);
    return this.authService.userObservable.pipe(
      // filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((user) => {
        console.log(`${this.TAG} > canActivate > user`, user);
        if (!user) {
          this.authService.signOut();
          return false;
        }
        if (user) {
          if (user.token) {
            return true;
          } else {
            this.authService.signOut();
            return false;
          }
        } else {
          this.router.navigate(['/pages/sign-in'], { replaceUrl: true });
          return false;
        }
      })
    );
  }
}
