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
import { OrderListComponent } from './order-list/order-list.component';
import { OrdersummaryComponent } from './ordersummary/ordersummary.component';
import { FaqComponent } from './faq/faq.component';
import { TestingComponent } from './testing/testing.component';
import { CompletedOrderComponent } from './completed-order/completed-order.component';
import { QRCodeModule } from 'angularx-qrcode';


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
        path: 'test',
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
      {
        path: 'orderlist',
        component: OrderListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'completedorder',
        component: CompletedOrderComponent,
        canActivate: [authGuard],
      },
      {
        path: 'ordersummary/:id',
        component: OrdersummaryComponent,
        canActivate: [authGuard],
      },
      {
        path: 'faq',
        component: FaqComponent,
        canActivate: [authGuard],
      },
      {
        path: 'testing',
        component: TestingComponent,
        canActivate: [authGuard],
      }
      
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
    OrderListComponent,
    OrdersummaryComponent,
    FaqComponent,
    TestingComponent,
    CompletedOrderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    RouterModule.forChild(routes),
  ],
})
export class PagesModule {}
