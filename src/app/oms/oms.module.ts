import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { OMSRoutes } from './oms.routing';
import { HttpClientModule } from '@angular/common/http';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { OmsService } from './oms.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OMSRoutes),
    NgbModule,
    NgbProgressbarModule,
  ],
  declarations: [OrdersComponent],
  providers: [HttpClientModule, OmsService]
})
export class OmsModule { }
