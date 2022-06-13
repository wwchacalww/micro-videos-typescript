import CategoryInMemoryRepository from "../../../infra/db/in-memory/category-in-memory.repository";
import { Category } from "../../../domain/entities/category";
import { ListCategoriesUseCase } from "../list-categories.use-case";
import { CategoryRepository } from "../../../domain/repository/category.repository";

describe("ListCategories Use Case Unit Test", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  test("toOutput method", () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    let output = useCase["toOutPut"](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });

    const entity = new Category({ name: "Movie" });
    result = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    output = useCase["toOutPut"](result);
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });

  it("should returns output using empty input with categories ordered by created_at", async () => {
    const items = [
      new Category({
        name: "Movie",
        created_at: new Date(2022, 5, 4, 10, 35, 0),
      }),
      new Category({
        name: "Music",
        created_at: new Date(2022, 5, 4, 10, 40, 0),
      }),
      new Category({
        name: "Sport",
        created_at: new Date(2022, 5, 4, 10, 50, 0),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [items[2].toJSON(), items[1].toJSON(), items[0].toJSON()],
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("shoult returns output using pagination, sort and filter", async () => {
    const items = [
      new Category({
        name: "Movie Iron Man 1",
        created_at: new Date(2022, 5, 4, 10, 35, 0),
      }),
      new Category({
        name: "Album Iron Man 2",
        created_at: new Date(2022, 5, 4, 10, 40, 0),
      }),
      new Category({
        name: "Movie The Batman",
        created_at: new Date(2022, 5, 4, 10, 50, 0),
      }),
      new Category({
        name: "Novell Iron Man 3",
        created_at: new Date(2022, 5, 3, 10, 40, 0),
      }),
    ];
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "Iron",
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[0].toJSON()],
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
    expect(output).toStrictEqual({
      items: [items[3].toJSON()],
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
    expect(output).toStrictEqual({
      items: [items[3].toJSON(), items[0].toJSON()],
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
