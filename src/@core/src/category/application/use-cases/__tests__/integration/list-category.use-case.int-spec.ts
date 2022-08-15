import { Category } from "../../../../domain/entities/category";
import { ListCategoriesUseCase } from "../../list-categories.use-case";
import { CategoryRepository as CategoryRepositoryContract } from "../../../../domain/repository/category.repository";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import _chance from "chance";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CategoryModel, CategoryRepository, CategoryModelMapper } =
  CategorySequelize;
const { SearchResult } = CategoryRepositoryContract;
describe("ListCategories Use Case Integration Test", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it("should return output using empty input with categories ordered by created_at", async () => {
    const models = await CategoryModel.factory()
      .count(2)
      .bulkCreate((index: number) => {
        const chance = _chance();
        return {
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: "Some description",
          is_active: true,
          created_at: new Date(new Date().getTime() + index * 1000),
        };
      });

    const output = await useCase.execute({});
    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("shoult returns output using pagination, sort and filter", async () => {
    const models = CategoryModel.factory().count(4).bulkMake();
    models[0].name = "Movie Iron Man 1";
    models[1].name = "Album Iron Man 2";
    models[2].name = "Movie The Batman";
    models[3].name = "Novell Iron Man 3";

    await CategoryModel.bulkCreate(models.map((m) => m.toJSON()));

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "Iron",
    });
    expect(output).toMatchObject({
      items: [models[1], models[0]]
        .map(CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "Iron",
    });
    expect(output).toMatchObject({
      items: [models[3]]
        .map(CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "Iron",
    });
    expect(output).toMatchObject({
      items: [models[3], models[0]]
        .map(CategoryModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
