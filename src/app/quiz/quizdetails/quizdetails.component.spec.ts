import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizdetailsComponent } from './quizdetails.component';

describe('QuizdetailsComponent', () => {
  let component: QuizdetailsComponent;
  let fixture: ComponentFixture<QuizdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
