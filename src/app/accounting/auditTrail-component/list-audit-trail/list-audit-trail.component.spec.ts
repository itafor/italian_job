import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAuditTrailComponent } from './list-audit-trail.component';

describe('ListAuditTrailComponent', () => {
  let component: ListAuditTrailComponent;
  let fixture: ComponentFixture<ListAuditTrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAuditTrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
