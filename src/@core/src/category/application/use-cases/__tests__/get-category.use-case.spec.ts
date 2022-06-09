import GetCategoryUseCase from "../get-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entities/category";

describe("Get Category Use Case Unit Test", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it("should throw an error if category not found", async () => {
    expect(() => useCase.execute({ id: "not-found" })).rejects.toThrow(
      new NotFoundError(`Entity not found using ID not-found`)
    );
  });

  it("should returns a category", async () => {
    const items = [
      new Category({ name: "Movies", description: "Movies category" }),
    ];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, "findById");
    let output = await useCase.execute({ id: items[0].id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "Movies",
      description: "Movies category",
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });
});
