import { FieldsErrors } from "./@seedwork/domain/validators/validator-fields-interface";

declare global {
  declare namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R;
    }
  }
}

export {};
