import { Category } from "#category/domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe("Category-in-Memory Test", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  it("should not be able filter when is null", async () => {
    const item = new Category({ name: "Product 1" });
    const item2 = new Category({ name: "Product 2" });
    const items = [item, item2];
    const spy = jest.spyOn(items, "filter" as any);

    const filtered = await repository["applyFilter"](items, null);
    expect(spy).not.toHaveBeenCalled();
    expect(filtered).toStrictEqual(items);
  });

  it("should filter items", async () => {
    const item = new Category({ name: "Product Test" });
    const item2 = new Category({ name: "Product TESTADO" });
    const item3 = new Category({ name: "Product AtEstAdO" });
    const item4 = new Category({ name: "Product Fake" });

    const items = [item, item2, item3, item4];
    const spy = jest.spyOn(items, "filter" as any);

    const filtered = await repository["applyFilter"](items, "TEST");
    expect(spy).toHaveBeenCalled();
    expect(filtered).toStrictEqual([item, item2, item3]);
  });

  test("when sort value is null, sort by created_at field", async () => {
    const createdAt1 = new Date(2022, 4, 21, 12, 0, 0, 0);
    const createdAt2 = new Date(2022, 4, 22, 11, 0, 0, 0);
    const createdAt3 = new Date(2022, 4, 23, 10, 0, 0, 0);
    const createdAt4 = new Date(2022, 4, 24, 14, 0, 0, 0);
    const item = new Category({ name: "Product Test", created_at: createdAt4 });
    const item2 = new Category({
      name: "Product TESTADO",
      created_at: createdAt3,
    });
    const item3 = new Category({
      name: "Product AtEstAdO",
      created_at: createdAt2,
    });
    const item4 = new Category({
      name: "Product Fake",
      created_at: createdAt1,
    });

    const items = [item, item2, item3, item4];

    const sorted = await repository["applySort"](items, null, "asc");
    expect(sorted).toStrictEqual([item4, item3, item2, item]);
  });

  it("should sort items by field name and description ", async () => {
    const item = new Category({
      name: "Mamão",
      description: "Ideal para digestão",
    });
    const item2 = new Category({
      name: "Goiaba",
      description: "Rica em vitamina A",
    });
    const item3 = new Category({ name: "Acerola", description: "Em orfeta" });
    const item4 = new Category({
      name: "Laranja",
      description: "Fonte de vitamina C",
    });

    const items = [item, item2, item3, item4];

    let sortedName = await repository["applySort"](items, "name", "asc");
    let sortedDescription = await repository["applySort"](
      items,
      "description",
      "asc"
    );
    expect(sortedName).toStrictEqual([item3, item2, item4, item]);
    expect(sortedDescription).toStrictEqual([item3, item4, item, item2]);

    sortedName = await repository["applySort"](items, "name", "desc");
    sortedDescription = await repository["applySort"](
      items,
      "description",
      "desc"
    );
    expect(sortedName).toStrictEqual([item, item4, item2, item3]);
    expect(sortedDescription).toStrictEqual([item2, item, item4, item3]);
  });
});
