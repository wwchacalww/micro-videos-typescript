import { Category } from "../../domain/entities/category";
import { CategoryOutputMapper } from "./category-output";

describe("CategoryOutputMapper", () => {
  it("should convert a category in output", () => {
    const created_at = new Date();
    const entity = new Category({
      name: "Movie",
      description: "Movie category",
      is_active: false,
      created_at,
    });
    const spyToJSON = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.id,
      name: "Movie",
      description: "Movie category",
      is_active: false,
      created_at,
    });
  });
});
