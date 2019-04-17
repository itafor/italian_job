import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService } from '../../service/accounting.service';

@Component({
  selector: 'app-list-audit-trail',
  templateUrl: './list-audit-trail.component.html',
  styleUrls: ['./list-audit-trail.component.scss']
})
export class ListAuditTrailComponent implements OnInit {
  oseResult: string;
  salesId: string;
  @Input() AuditTrailData:any;
  
  constructor(private service: AccountingService, private _route: ActivatedRoute) { }
salesInfo: {} = {};

  ngOnInit() {
  }


}
