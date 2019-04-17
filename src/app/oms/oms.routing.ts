import { Routes } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';


export const OMSRoutes: Routes = [
  {
    path: '',
    children: [
        {
        path: 'orders',
            component: OrdersComponent,
            data: {
                heading: 'OMS'
            }
        }
    ]
  }
];
