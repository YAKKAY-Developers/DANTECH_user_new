// import { Injectable, inject } from '@angular/core';
// import {
//   Router,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   UrlTree,
//   CanActivateFn,
// } from '@angular/router';
// import { Observable } from 'rxjs/internal/Observable';
// import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// class AdminGuard {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean {
//     return true;
//   }
// }

// export const authguard: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ): boolean => {
//   return inject(AdminGuard).canActivate(route, state);
// };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('user');
  console.log(route);
  console.log(state);
  const router = inject(Router);
  console.log('Im in auth guard');
  console.log('token', token);
  if (token) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
