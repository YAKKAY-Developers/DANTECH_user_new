// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class ErrorInterceptor implements HttpInterceptor {

//   constructor(private auth: AuthService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log("Inside interceptor")
//     return next.handle(request).pipe(catchError(err => {
//         if ([401, 403].includes(err.status) && this.auth.userValue) {
//             // auto logout if 401 or 403 response returned from api
//             this.auth.logout();
//         }

//         const error = err.error?.message || err.statusText;
//         console.error(err);
//         return throwError(() => error);
//     }))
// }
// }

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Inside interceptor");
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if ([401, 403].includes(error.status) && this.auth.userValue) {
          // auto logout if 401 or 403 response returned from api
          this.auth.logout();
        }

        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.error && error.error.message) {
          // Server-side error with message
          errorMessage = error.error.message;
        } else if (error.statusText) {
          // Other server-side errors
          errorMessage = `Error: ${error.statusText}`;
        }

        console.error(error);
        return throwError(error);
      })
    );
  }
}

