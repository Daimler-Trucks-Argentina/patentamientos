/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InterceptedError } from 'src/app/models/errors/intercepted-error';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class MainErrorHttpInterceptor implements HttpInterceptor {
  TAG = MainErrorHttpInterceptor.name;
  constructor(
    private _router: Router,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        console.log(`${this.TAG} > intercept > error`, error);
        if (error.status === 400) {
          // Bad Request
          console.log(`${this.TAG} > intercept > Bad Request`, error);
          this.badRequest();
        }
        if (error.status === 401) {
          // Unauthorized
          console.log(`${this.TAG} > intercept > Unauthorized`, error);
          this.unauthorized();
        }
        if (error.status === 403) {
          // Forbidden
          console.log(`${this.TAG} > intercept > Forbidden`, error);
          this.forbidden();
        }
        if (error.status === 404) {
          // Not found
          console.log(`${this.TAG} > intercept > Not found`, error);
          this.notFound();
        }
        if (error.status === 500) {
          // Internal server error
          console.log(
            'ErrorInterceptor > intercept > Internal server error',
            error
          );
          this.internalServerError();
        }
        const errorDetail = this.getErrorDetail(error);
        return throwError(error);
      })
    );
  }

  private badRequest(): Observable<any> {
    // this._router.navigate(['pages/errors/400']);
    return EMPTY;
  }

  private unauthorized(): Observable<any> {
    this.matDialog.closeAll();
    this.authService.signOut();
    return EMPTY;
  }

  private forbidden(): Observable<any> {
    this._router.navigate(['pages/errors/403']);
    return EMPTY;
  }

  private notFound(): Observable<any> {
    this._router.navigate(['pages/errors/404']);
    return EMPTY;
  }

  private internalServerError(): Observable<any> {
    // this._router.navigate(['pages/errors/500']);
    return EMPTY;
  }

  // TODO Implementar formateador de errores según la respuesta de la API
  private getErrorDetail(response: any): InterceptedError {
    let message = 'No se pudo obtener el detalle del error.';
    let closeAllDialogs = true;
    try {
      if (
        response.status === 400 &&
        typeof response.message === 'string' &&
        response.error
      ) {
        message = response.error;
        closeAllDialogs = false;
      }
      if (
        response.status === 400 &&
        typeof response.error === 'string' &&
        response.error
      ) {
        message = response.error;
        closeAllDialogs = false;
      }
      if (
        response.status === 500 &&
        typeof response.error === 'object' &&
        (response.error.ExceptionMessage || response.error.Message)
      ) {
        message = response.error.ExceptionMessage
          ? response.error.ExceptionMessage
          : response.error.Message;
        // closeAllDialogs = false;
      }
      if (response._body) {
        const body = JSON.parse(response._body);
        if (body && body.Message) {
          message = body.Message;
        }
      }
    } catch (e) {}
    if (closeAllDialogs) {
      // this._matDialog.closeAll();
    }
    return {
      status: response && response.status ? response.status : null,
      statusText: response && response.statusText ? response.statusText : null,
      message,
    };
  }
}
