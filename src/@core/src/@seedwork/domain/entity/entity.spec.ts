import { validate as validateUuid } from "uuid";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}
describe("Entity unit tests", () => {
  it("should set props and id", () => {
    const arrange = { prop1: "Hakuna", prop2: 23 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).not.toBeNull();
    expect(validateUuid(entity.id)).toBeTruthy();
  });

  it("should accept an uuid valid", () => {
    const uniqueId = new UniqueEntityId();
    const arrange = { prop1: "Hakuna", prop2: 23 };
    const entity = new StubEntity(arrange, uniqueId);
    expect(entity.id).toBe(uniqueId.value);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(validateUuid(entity.id)).toBeTruthy();
  });

  it("should convert entity to Javascript object", () => {
    const arrange = { prop1: "Hakuna", prop2: 23 };
    const entity = new StubEntity(arrange);
    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange,
    });
  });
});
