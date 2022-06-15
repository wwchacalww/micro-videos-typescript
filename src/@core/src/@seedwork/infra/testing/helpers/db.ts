import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const modelProps: SequelizeOptions = {
  dialect: "sqlite",
  host: ":memory:",
  logging: false,
};

export function setupSequelize(options: SequelizeOptions = {}) {
  let sequelize: Sequelize;

  beforeAll(
    () =>
      (sequelize = new Sequelize({
        ...modelProps,
        ...options,
      }))
  );
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
}
