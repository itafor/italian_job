import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReceivableComponent } from './create-receivable.component';

describe('CreateReceivableComponent', () => {
  let component: CreateReceivableComponent;
  let fixture: ComponentFixture<CreateReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
