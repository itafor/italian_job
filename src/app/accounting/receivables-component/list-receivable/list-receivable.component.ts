import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-receivable',
  templateUrl: './list-receivable.component.html',
  styleUrls: ['./list-receivable.component.scss']
})
export class ListReceivableComponent implements OnInit {
  closeResult: string;
  vendorId: string;
  @Input() receiveableData: any;

  constructor(private _route: ActivatedRoute) {}
  vendorInfo: {} = {};

  // ngOnInit() {
  //   console.log(this.vendors);
  // }

  ngOnInit() {}
}
