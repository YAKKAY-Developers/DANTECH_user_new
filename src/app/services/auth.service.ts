import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    console.log("Im in register service")
    return this.http.post(`${environment.apiUrl}/api/user/register`, user);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  adminregister(user: User) {
    return this.http.post(`${environment.apiUrl}/api/admin/register`, user);
  }

  loggedIn() {
    return !!localStorage.getItem('user');
  }


  validateResetToken(resetToken: string) {
    console.log("Hello from validate reset token auth service");
    return this.http.post(`${environment.apiUrl}/api/resetpassword`, { resetToken });
  
  }

  

  forgotPassword(email: string): Observable<any> {

      let body = {
      
        "email": email
      };
    
      return this.http.post(`${environment.apiUrl}/api/user/forgotpassword`, body)
        .pipe(map((res: any) => {
          console.log("test", res);
          return res;
        }));
    }



    


    resetPassword(resetToken: string, password: string, confirmPassword: string) {
      return this.http.post(`${environment.apiUrl}/api/user/resetpassword`, { resetToken, password, confirmPassword });
    }
    



}
