import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<HttpResponse<any>>(environment.serverUrl + 'login', {
      username,
      password
    }, { observe: 'response' })
  }
}
