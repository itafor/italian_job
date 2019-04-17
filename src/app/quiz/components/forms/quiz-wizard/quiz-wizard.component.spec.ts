import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizWizardComponent } from './quiz-wizard.component';

describe('QuizWizardComponent', () => {
  let component: QuizWizardComponent;
  let fixture: ComponentFixture<QuizWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
