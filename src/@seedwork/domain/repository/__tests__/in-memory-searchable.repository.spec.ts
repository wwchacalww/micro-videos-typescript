import Entity from "../../entity/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ["name"];
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.props.price.toString() === filter
      );
    });
  }
}

describe("InMemorySearchableRepository Unit Test", () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => (repository = new StubInMemorySearchableRepository()));
  describe("ApplyFilter method", () => {
    it("should no filter items when filter param is null", async () => {
      const items = [
        new StubEntity({ name: "test", price: 1 }),
        new StubEntity({ name: "test2", price: 2 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const itemsFiltered = await repository["applyFilter"](items, null);

      expect(itemsFiltered).toEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "test", price: 3 }),
        new StubEntity({ name: "TEST", price: 10 }),
        new StubEntity({ name: "fake", price: 10 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      let itemsFiltered = await repository["applyFilter"](items, "TEST");
      expect(itemsFiltered).toEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository["applyFilter"](items, "10");
      expect(itemsFiltered).toEqual([items[1], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository["applyFilter"](items, "no-filter");
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe("ApplySort method", () => {
    it("should not sort items", async () => {
      const items = [
        new StubEntity({ name: "banana", price: 1 }),
        new StubEntity({ name: "Amora", price: 2 }),
        new StubEntity({ name: "Abelha", price: 3 }),
      ];
      let itemsSorted = await repository["applySort"](items, null, null);
      expect(itemsSorted).toStrictEqual(items);
      itemsSorted = await repository["applySort"](items, "price", "asc");
      expect(itemsSorted).toStrictEqual(items);
    });

    it("should sort items", async () => {
      const items = [
        new StubEntity({ name: "banana", price: 1 }),
        new StubEntity({ name: "Amora", price: 2 }),
        new StubEntity({ name: "Abelha", price: 3 }),
      ];
      let itemsSorted = await repository["applySort"](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
      itemsSorted = await repository["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
      itemsSorted = await repository["applySort"](items, "price", "asc");
      expect(itemsSorted).toStrictEqual(items);
    });
  });

  describe("ApplyPaginate method", () => {});

  describe("search method", () => {});
});
