import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface BankResponse {
  bank: any[];
}
@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: ['./list-bank.component.scss']
})
export class ListBankComponent implements OnInit {
  closeResult: string;
  bankId: string;
  @Input() bankData: any;

  constructor(private _route: ActivatedRoute) { }
bankInfo: {} = {};

  ngOnInit() {
  }

}
