import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  constructor() {}
  closeResult: string;
  vendorId: string;
  @Input() cardCategoryData: any;
  ngOnInit() {}
}
