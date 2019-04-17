import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIncomeComponent } from './create-income.component';

describe('CreateIncomeComponent', () => {
  let component: CreateIncomeComponent;
  let fixture: ComponentFixture<CreateIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
