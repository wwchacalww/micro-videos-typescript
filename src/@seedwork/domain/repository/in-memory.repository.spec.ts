import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}
describe("InMemory Repository Unit Test", () => {
  let repository: StubInMemoryRepository;
  beforeEach(() => (repository = new StubInMemoryRepository()));
  it("should inserts a new entity", async () => {
    const entity = new StubEntity({ name: "Product A", price: 10 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throws error when entity not found", async () => {
    expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );
    expect(
      repository.findById(
        new UniqueEntityId("817e1ac6-23bf-482b-8fdf-0b5abd46afd9")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID 817e1ac6-23bf-482b-8fdf-0b5abd46afd9`
      )
    );
  });

  it("should find an entity by id", async () => {
    const entity = new StubEntity({ name: "Product A", price: 10 });
    await repository.insert(entity);
    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all entities", async () => {
    const entity = new StubEntity({ name: "Product A", price: 10 });
    await repository.insert(entity);
    const list = await repository.findAll();
    expect(list).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "Product A", price: 10 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "Product A", price: 10 });
    const entity2 = new StubEntity({ name: "Product Z", price: 50 });

    await repository.insert(entity);
    await repository.insert(entity2);
    const entityAltered = new StubEntity(
      { name: "Product B", price: 20 },
      entity.uniqueEntityId
    );
    await repository.update(entityAltered);
    expect(entityAltered.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throws error on delete when entity not found", async () => {
    expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );
    expect(
      repository.delete(
        new UniqueEntityId("817e1ac6-23bf-482b-8fdf-0b5abd46afd9")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID 817e1ac6-23bf-482b-8fdf-0b5abd46afd9`
      )
    );
  });

  it("should delete an entity by id", async () => {
    const entity = new StubEntity({ name: "Product A", price: 10 });
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);
    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
