import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Profileinformation } from '../models/profile';
import { doctors } from '../models/doctors';
// import { Admin } from '../models/admin';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogin = false;
  roleAs: any;

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user') || '{}')
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/api/user/login`, { email, password })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          // location.reload();
          return user;
        })
      );
  }

  adminlogin(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/api/admin/login`, { email, password })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          // location.reload();
          return user;
        })
      );
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/api/user/register`, user);
  }

  adminregister(user: User) {
    return this.http.post(`${environment.apiUrl}/api/admin/register`, user);
  }

  profilereg(profile: Profileinformation, userToken: any) {
    const body = {
      userToken: userToken,
      profile,
    };
    console.log(body);
    return this.http.put(`${environment.apiUrl}/api/profile/save`, body);
  }

  profilereg_admin(profile: Profileinformation) {
    return this.http.post(`${environment.apiUrl}/api/profile/save`, profile);
  }

  adddoctor(doc: doctors, userToken: any) {
    const body = {
      userToken: userToken,
      doc,
    };
    return this.http.post(`${environment.apiUrl}/api/doctor/save`, body);
  }

  getUserDetails(userToken: any) {
    const body = {
      userToken: userToken,
    };
    var URL = `${environment.apiUrl}/api/user/oneuser`;
    return this.http.post<any>(URL, body).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getalldoc(userToken: any) {
    const body = {
      userToken: userToken,
    };
    var URL = `${environment.apiUrl}/api/doctor/getalldoctor`;
    return this.http.post<any>(URL, body).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
