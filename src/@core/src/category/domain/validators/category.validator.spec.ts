import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from "./category.validator";

describe("CategoryValidator test", () => {
  let validator: CategoryValidator;
  beforeEach(() => (validator = CategoryValidatorFactory.create()));
  test("invalidation cases for name", () => {
    const arrange = [
      {
        value: null as any,
        expect: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      { value: { name: "" }, expect: ["name should not be empty"] },
      {
        value: { name: 5 as any },
        expect: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        value: { name: "t".repeat(256) },
        expect: ["name must be shorter than or equal to 255 characters"],
      },
    ];
    arrange.forEach((item) => {
      const isValid = validator.validate(item.value);
      expect(isValid).toBeFalsy();
      // expect(validator.errors["name"]).toStrictEqual(item.expect);
      expect({ validator, data: item.value }).containsErrorMessages({
        name: item.expect as any,
      });
    });
  });

  test("invalidation cases for description field", () => {
    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: ["description must be a string"],
    });
  });

  test("invalidation cases for is_active field", () => {
    expect({ validator, data: { is_active: 5 } }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });

    expect({ validator, data: { is_active: 0 } }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });

    expect({ validator, data: { is_active: 1 } }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });
  });

  test("valid cases for fields", () => {
    type Arrange = {
      value: { name: string; description?: string; is_active?: boolean };
    };
    const arrange: Arrange[] = [
      { value: { name: "Some value" } },
      { value: { name: "Some value", description: undefined } },
      { value: { name: "Some value", description: null } },
      { value: { name: "Some value", description: "Some thing" } },
      { value: { name: "Some value", is_active: true } },
      { value: { name: "Some value", is_active: false } },
    ];
    arrange.forEach((item) => {
      const isValid = validator.validate(item.value);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(item.value)
      );
    });
  });
});
