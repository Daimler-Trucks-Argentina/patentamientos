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
export class AutoLoginCanActivate implements CanActivate {
  TAG = 'AutoLoginCanActivate';
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.userObservable.pipe(
      // filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((user) => {
        console.log(`${this.TAG} > canActivate > user`, user);
        console.log('Found previous token, automatic login');
        if (route.queryParams['m'] == 'reset-pwd') {
          this.authService.signOut(false);
          return true;
        }
        if (user && user.token) {
          this.router.navigate(['/pages/main/file-list'], {
            replaceUrl: true,
          });
          return false;
        } else {
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}
