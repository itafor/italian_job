import { Component, OnInit } from '@angular/core';
import { OmsService } from '../../oms.service';


interface OrderResponse {
  status: string;
  data: any[];
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(private omsService: OmsService) { }
  orderList: any;
  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.omsService.fetchOrders().subscribe((data: OrderResponse) => {
      if (data) {
        this.orderList = data.data;
       
      }
   

    })
  }


}
