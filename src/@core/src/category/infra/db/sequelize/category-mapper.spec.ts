import { Category } from "#category/domain";
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain";
import { Sequelize } from "sequelize-typescript";
import { CategoryModelMapper } from "./category-mapper";
import { CategoryModel } from "./category-model";

describe("CategoryModelMapper Unit Tests", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      host: ":memory:",
      logging: false,
      models: [CategoryModel],
    });
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should throw error where category is invalid", () => {
    const model = CategoryModel.build({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("should throw loadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const error = new Error("generic error");
    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });
    const model = CategoryModel.build({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
    });

    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
  });

  it("should convert a model to entity", () => {
    const model = CategoryModel.build({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
      name: "Movie",
      description: "Movie category",
      is_active: false,
      created_at: new Date(),
    });
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: "Movie",
          description: "Movie category",
          is_active: false,
          created_at: model.created_at,
        },
        new UniqueEntityId("000a6c80-3659-44de-b763-29d53f0212a7")
      ).toJSON()
    );
  });
});
