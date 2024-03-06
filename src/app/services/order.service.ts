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

  orderreg(form: any, formdata: any, selected_tooth: any, userToken: any) {
    console.log("I am in")
    const body = {
      form: form,
      formdata: formdata,
      tooth: selected_tooth,
      userToken: userToken,
    };
    console.log(body);
    return this.http.post(`${environment.apiUrl}/api/order/createorder`, body);
  }


  createOrder(userToken: any, accessToken: any, form: any, formdata: any, selected_tooth: any) {
    console.log("I am in createorder service service")
   
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
    const body = {
      userToken: userToken,
      form: form,
      formdata: formdata,
      tooth: selected_tooth
    }
    
    console.log(body);
    return this.http.post(`${environment.apiUrl}/api/order/createOrder`, body , { headers });
  }



  //Justto check
  submitSurvey(userToken: any, accessToken: any, surveyResponse: any): Observable<any> {
    let headers = new HttpHeaders({
      'x-access-token': `${accessToken}`
    });
  
    let body = {
      "userToken": userToken,
      "surveyData": surveyResponse.surveyData, // Pass the surveyData object
      "organizationName": surveyResponse.organizationName, // Add the organizationName property
      "appartmentNumber": surveyResponse.appartmentNumber, // Add the appartmentNumber property
      "customerName": surveyResponse.customerName, // Add the customerName property
    };
  
    return this.http.post(`${environment.apiUrl}/api/surveyForm/createSurveyinfo`, body, { headers })
      .pipe(map((res: any) => {
        console.log("test", res);
        return res;
      }));
  }

  
  
}
