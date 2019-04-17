import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetquestionsComponent } from './setquestions.component';

describe('SetquestionsComponent', () => {
  let component: SetquestionsComponent;
  let fixture: ComponentFixture<SetquestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetquestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
