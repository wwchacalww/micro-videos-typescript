import { CreateCategoryUseCase } from "../create-category.use-case";
import CategoryInMemoryRepository from "#category/infra/db/in-memory/category-in-memory.repository";

describe("Create Category Use Case Unit Test", () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  it("should create a new category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "Test Category" });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "Test Category",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: "Test Category",
      description: "Test Description",
      is_active: false,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: "Test Category",
      description: "Test Description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
  });
});
