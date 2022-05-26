import { SearchParams } from "./repository-contracts";
describe("SearchParams unit tests", () => {
  test("page prop", () => {
    const arrange = [
      { page: null, exepected: 1 },
      { page: undefined, exepected: 1 },
      { page: "", exepected: 1 },
      { page: "fake", exepected: 1 },
      { page: 0, exepected: 1 },
      { page: -1, exepected: 1 },
      { page: 5.5, exepected: 1 },
      { page: true, exepected: 1 },
      { page: false, exepected: 1 },
      { page: {}, exepected: 1 },
      { page: 1, exepected: 1 },
      { page: 4, exepected: 4 },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ page: item.page as any }).page).toBe(
        item.exepected
      );
    });
  });

  test("per_page prop", () => {
    const arrange = [
      { per_page: null, exepected: 15 },
      { per_page: undefined, exepected: 15 },
      { per_page: "", exepected: 15 },
      { per_page: "fake", exepected: 15 },
      { per_page: 0, exepected: 15 },
      { per_page: -1, exepected: 15 },
      { per_page: 5.5, exepected: 15 },
      { per_page: true, exepected: 15 },
      { per_page: false, exepected: 15 },
      { per_page: {}, exepected: 15 },
      { per_page: 1, exepected: 1 },
      { per_page: 4, exepected: 4 },
    ];
    arrange.forEach((item) => {
      expect(
        new SearchParams({ per_page: item.per_page as any }).per_page
      ).toBe(item.exepected);
    });
  });

  test("sort prop", () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    const arrange = [
      { sort: null, exepected: null },
      { sort: undefined, exepected: null },
      { sort: "", exepected: null },
      { sort: 0, exepected: "0" },
      { sort: -1, exepected: "-1" },
      { sort: 5.5, exepected: "5.5" },
      { sort: true, exepected: "true" },
      { sort: false, exepected: "false" },
      { sort: {}, exepected: "[object Object]" },
      { sort: "field", exepected: "field" },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ sort: item.sort as any }).sort).toBe(
        item.exepected
      );
    });
  });

  test("sort_dir prop", () => {
    let params = new SearchParams();
    expect(params.sort_dir).toBeNull();
    params = new SearchParams({ sort: null });
    expect(params.sort_dir).toBeNull();
    params = new SearchParams({ sort: undefined });
    expect(params.sort_dir).toBeNull();
    params = new SearchParams({ sort: "" as any });
    expect(params.sort_dir).toBeNull();
    const arrange = [
      { sort_dir: null, exepected: "asc" },
      { sort_dir: undefined, exepected: "asc" },
      { sort_dir: "", exepected: "asc" },
      { sort_dir: 0, exepected: "asc" },
      { sort_dir: -1, exepected: "asc" },
      { sort_dir: 5.5, exepected: "asc" },
      { sort_dir: true, exepected: "asc" },
      { sort_dir: false, exepected: "asc" },
      { sort_dir: {}, exepected: "asc" },
      { sort_dir: "desc", exepected: "desc" },
      { sort_dir: "DESC", exepected: "desc" },
      { sort_dir: "asc", exepected: "asc" },
      { sort_dir: "ASC", exepected: "asc" },
    ];
    arrange.forEach((item) => {
      expect(
        new SearchParams({ sort: "field", sort_dir: item.sort_dir as any })
          .sort_dir
      ).toBe(item.exepected);
    });
  });

  test("filter prop", () => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();
    const arrange = [
      { filter: null, exepected: null },
      { filter: undefined, exepected: null },
      { filter: "", exepected: null },
      { filter: 0, exepected: "0" },
      { filter: -1, exepected: "-1" },
      { filter: 5.5, exepected: "5.5" },
      { filter: true, exepected: "true" },
      { filter: false, exepected: "false" },
      { filter: {}, exepected: "[object Object]" },
      { filter: "field", exepected: "field" },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ filter: item.filter as any }).filter).toBe(
        item.exepected
      );
    });
  });
});
