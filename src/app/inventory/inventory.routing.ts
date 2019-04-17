import { Routes } from '@angular/router';
import { ListInventoryCategoryComponent } from './components/list-inventory-category/list-inventory-category.component';

export const InventoryRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'categories',
        component: ListInventoryCategoryComponent,
        data: {
          heading: 'Inventory Category'
        },
      }
    ]
  }
];
