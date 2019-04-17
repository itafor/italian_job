import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService } from '../../service/accounting.service';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit {

 
  closeResult: string;
  salesId: string;
  @Input() listSaleData:any;
  
  constructor(private service: AccountingService, private _route: ActivatedRoute) { }
salesInfo: {} = {};

  ngOnInit() {
  }

}
