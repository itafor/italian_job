import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface FormatterPatternAndReplacement {
  pattern: RegExp;
  replacement: string;
}

@Injectable()
export class Formatter {
  static asCode = new RegExp(/`(.*?)`/g);
  static asPre = new RegExp(/`{3}(.*?)`{3}/);
  static asBold = new RegExp(/\*(.*?)\*/g);
  static asItalic = new RegExp(/_(.*?)_/g);
  static asStrikeThrough = new RegExp(/~(.*?)~/g);
  static allSupportedMatchers = new RegExp(/`(.*?)`|\*(.*?)\*|_(.*?)_|~(.*?)~/g);

  static formatters: FormatterPatternAndReplacement[] = [
    {pattern: Formatter.asItalic, replacement: 'i'},
    {pattern: Formatter.asCode,  replacement: 'code'},
    {pattern: Formatter.asBold, replacement: 'b'},
    {pattern: Formatter.asStrikeThrough, replacement: 'del'}
  ];

  constructor(protected sanitizer: DomSanitizer) {}

  stripFormattersAndReturnHTML(textToFormat: string, tag): string {
    return `<${tag}>${textToFormat}</${tag}>`;
  }

  sanitizedOutput(formattedText: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

  watchForMultipleMatchers(word: string): string {
      return Formatter.formatters.reduce(
        (word, formatter) => word.replace(formatter.pattern, (match, enclosed)  => {
          return `<${formatter.replacement}>${enclosed}</${formatter.replacement}>`;
        })
        , word);
  }
  processCompletely(text: string): SafeHtml {
    if (text.indexOf('```') > -1) {
      if (text.replace('```', '').indexOf('```') > -1) {
        const decoded = text.replace(Formatter.asPre, (match, enclosed) => enclosed)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace('```', '').replace('```', '');
      return this.sanitizedOutput(`<pre>${decoded}</pre>`);
      }
    }
    return this.sanitizedOutput(this.watchForMultipleMatchers(text));
  }
}

