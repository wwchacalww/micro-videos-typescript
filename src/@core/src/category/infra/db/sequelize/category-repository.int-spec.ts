import { Category, CategoryRepository } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import _chance from "chance";
import { CategorySequelize } from "./category-sequelize";

const {
  CategoryModel,
  CategoryModelMapper,
  CategoryRepository: CategorySequelizeRepository,
} = CategorySequelize;
const chance = _chance();

describe("CategorySequelizeRepository Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelize.CategoryRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should inserts a new entity", async () => {
    let category = new Category({ name: "Movie" });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "Movie",
      description: "Movie category",
      is_active: false,
    });
    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );
    await expect(
      repository.findById(
        new UniqueEntityId("817e1ac6-23bf-482b-8fdf-0b5abd46afd9")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID 817e1ac6-23bf-482b-8fdf-0b5abd46afd9`
      )
    );
  });

  it("should find an entity by id", async () => {
    const entity = new Category({ name: "Movie Test" });
    await repository.insert(entity);
    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should find all entities", async () => {
    const entity = new Category({ name: "Movie 1" });
    await repository.insert(entity);
    const entity2 = new Category({ name: "Movie 2" });
    await repository.insert(entity2);
    const entities = await repository.findAll();
    expect(entities.length).toBe(2);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity, entity2]));
  });

  it("should throw error on update when a entity not found", async () => {
    const entity = new Category({ name: "Movie 1" });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.uniqueEntityId}`)
    );
  });

  it("should update an entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    entity.update("Movie updated", entity.description);
    await repository.update(entity);
    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw error on delete when a entity not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    );

    await expect(
      repository.delete("36d4b350-b016-4de1-ac7b-07c40b18af28")
    ).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID 36d4b350-b016-4de1-ac7b-07c40b18af28`
      )
    );
  });

  it("should delete an entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    await repository.delete(entity.id);
    const entityFound = await CategoryModel.findByPk(entity.id);

    expect(entityFound).toBeNull();
  });

  describe("search method test", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "Movie",
          description: "Movie category",
          is_active: true,
          created_at,
        }));
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: "Movie category",
          is_active: true,
          created_at,
        })
      );
    });

    it("should order by created_at DESC when seach param are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie ${index}`,
          description: "Movie category",
          is_active: true,
          created_at: new Date(created_at.getTime() + 1000 * index),
        }));
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      searchOutput.items.reverse().forEach((item, index) => {
        expect(`Movie ${index + 1}`).toBe(item.name);
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "banana", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Amora", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Abelha", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "BANANA", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Abacaxi", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "BAnaNa", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Acerola", ...defaultProps },
      ];
      const categories = await CategoryModel.bulkCreate(categoriesProps);
      let result = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: "BANANA",
        })
      );
      expect(result.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategoryModelMapper.toEntity(categories[0]),
            CategoryModelMapper.toEntity(categories[3]),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "BANANA",
        }).toJSON(true)
      );

      result = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          filter: "BANANA",
        })
      );
      expect(result.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [CategoryModelMapper.toEntity(categories[5])],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "BANANA",
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "Cebola", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Amora", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Abelha", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Maracujá", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Cenoura", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Goiaba", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Acerola", ...defaultProps },
      ];
      const categories = await CategoryModel.bulkCreate(categoriesProps);

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[2]),
              CategoryModelMapper.toEntity(categories[6]),
            ],
            total: 7,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[1]),
              CategoryModelMapper.toEntity(categories[0]),
            ],
            total: 7,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[3]),
              CategoryModelMapper.toEntity(categories[5]),
            ],
            total: 7,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[4]),
              CategoryModelMapper.toEntity(categories[0]),
            ],
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
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe("should apply paginate, filter and sort", () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "cebola", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Amora", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "CeBOLa", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Maracujá", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "CEBOLA", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Goiaba", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "Acerola", ...defaultProps },
      ];
      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "CEBOLA",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProps[4]),
              new Category(categoriesProps[2]),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "CEBOLA",
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "CEBOLA",
          }),
          result: new CategoryRepository.SearchResult({
            items: [new Category(categoriesProps[0])],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "CEBOLA",
          }),
        },
      ];
      beforeEach(async () => {
        await CategoryModel.bulkCreate(categoriesProps);
      });
      test.each(arrange)("when value is %j", async ({ params, result }) => {
        let search_result = await repository.search(params);
        expect(search_result.toJSON(true)).toMatchObject(result.toJSON(true));
      });
      for (const i of arrange) {
      }
    });
  });
});
