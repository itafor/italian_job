import { Component, OnInit, Input } from '@angular/core';
import {
  NgbActiveModal,
  NgbProgressbarConfig
} from '@ng-bootstrap/ng-bootstrap';

import { DIRECTION } from '../../enums';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  providers: [NgbProgressbarConfig]
})
export class CreateQuizComponent implements OnInit {
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
    if (direction === DIRECTION.BACKWARD) {
      this.currentFormIndex--;
    } else {
      this.currentFormIndex++;
    }
  }

  goBack() {
    this.currentFormIndex--;
  }

}
