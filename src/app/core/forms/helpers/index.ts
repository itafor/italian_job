import { Injectable } from '@angular/core';
@Injectable()
export class InputParserService {
  private pFormattedInputs: string[] = [];
  static parseDelimited(valueBag: string, delimiter: string): Array<string> {
    return valueBag.split(delimiter);
  }

  parseRecipientField(values: string, delimiter: string): string {
    const newFormatted = InputParserService.parseDelimited(values, delimiter);
    this.pFormattedInputs.push(...newFormatted.slice(0, newFormatted.length - 1));
    return newFormatted[newFormatted.length - 1];
  }

  removeFromDelimited(index: number) {
    this.pFormattedInputs.splice(index, 1);
  }

  get formattedInputs() { return this.pFormattedInputs; }

  initFormattedInputs(values: string[]) {
    if (!Array.isArray(values)) {
      values = [];
    }
    this.pFormattedInputs = values;
  }
}
