import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { TopOrdersComponent } from './top-orders/top-orders.component';
import { PagesComponent } from './pages.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { TestComponent } from './test/test.component';
import { TaskComponent } from './task/task.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { AddDoctorsComponent } from './add-doctors/add-doctors.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { DemoComponent } from './demo/demo.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { authGuard } from '../helpers/auth.guard';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'toporders',
        component: TopOrdersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'orderdetail/:id',
        component: OrderDetailComponent,
      },
      {
        path: 'test/:id',
        component: TestComponent,
      },
      {
        path: 'task',
        component: TaskComponent,
        canActivate: [authGuard],
      },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [authGuard],
      },
      {
        path: 'add-doctors',
        component: AddDoctorsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'bank-details',
        component: BankDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'demo',
        component: DemoComponent,
        canActivate: [authGuard],
      },
      {
        path: 'success',
        component: OrderSuccessComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    OrderDetailComponent,
    TopOrdersComponent,
    PagesComponent,
    TestComponent,
    TaskComponent,
    CreateOrderComponent,
    AddDoctorsComponent,
    BankDetailsComponent,
    DemoComponent,
    OrderSuccessComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class PagesModule {}
