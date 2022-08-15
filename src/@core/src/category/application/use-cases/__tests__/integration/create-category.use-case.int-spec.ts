import { CreateCategoryUseCase } from "../../create-category.use-case";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe("Create Category Use Case Integration Test", () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  it("should create a new category", async () => {
    let output = await useCase.execute({ name: "Test Category" });
    let entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: "Test Category",
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: "Test Category",
      description: "Test Description",
      is_active: false,
    });

    entity = await repository.findById(output.id);

    expect(output).toStrictEqual({
      id: entity.id,
      name: "Test Category",
      description: "Test Description",
      is_active: false,
      created_at: entity.created_at,
    });
  });
});
