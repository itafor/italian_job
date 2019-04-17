import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimeAgoPipe} from 'time-ago-pipe';
// import {SanitizeHtmlPipe} from '../email/email.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimeAgoPipe],
  exports:[TimeAgoPipe]
})
export class TimeAgoModule {}
