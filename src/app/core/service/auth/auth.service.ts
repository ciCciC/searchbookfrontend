import { Injectable } from '@angular/core';
import {User} from '../../../shared/model/user';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Role} from '../../../shared/model/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userMock: User = {name: 'William', username: 'admin', password: 'admin', role: Role.ADMIN};
  private userSubject: ReplaySubject<User>;
  private loggedIn: boolean;
  private authenticated: boolean;

  constructor() {
    this.userSubject = new ReplaySubject<User>(1);
  }

  getCurrentUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  login(username: string, password: string): Observable<User> {
    if (this.userMock.username === username && this.userMock.password === password) {
      this.authenticated = true;
      this.loggedIn = true;
      this.userSubject.next(this.userMock);
      return this.userSubject.asObservable();
    }
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout() {
    this.authenticated = false;
    this.loggedIn = false;
    this.userSubject.next(null);
  }
}
