import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizwelcomepageComponent } from './quizwelcomepage.component';

describe('QuizwelcomepageComponent', () => {
  let component: QuizwelcomepageComponent;
  let fixture: ComponentFixture<QuizwelcomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizwelcomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizwelcomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
