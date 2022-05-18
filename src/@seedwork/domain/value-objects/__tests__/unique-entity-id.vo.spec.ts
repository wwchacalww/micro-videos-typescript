import { validate as uuidValidate } from "uuid";
import InvalidUuidError from "../../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id.vo";

// function spyValidateMethod() {
//   return jest.spyOn(UniqueEntityId.prototype as any, "validate");
// }

describe("UniqueEntityId Unit Test", () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

  it("should throw error when uuid is invalid", () => {
    // const validateSpy = spyValidateMethod();
    expect(() => new UniqueEntityId("FakeID")).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept a uuid passed in constructor", () => {
    // const validateSpy = spyValidateMethod();
    const uuid = "000a6c80-3659-44de-b763-29d53f0212a7";
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept a uuid passed in constructor", () => {
    // const validateSpy = spyValidateMethod();
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
