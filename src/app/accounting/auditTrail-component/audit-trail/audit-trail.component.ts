import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '../../service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  constructor(
    private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private toaster: ToastrManager,
    private activeModal: NgbActiveModal
  ) {}
  auditTrailList: any[];
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  closeResult: string;
  invoiceToView: any;
  loadingSale = false;
  openTabs: any[] = [];
  @ViewChild('invoiceTabSet') refNgbTabset: NgbTabset;

  open(content, dataRow) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    this.invoiceToView = dataRow;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  newTabHandler(): void {
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  invoiceSuccessHandler(
    invoiceCreated,
    tabIndex: number,
    idToClose?: string
  ): void {
    this.closeTab(null, tabIndex, idToClose);
    this.fetchAuditTrail();
  }

  get latestTabId(): string {
    return `tab-id-${this.openTabs.length - 1}`;
  }

  tabIdForIndex(index: number): string {
    return `tab-id-${index}`;
  }

  addToTabs(
    title?: string,
    tabContent?: any,
    type?: string,
    id?: string
  ): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Invoice', type: 'NEW_INVOICE' };
    } else if (type === 'VIEW_INVOICE') {
      newTab = { title, content: tabContent, type: 'VIEW_INVOICE', id };
    } else {
      newTab = { title, content: tabContent, type: 'NEW_PAGE', id };
    }
    this.openTabs.push(newTab);
  }

  closeTab(event?: MouseEvent, index?: number, id?: String): void {
    const indexes: number[] = [];
    if (index || typeof index === 'number') {
      indexes.push(index);
    }
    if (event) {
      event.preventDefault();
    }
    if (id) {
      const indexFromID = this.openTabs.findIndex(tab => tab.id === id);
      if (indexFromID > -1) {
        indexes.push(indexFromID);
      }
    }

    this.removeFromTab(indexes);
    this.focusOnCreatedTab();
  }

  removeFromTab(indexes: number[]): void {
    indexes.forEach(i => {
      this.openTabs.splice(i, 1);
    });
  }
  focusOnCreatedTab() {
    setTimeout(() => {
      this.refNgbTabset.select(this.latestTabId);
    }, 50);
  }

  ngOnInit() {
    this.fetchAuditTrail();
  }

  fetchAuditTrail() {
    this.service.getAuditTrail().subscribe((data: any) => {
      if (data) {
        this.auditTrailList = data.data;
      }
      if (data.data.length == 0) {
        this.tableValue = 'hasNoValue';
      } else {
        this.tableValue = 'hasValue';
      }

      this.onPage(this.offset, this.limit);
    });
  }

  onPage(offset, limit) {
    this.count = this.auditTrailList.length;
    this.count = this.auditTrailList.length;

    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.auditTrailList;
  }

  showAuditTrail(content, dataRow) {
    this.addToTabs('Audit Trail', content, 'UPDATE_INVOICE');
    this.focusOnCreatedTab();
    this.invoiceToView = dataRow;
    console.log('Audit trail: ' + this.invoiceToView);
  }
  public captureScreen() {
    var data = document.getElementById('invoice_to_print');
    var myInvoice = html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('Invoice.pdf'); // Generated PDF
      console.log(contentDataURL);
    });
  }

  forceResize(tabChangeEvent, idOfTable: string): void {
    if (tabChangeEvent['nextId'] === idOfTable) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }
  }
}
