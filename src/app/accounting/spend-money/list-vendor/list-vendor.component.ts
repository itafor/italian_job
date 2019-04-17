import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


interface EmployeeResponse {

    vendor: any[];
  
}

@Component({
  selector: 'app-list-vendor',
  templateUrl: './list-vendor.component.html',
  styleUrls: ['./list-vendor.component.scss']
})
export class ListVendorComponent implements OnInit {
  closeResult: string;
  vendorId: string;
  @Input() vendorData: any;

  constructor(private _route: ActivatedRoute) { }
vendorInfo: {} = {};

  // ngOnInit() {
  //   console.log(this.vendors);
  // }

  ngOnInit() {
  }
    
}
