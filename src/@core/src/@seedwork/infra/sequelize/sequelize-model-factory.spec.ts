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
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory
    );
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

  test("bulkCreate method using count= 1", async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(models[0].name).not.toBeNull();
    expect(models[0].id).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound.id);
    expect(models[0].name).toEqual(modelFound.name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
      name: "Test",
    }));
    expect(models[0].id).toEqual("000a6c80-3659-44de-b763-29d53f0212a7");
    expect(models[0].name).toEqual("Test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound.id);
    expect(models[0].name).toEqual(modelFound.name);
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);
    expect(models[0].name).not.toBeNull();
    expect(models[0].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound1.id);
    expect(models[0].name).toEqual(modelFound1.name);
    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toEqual(modelFound2.id);
    expect(models[1].name).toEqual(modelFound2.name);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: "Test",
      }));
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toEqual("Test");
    expect(models[1].name).toEqual("Test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });

  test("bulkMake method using count= 1", async () => {
    let models = await StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(models[0].name).not.toBeNull();
    expect(models[0].id).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound.id);
    expect(models[0].name).toEqual(modelFound.name);

    models = await StubModel.factory().bulkMake(() => ({
      id: "000a6c80-3659-44de-b763-29d53f0212a7",
      name: "Test",
    }));
    expect(models[0].id).toEqual("000a6c80-3659-44de-b763-29d53f0212a7");
    expect(models[0].name).toEqual("Test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound.id);
    expect(models[0].name).toEqual(modelFound.name);
  });

  test("bulkMake method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);
    expect(models[0].name).not.toBeNull();
    expect(models[0].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    let modelFound1 = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toEqual(modelFound1.id);
    expect(models[0].name).toEqual(modelFound1.name);
    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[1].id).toEqual(modelFound2.id);
    expect(models[1].name).toEqual(modelFound2.name);

    models = await StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: chance.guid({ version: 4 }),
        name: "Test",
      }));
    expect(models[0].id).not.toBe(models[1].id);
    expect(models[0].name).toEqual("Test");
    expect(models[1].name).toEqual("Test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });
});
