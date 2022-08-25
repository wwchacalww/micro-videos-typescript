import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { CATEGORIES_PROVIDERS } from '../../categories.providers';
import { CategoriesModule } from '../../categories.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesController } from '../../categories.controller';

describe('CategoriesController integration test', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({}), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
  });

  const arrange = [
    {
      request: {
        name: 'Filme teste',
      },
      expectOutput: {
        name: 'Filme teste',
        description: null,
        is_active: true,
      },
    },
    {
      request: {
        name: 'Filme teste',
        description: 'terror',
      },
      expectOutput: {
        name: 'Filme teste',
        description: 'terror',
        is_active: true,
      },
    },
    {
      request: {
        name: 'Filme teste',
        description: 'terror',
        is_active: false,
      },
      expectOutput: {
        name: 'Filme teste',
        description: 'terror',
        is_active: false,
      },
    },
    {
      request: {
        name: 'Filme teste',
        is_active: false,
      },
      expectOutput: {
        name: 'Filme teste',
        description: null,
        is_active: false,
      },
    },
  ];

  test.each(arrange)(
    'with request $request',
    async ({ request, expectOutput }) => {
      const output = await controller.create(request);
      const entity = await repository.findById(output.id);

      expect(entity).toMatchObject({
        id: output.id,
        name: request.name,
        description: output.description,
        is_active: output.is_active,
        created_at: output.created_at,
      });

      expect(output.id).toBe(entity.id);
      expect(output.name).toBe(expectOutput.name);
      expect(output.description).toBe(expectOutput.description);
      expect(output.is_active).toBe(expectOutput.is_active);
      expect(output.created_at).toStrictEqual(entity.created_at);
    },
  );
});
