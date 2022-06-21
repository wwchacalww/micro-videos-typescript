import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import _chance from "chance";
import { validate as uuidValidate } from "uuid";
import { setupSequelize } from "../testing/helpers/db";

const chance = _chance();
@Table({ tableName: "stubs", timestamps: false })
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4 })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
  }
}

describe("SequelizeModelFactory Unit Tests", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeDefined();
    expect(model.name).not.toBeNull();
    expect(model.id).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();
    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toEqual(modelFound.id);

    model = await StubModel.factory().create({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
      name: "Test",
    });
    expect(uuidValidate(model.id)).toBeDefined();
    expect(model.name).toBe("Test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    modelFound = await StubModel.findByPk(model.id);
    expect(modelFound.id).toEqual("000a6c80-3659-44de-b763-29d53f0212a7");
  });

  test("make method", async () => {
    let model = await StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeDefined();
    expect(model.name).not.toBeNull();
    expect(model.id).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    model = await StubModel.factory().make({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
      name: "Test",
    });
    expect(model.id).toEqual("000a6c80-3659-44de-b763-29d53f0212a7");
    expect(model.name).toBe("Test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });
});
