import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import { Category } from "../../../../domain/entities/category";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CategoryModel, CategoryRepository } = CategorySequelize;

describe("Delete Category Use Case Integration Test", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should throw an error if category not found", async () => {
    await expect(() => useCase.execute({ id: "not-found" })).rejects.toThrow(
      new NotFoundError(`Entity not found using ID not-found`)
    );
  });
  it("should delete a category", async () => {
    const model = await CategoryModel.factory().create();
    await useCase.execute({ id: model.id });
    const noHasModel = await CategoryModel.findByPk(model.id);
    expect(noHasModel).toBeNull();
  });
});
