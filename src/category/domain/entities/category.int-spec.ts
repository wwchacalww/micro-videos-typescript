import { EntityValidationError, ValidationError } from "../../../@seedwork/domain/errors/validation-error";
import { Category } from "./category";

describe("Category Integration Tests", () => {
  describe("create method", () => {
    it("should a invalid category using name property", () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });

      expect(() => new Category({ name: undefined })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });

      expect(() => new Category({ name: "" })).containsErrorMessages({
        name: [
          "name should not be empty",
        ]
      });

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });

      expect(() => new Category({ name: "a".repeat(256) })).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters",
        ]
      });
    });

    it("should a invalid category using description property", () => {
      expect(
        () => new Category({ name: "Test", description: 5 as any })
      ).containsErrorMessages({
        description: [
          "description must be a string",
        ]
      });
    });

    it("should a invalid category using is_active property", () => {
      expect(
        () =>
          new Category({
            name: "Test",
            description: "Description",
            is_active: "true" as any,
          })
      ).containsErrorMessages({
        is_active: [
          "is_active must be a boolean value",
        ]
      });;
    });
  });
  describe("update method", () => {
    it("should a invalid category using name property", () => {
      const category = new Category({ name: "Movie", description: "Terror" });
      expect(() => category.update(null, null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });
      expect(() => category.update(undefined, undefined)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });
      expect(() => category.update("", "")).containsErrorMessages({
        name: [
          "name should not be empty",
        ]
      });
      expect(() => category.update(5 as any, 5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]
      });
      expect(() => category.update("a".repeat(256))).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters",
        ]
      });
    });

    it("should a invalid category using description property", () => {
      const category = new Category({ name: "Movie", description: "Terror" });
      expect(() => category.update("Test", 5 as any)).containsErrorMessages({
        description: [
          "description must be a string",
        ]
      });
    });
  });
});
