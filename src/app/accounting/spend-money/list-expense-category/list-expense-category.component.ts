import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';

interface ExpenseCategoryResponse {
  expenseCategory: any[];
}
@Component({
  selector: 'app-list-expense-category',
  templateUrl: './list-expense-category.component.html',
  styleUrls: ['./list-expense-category.component.scss']
})
export class ListExpenseCategoryComponent implements OnInit {
  closeResult: string;
  vendorId: string;
  @Input() expenseCategoryData : any;

  constructor(private service: ServerService, private _route: ActivatedRoute) { }
vendorInfo: {} = {};


  ngOnInit() {
  }

}
