import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit {

  closeResult: string;
  customerId: string;
  @Input() customerData:any;

  constructor(private service: ServerService, private _route: ActivatedRoute) { }
customerInfo: {} = {};

   ngOnInit() {
     //console.log(this.vendors);
   }

}
