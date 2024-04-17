import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenDecoderService {

  constructor() { }

  public isAdmin() {
    const token = localStorage.getItem('jwt');
    if (token) {
      return JSON.parse(window.atob(token.split('.')[1])).role == 'ADMIN'
      && JSON.parse(window.atob(token.split('.')[1])).exp > Date.now() / 1000;
    }
    return false;
  }
}
