import {
  FormControl, Validators, ValidationErrors,
  AbstractControl, ValidatorFn,
} from '@angular/forms';


export class CustomValidators extends Validators {
  // tslint:disable-next-line:max-line-length
  static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static validateTypeBoolean(control: FormControl): ValidationErrors {
    // check if control has a value
    if (control.value !== null) {
      if (typeof control.value !== 'boolean') {
        return { typeError: 'Field expects a boolean item'};
      }
    }
    return null;
  }

  static isEmail = value => CustomValidators.EMAIL_REGEX.test(value);

  static onlyNulls = (item: any[]): boolean => !item.some(i => i !== null);

  static conductTest = parsed => parsed.map((item, index) => CustomValidators.testEmailAndReturnError(item, index));

  static testEmailAndReturnError = (item, index) => {
    if (!CustomValidators.isEmail(item)) {
      return {
        index,
        email: 'Entry is not a valid email'
      };
    } else { return null; }
  }

  static parsedInputsExists = (parsed: string[]): ValidatorFn => {
    const invalidObj: ValidationErrors = {};
    return (control: AbstractControl): ValidationErrors => {
     if (parsed.length < 1 && (!control.value || control.value.trim().length === 0 )) {
       return Object.assign(invalidObj, {required: true});
     } else {
       const errorsFromTest = CustomValidators.conductTest(parsed);
       if (CustomValidators.onlyNulls(errorsFromTest)) { return null; }
       return errorsFromTest;
     }
    };
  }
}
