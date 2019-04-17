import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-income',
  templateUrl: './list-income.component.html',
  styleUrls: ['./list-income.component.scss']
})
export class ListIncomeComponent implements OnInit {

  constructor() { }
  closeResult: string;
  vendorId: string;
  @Input() incomeCategoryData: any;
  ngOnInit() {
  }

}
