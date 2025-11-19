import { Routes } from '@angular/router';

import { OrdersDetail } from './components/orders-detail/orders-detail.component';
import { OrdersList } from './components/orders-list/orders-list.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrdersList,
  },
  {
    path: ':id',
    component: OrdersDetail,
  },
];
