import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService } from '../../service/accounting.service';

@Component({
  selector: 'app-list-invoice',
  templateUrl: './list-invoice.component.html',
  styleUrls: ['./list-invoice.component.scss']
})
export class ListInvoiceComponent implements OnInit {

  closeResult: string;
  salesId: string;
  @Input() listInvoiceData:any;
  
  constructor(private service: AccountingService, private _route: ActivatedRoute) { }
salesInfo: {} = {};

  ngOnInit() {
  }

}
