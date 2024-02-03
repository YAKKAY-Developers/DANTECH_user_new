// import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';

// @Injectable({
//   providedIn: 'root',
// })
// export class ToasterService {

//   constructor(private toastr: ToastrService) { }

//   success(message: string, title?: string) {
//     this.toastr.success(message, title);
//   }

//   error(message: string, title?: string) {
//     this.toastr.error(message, title);
//   }

//   warning(message: string, title?: string) {
//     this.toastr.warning(message, title);
//   }

//   info(message: string, title?: string) {
//     this.toastr.info(message, title);
//   }

// }

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  showToast(message: string, title?: string, messageType: 'success' | 'error' | 'warning' | 'info' = 'success') {
    const toastrOptions = {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: false,
      progressBar: true,
      // Set dynamic toastClass based on messageType
      toastClass: this.getToastClass(messageType),
      // Use Bootstrap icons based on messageType
      icon: this.getToastIcon(messageType),
    };

    switch (messageType) {
      case 'success':
        this.toastr.success(message, title, toastrOptions);
        break;
      case 'error':
        this.toastr.error(message, title, toastrOptions);
        break;
      case 'warning':
        this.toastr.warning(message, title, toastrOptions);
        break;
      case 'info':
        this.toastr.info(message, title, toastrOptions);
        break;
      default:
        break;
    }
  }

  private getToastClass(messageType: string): string {
    switch (messageType) {
      case 'success':
        return 'custom-toast-success';
      case 'error':
        return 'custom-toast-error';
      case 'warning':
        return 'custom-toast-warning';
      case 'info':
        return 'custom-toast-info';
      default:
        return '';
    }
  }

  private getToastIcon(messageType: string): string {
    switch (messageType) {
      case 'success':
        return 'bi bi-check-circle'; // Bootstrap check-circle icon
      case 'error':
        return 'bi bi-x-circle'; // Bootstrap x-circle icon
      case 'warning':
        return 'bi bi-exclamation-triangle'; // Bootstrap exclamation-triangle icon
      case 'info':
        return 'bi bi-info-circle'; // Bootstrap info-circle icon
      default:
        return '';
    }
  }
}