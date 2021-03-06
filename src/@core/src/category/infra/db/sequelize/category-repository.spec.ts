import { Category } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";

describe("CategorySequelizeRepository Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should inserts a new entity", async () => {
    let category = new Category({ name: "Movie" });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "Movie",
      description: "Movie category",
      is_active: false,
    });
    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );
    await expect(
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
    const entity = new Category({ name: "Movie Test" });
    await repository.insert(entity);
    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should find all entities", async () => {
    const entity = new Category({ name: "Movie 1" });
    await repository.insert(entity);
    const entity2 = new Category({ name: "Movie 2" });
    await repository.insert(entity2);
    const entities = await repository.findAll();
    expect(entities.length).toBe(2);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity, entity2]));
  });

  // it("test", async () => {
  //   await CategoryModel.factory().create();
  // });
});
