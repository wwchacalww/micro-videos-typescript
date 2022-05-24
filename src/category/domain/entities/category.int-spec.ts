import ValidationError from "../../../@seedwork/domain/errors/validation-error";
import { Category } from "./category";

describe("Category Integration Tests", () => {
  describe("create method", () => {
    it("should a invalid category using name property", () => {
      expect(() => new Category({ name: null })).toThrow(
        new ValidationError("The name is required")
      );
      expect(() => new Category({ name: undefined })).toThrow(
        new ValidationError("The name is required")
      );
      expect(() => new Category({ name: "" })).toThrow(
        new ValidationError("The name is required")
      );
      expect(() => new Category({ name: 5 as any })).toThrow(
        new ValidationError("The name must be a string")
      );
      expect(() => new Category({ name: "a".repeat(256) })).toThrow(
        new ValidationError(
          "The name must be less or equal than 255 characters"
        )
      );
    });

    it("should a invalid category using description property", () => {
      expect(
        () => new Category({ name: "Test", description: 5 as any })
      ).toThrow(new ValidationError("The description must be a string"));
    });

    it("should a invalid category using is_active property", () => {
      expect(
        () =>
          new Category({
            name: "Test",
            description: "Description",
            is_active: "true" as any,
          })
      ).toThrow(new ValidationError("The is_active must be a boolean"));
    });
  });
  describe("update method", () => {
    it("should a invalid category using name property", () => {
      const category = new Category({ name: "Movie", description: "Terror" });
      expect(() => category.update(null, null)).toThrow(
        new ValidationError("The name is required")
      );
      expect(() => category.update(undefined, undefined)).toThrow(
        new ValidationError("The name is required")
      );
      expect(() => category.update("", "")).toThrow(
        new ValidationError("The name is required")
      );
      expect(() => category.update(5 as any, 5 as any)).toThrow(
        new ValidationError("The name must be a string")
      );
      expect(() => category.update("a".repeat(256))).toThrow(
        new ValidationError(
          "The name must be less or equal than 255 characters"
        )
      );
    });

    it("should a invalid category using description property", () => {
      const category = new Category({ name: "Movie", description: "Terror" });
      expect(() => category.update("Test", 5 as any)).toThrow(
        new ValidationError("The description must be a string")
      );
    });
  });
});
