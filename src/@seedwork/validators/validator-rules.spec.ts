import ValidationError from "../errors/validation-error";
import ValidatorRules from "./validator-rules";

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.value(value, property);
  const method = validator[rule];
  method.apply(validator, params);
}

describe("Validator rules unit tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.value("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rules", () => {
    let arrange: Values[] = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "", property: "field" },
    ];
    const error = new ValidationError("The field is required");
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error,
      });
    });
    arrange = [
      { value: "teste", property: "field" },
      { value: 5, property: "field" },
      { value: 0, property: "field" },
      { value: false, property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
        error,
      });
    });
  });

  test("string validation rule", () => {
    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: false, property: "field" },
    ];
    const error = new ValidationError("The field must be a string");
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });
    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "teste", property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });
  });

  test("maxlength validation rule", () => {
    let arrange: Values[] = [{ value: "abcdef", property: "field" }];
    const error = new ValidationError(
      "The field must be less or equal than 5 characters"
    );
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });
    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "teste", property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });
  });

  test("boolean validation rule", () => {
    let arrange: Values[] = [
      { value: "true", property: "field" },
      { value: 5, property: "field" },
    ];
    const error = new ValidationError("The field must be a boolean");
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });
    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: true, property: "field" },
      { value: false, property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });
  });

  it("should throw a validation error when combine two or more validation rules", () => {
    let validator = ValidatorRules.value(null, "field");
    expect(() => validator.required().string()).toThrow(
      new ValidationError("The field is required")
    );
    validator = ValidatorRules.value(5, "field");
    expect(() => validator.required().string()).toThrow(
      new ValidationError("The field must be a string")
    );
    validator = ValidatorRules.value("abcedf", "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError("The field must be less or equal than 5 characters")
    );
    validator = ValidatorRules.value(null, "field");
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError("The field is required")
    );
    validator = ValidatorRules.value(5, "field");
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError("The field must be a boolean")
    );
  });

  it("should valid when combine two or more validation rules", () => {
    expect.assertions(0);
    ValidatorRules.value(null, "field").string();
    ValidatorRules.value(undefined, "field").string();
    ValidatorRules.value("test", "field").required().string();
    ValidatorRules.value(null, "field").string().maxLength(5);
    ValidatorRules.value(undefined, "field").string().maxLength(5);
    ValidatorRules.value("abcde", "field").required().string().maxLength(5);

    ValidatorRules.value(null, "field").boolean();
    ValidatorRules.value(undefined, "field").boolean();
    ValidatorRules.value(true, "field").required().boolean();
    ValidatorRules.value(false, "field").required().boolean();
  });
});
