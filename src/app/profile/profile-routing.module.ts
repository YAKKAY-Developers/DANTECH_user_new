import { Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { FormComponent } from './form/form.component';
export const ProfileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'form',
        component: FormComponent,
      },
      {
        path: 'view',
        component: ViewComponent,
      },
    ],
  },
];
