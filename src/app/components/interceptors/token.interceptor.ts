import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('shared') || request.url.includes('login')) {
      return next.handle(request);
    }
    const jwt = localStorage.getItem("jwt");
    const modifiedRequest = request.clone({

      headers: request.headers
        .set('Authorization', jwt ? 'Bearer ' + jwt : '')

    });
    return next.handle(modifiedRequest);
  }
}
