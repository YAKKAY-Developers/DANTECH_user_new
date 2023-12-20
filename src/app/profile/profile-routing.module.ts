import { Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { FormComponent } from './form/form.component';
import { authGuard } from '../helpers/auth.guard';
export const ProfileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'form',
        component: FormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'view',
        component: ViewComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
