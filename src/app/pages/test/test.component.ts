// import { Component, OnInit } from '@angular/core';
// import { HttpEventType, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { FileUploadService } from 'src/app/services/file-upload.service';


// @Component({
//   selector: 'app-test',
//   templateUrl: './test.component.html',
//   styleUrls: ['./test.component.scss']
// })
// export class TestComponent implements OnInit {
//   selectedFiles?: FileList;
//   progressInfos: any[] = [];
//   message: string[] = [];

//   previews: string[] = [];
//   imageInfos?: Observable<any>;

//   constructor(private uploadService: FileUploadService) { }

//   ngOnInit(): void {
//     this.imageInfos = this.uploadService.getFiles();
//   }

//   selectFiles(event: any): void {
//     this.message = [];
//     this.progressInfos = [];
//     this.selectedFiles = event.target.files;

//     this.previews = [];
//     if (this.selectedFiles && this.selectedFiles[0]) {
//       const numberOfFiles = this.selectedFiles.length;
//       for (let i = 0; i < numberOfFiles; i++) {
//         const reader = new FileReader();

//         reader.onload = (e: any) => {
//           console.log(e.target.result);
//           this.previews.push(e.target.result);
//         };

//         reader.readAsDataURL(this.selectedFiles[i]);
//       }
//     }
//   }

//   upload(idx: number, file: File): void {
//     this.progressInfos[idx] = { value: 0, fileName: file.name };

//     if (file) {
//       this.uploadService.upload(file).subscribe({
//         next: (event: any) => {
//           if (event.type === HttpEventType.UploadProgress) {
//             this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
//           } else if (event instanceof HttpResponse) {
//             const msg = file.name + ": Successful!";
//             this.message.push(msg);
//             this.imageInfos = this.uploadService.getFiles();
//           }
//         },
//         error: (err: any) => {
//           this.progressInfos[idx].value = 0;
//           let msg = file.name + ": Failed!";

//           if (err.error && err.error.message) {
//             msg += " " + err.error.message;
//           }

//           this.message.push(msg);
//           this.imageInfos = this.uploadService.getFiles();
//         }});
//     }
//   }

//   uploadFiles(): void {
//     this.message = [];

//     if (this.selectedFiles) {
//       for (let i = 0; i < this.selectedFiles.length; i++) {
//         this.upload(i, this.selectedFiles[i]);
//       }
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
  }

  // selectFiles(event: any): void {
  //   this.message = [];
  //   this.progressInfos = [];
  //   this.selectedFiles = event.target.files;

  //   this.previews = [];
  //   if (this.selectedFiles && this.selectedFiles[0]) {
  //     const numberOfFiles = this.selectedFiles.length;
  //     for (let i = 0; i < numberOfFiles; i++) {
  //       const reader = new FileReader();

  //       reader.onload = (e: any) => {
  //         console.log(e.target.result);
  //         this.previews.push(e.target.result);
  //       };

  //       reader.readAsDataURL(this.selectedFiles[i]);

  //       // Immediately upload the file after selecting it
  //       this.upload(i, this.selectedFiles[i]);
  //     }
  //   }
  // }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        const fileType = file.type;
        const allowedTypes = [
          // 'image/jpeg',
          // 'image/jpg', 
          // 'image/png', 
          'application/pdf',
           'model/stl', 
           'model/ply'];
        
        if (!allowedTypes.includes(fileType)) {
          //this.message.push(`${file.name} is not a valid file type.`);
         //Add a toaster message for invalid dat type
          continue;
        }
  
        // Process the file if it's valid
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(file);
  
        // Immediately upload the file after selecting it
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = file.name + ": Successful!";
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          let msg = file.name + ": Failed!";

          if (err.error && err.error.message) {
            msg += " " + err.error.message;
          }

          this.message.push(msg);
          this.imageInfos = this.uploadService.getFiles();
        }});
    }
  }
}
