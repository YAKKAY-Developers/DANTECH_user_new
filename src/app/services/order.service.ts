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
export class OrderService {
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

  orderreg(form: any, formdata: any, selected_tooth: any) {
    const body = {
      form: form,
      formdata: formdata,
      tooth: selected_tooth,
    };
    console.log(body);
    return this.http.post(`${environment.apiUrl}/api/order/createorder`, body);
  }
}
