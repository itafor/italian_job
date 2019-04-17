import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInventoryCategoryComponent } from './create-inventory-category.component';

describe('CreateInventoryCategoryComponent', () => {
  let component: CreateInventoryCategoryComponent;
  let fixture: ComponentFixture<CreateInventoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInventoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInventoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
