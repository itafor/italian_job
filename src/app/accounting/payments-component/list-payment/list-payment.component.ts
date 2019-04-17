import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent implements OnInit {

  closeResult: string;
  vendorId: string;
  @Input() PaymentData: any;

  constructor(private _route: ActivatedRoute) { }
vendorInfo: {} = {};

  // ngOnInit() {
  //   console.log(this.vendors);
  // }

  ngOnInit() {
  }
}
