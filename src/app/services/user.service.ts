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
export class UserService {
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

  addConsultant(userToken: any, accessToken: any, consultantResult:any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
      "consultantResult":consultantResult
    };
  
    return this.http.post(`${environment.apiUrl}/api/user/addConsultant`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getUserDetails(userToken: any) {
    console.log("I am here")
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

  getOneUserDetails(userToken: any, accessToken: any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
    };
  
    return this.http.post(`${environment.apiUrl}/api/user/oneuser`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getallConsultants(userToken: any, accessToken: any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
    };
  
    return this.http.post(`${environment.apiUrl}/api/user/getConsultantDetails`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }


  getAllWorkflowUser(userToken: any, accessToken: any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
    };
  
    return this.http.post(`${environment.apiUrl}/api/user/getWorkflow`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }



  getOrderDetails(userToken: any, accessToken: any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
    };
  
    return this.http.post(`${environment.apiUrl}/api/order/getOrdeDetails`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getOneUserOrderDetails(userToken: any, accessToken: any, orderToken:any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
      "orderToken":orderToken
    };
  
    return this.http.post(`${environment.apiUrl}/api/order/getOrderDeatils`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
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

  updateUserInfo(userToken: any, accessToken: any, userInfoResult:any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
      "userInfoResult":userInfoResult
    };
  
    return this.http.put(`${environment.apiUrl}/api/user/updateUserInfo`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }


  updateBankInfo(userToken: any, accessToken: any, userBankResult:any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
      "userBankResult":userBankResult
    };
  
    return this.http.put(`${environment.apiUrl}/api/user/updateBankInfo`, body, { headers })
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
