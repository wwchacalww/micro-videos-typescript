import { Category, CategoryProperties } from "./category";
import { omit } from "lodash";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });
  test("Constructor of category", () => {
    let category = new Category({ name: "Movie" });
    let props = omit(category.props, "created_at");
    expect(Category.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "Movie",
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      description: "Comédia",
      is_active: false,
    });
    let created_at = new Date();
    expect(category.props).toStrictEqual({
      name: "Movie",
      description: "Comédia",
      is_active: false,
      created_at,
    });

    category = new Category({
      name: "Bee Movie",
      description: "Other description",
    });
    expect(category.props).toMatchObject({
      name: "Bee Movie",
      description: "Other description",
    });

    category = new Category({
      name: "Bee Movie",
      is_active: true,
    });
    expect(category.props).toMatchObject({
      name: "Bee Movie",
      is_active: true,
    });

    category = new Category({
      name: "Bee Movie",
      created_at,
    });
    expect(category.props).toMatchObject({
      name: "Bee Movie",
      created_at,
    });
  });

  test("id prop", () => {
    type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
    const data: CategoryData[] = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      {
        props: { name: "Movie" },
        id: new UniqueEntityId(),
      },
    ];

    data.forEach((idTest) => {
      const category = new Category(idTest.props, idTest.id);
      expect(category.id).not.toBeNull();
    });
  });

  test("getter of name props", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");
  });

  test("getter and setter of description props", () => {
    let category = new Category({
      name: "Movie",
      description: "Terror",
    });
    expect(category.description).toBe("Terror");

    category = new Category({
      name: "Movie",
    });
    expect(category.description).toBeNull();
    category["description"] = "Comédia";
    expect(category.description).toBe("Comédia");
    category["description"] = undefined;
    expect(category.description).toBeNull();
  });

  test("getter and setter of is_ative props", () => {
    let category = new Category({
      name: "Movie",
    });
    expect(category.is_active).toBeTruthy();
    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.is_active).toBeTruthy();
    category = new Category({
      name: "Movie",
      is_active: false,
    });
    expect(category.is_active).toBeFalsy();
  });

  test("getter of created_at prop", () => {
    let category = new Category({
      name: "Movie",
    });
    expect(category.created_at).toBeInstanceOf(Date);
    let created_at = new Date();
    category = new Category({
      name: "Movie",
      created_at,
    });
    expect(category.created_at).toBe(created_at);
  });

  it("should update a category", () => {
    const category = new Category({
      name: "Movie",
      description: "Terror Movie",
    });
    category.update("Documentary", "Some Documentary");
    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(category.name).toBe("Documentary");
    expect(category.description).toBe("Some Documentary");
  });

  it("should activate a category", () => {
    const category = new Category({
      name: "Movie",
      description: "Terror Movie",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  it("should desactivate a category", () => {
    const category = new Category({
      name: "Movie",
      description: "Terror Movie",
      is_active: true,
    });
    category.desactivate();
    expect(category.is_active).toBeFalsy();
  });
});
