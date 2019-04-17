import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.scss']
})
export class ListExpenseComponent implements OnInit {


  closeResult: string;
  customerId: string;
  @Input() listEpenseData:any;

  constructor(private service: ServerService, private _route: ActivatedRoute) { }
customerInfo: {} = {};

  ngOnInit() {
  }

}
