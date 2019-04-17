import { Component, OnInit, Input } from '@angular/core';
import {
  NgbActiveModal,
  NgbProgressbarConfig
} from '@ng-bootstrap/ng-bootstrap';

import { DIRECTION } from '../../enums';

// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { CreateFormStepOneComponent } from '../../components/forms/one.component';

// This component will receive events from sub forms
// This component will eventually submit the form with all requirements

@Component({
  selector: 'app-quiz-wizard',
  // templateUrl: './create-wizard.component.html',
  templateUrl: './create-wizard.component.html',
  providers: [NgbProgressbarConfig]
})
export class CreateQuizWizardComponent implements OnInit {
  // Quiz Manager | Quiz Creation Wizard
  formTitle = 'Create Quiz';
  currentFormIndex: number = 0;

  constructor(
    config: NgbProgressbarConfig // public activeModal: NgbActiveModal // private modalService: NgbModal
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }

  ngOnInit() {}

  handleCloseModal() {
    // this.activeModal.close();
  }

  handleChangeInStage(direction: DIRECTION) {
    console.log(direction);
    if (direction === DIRECTION.BACKWARD) {
      this.currentFormIndex--;
    } else {
      this.currentFormIndex++;
    }
  }

  goBack() {
    this.currentFormIndex--;
  }

  /*
  openModal() {
    const modalRef = this.modalService.open(CreateFormStepOneComponent);
    modalRef.componentInstance.name = 'DemoModal';
  }
  */
}
