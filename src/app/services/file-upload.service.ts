import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {



  constructor(private http: HttpClient) { }

  // upload(file: File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);
  //   console.log("FormData", formData)

  //   const req = new HttpRequest('POST', `${environment.apiUrl}/api/order/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });

  //   return this.http.request(req);
  // }


  upload(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);
  
    const req = new HttpRequest('POST', `${environment.apiUrl}/api/order/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
  
    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          return event.body.filename; // Return the filename received from the server
        }
        return null;
      })
    );
  }



  getFiles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/files`);
  }
}