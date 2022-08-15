import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import CategoryInMemoryRepository from "../../../../infra/db/in-memory/category-in-memory.repository";
import { Category } from "../../../../domain/entities/category";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";

describe("Delete Category Use Case Unit Test", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should throw an error if category not found", async () => {
    expect(() => useCase.execute({ id: "not-found" })).rejects.toThrow(
      new NotFoundError(`Entity not found using ID not-found`)
    );
  });
  it("should delete a category", async () => {
    const items = [
      new Category({ name: "Movies Test" }),
      new Category({ name: "Documentary Test" }),
    ];
    repository.items = items;
    const spyDelete = jest.spyOn(repository, "delete");
    await useCase.execute({ id: items[1].id });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].name).toBe("Movies Test");
  });
});
