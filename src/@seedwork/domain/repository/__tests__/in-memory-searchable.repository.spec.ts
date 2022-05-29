import Entity from "../../entity/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";
import { SearchParams, SearchResult } from "../repository-contracts";

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

  describe("ApplyPaginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "banana", price: 1 }),
        new StubEntity({ name: "Amora", price: 2 }),
        new StubEntity({ name: "Abelha", price: 3 }),
        new StubEntity({ name: "Abacate", price: 4 }),
        new StubEntity({ name: "Abacaxi", price: 5 }),
        new StubEntity({ name: "Maracujá", price: 6 }),
        new StubEntity({ name: "Acerola", price: 7 }),
      ];
      let itemsPaginate = await repository["applyPaginate"](items, 1, 2);
      expect(itemsPaginate).toStrictEqual([items[0], items[1]]);
      itemsPaginate = await repository["applyPaginate"](items, 3, 2);
      expect(itemsPaginate).toStrictEqual([items[4], items[5]]);
      itemsPaginate = await repository["applyPaginate"](items, 4, 2);
      expect(itemsPaginate).toStrictEqual([items[6]]);
      itemsPaginate = await repository["applyPaginate"](items, 5, 2);
      expect(itemsPaginate).toStrictEqual([]);
    });
  });

  describe("search method", () => {
    it("should apply only paginate when other params are null", async () => {
      const entity = new StubEntity({ name: "test", price: 1 });
      const items = Array(16).fill(entity);
      repository.items = items;
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        })
      );
    });

    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "banana", price: 1 }),
        new StubEntity({ name: "Amora", price: 2 }),
        new StubEntity({ name: "Abelha", price: 3 }),
        new StubEntity({ name: "BANANA", price: 4 }),
        new StubEntity({ name: "Abacaxi", price: 5 }),
        new StubEntity({ name: "BAnaNa", price: 6 }),
        new StubEntity({ name: "Acerola", price: 7 }),
      ];
      repository.items = items;
      let result = await repository.search(
        new SearchParams({
          page: 1,
          per_page: 2,
          filter: "BANANA",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[3]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "BANANA",
        })
      );

      result = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 2,
          filter: "BANANA",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[5]],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "BANANA",
        })
      );
    });

    it("should apply paginate and sort", async () => {
      const items = [
        new StubEntity({ name: "Cebola", price: 1 }),
        new StubEntity({ name: "Amora", price: 2 }),
        new StubEntity({ name: "Abelha", price: 3 }),
        new StubEntity({ name: "Maracujá", price: 4 }),
        new StubEntity({ name: "Cenoura", price: 5 }),
        new StubEntity({ name: "Goiaba", price: 6 }),
        new StubEntity({ name: "Acerola", price: 7 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new SearchResult({
            items: [items[2], items[6]],
            total: 7,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 7,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new SearchResult({
            items: [items[3], items[5]],
            total: 7,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new SearchResult({
            items: [items[4], items[0]],
            total: 7,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });

    it("should apply paginate, filter and sort", async () => {
      const items = [
        new StubEntity({ name: "cebola", price: 1 }),
        new StubEntity({ name: "Amora", price: 2 }),
        new StubEntity({ name: "CeBOLa", price: 3 }),
        new StubEntity({ name: "Maracujá", price: 4 }),
        new StubEntity({ name: "CEBOLA", price: 5 }),
        new StubEntity({ name: "Goiaba", price: 6 }),
        new StubEntity({ name: "Acerola", price: 7 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "CEBOLA",
          }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "CEBOLA",
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "CEBOLA",
          }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "CEBOLA",
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });
});
