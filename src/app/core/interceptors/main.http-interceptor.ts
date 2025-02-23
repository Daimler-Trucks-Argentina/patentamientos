/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class MainHttpInterceptor implements HttpInterceptor {
  TAG = MainHttpInterceptor.name;
  constructor(private _authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const noIntercept =
      request.url.startsWith('http://') ||
      request.url.startsWith('https://') ||
      request.url.startsWith('assets/') ||
      request.url.indexOf('/assets/') >= 0;
    if (noIntercept) {
      return next.handle(request);
    }
    const token = this._authService.token ?? null;

    if (token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        url: environment.api.main + request.url,
      });
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
        url: environment.api.main + request.url,
      });
    }
    return next.handle(request);
  }
}
