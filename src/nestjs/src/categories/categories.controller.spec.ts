import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SortDirection } from '@fc/micro-videos/dist/@seedwork/domain/repository/repository-contracts';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '000a6c80-3659-44de-b763-29d53f0212a7',
      name: 'Movie',
      description: 'Movie Description',
      is_active: true,
      created_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'Movie Description',
      is_active: true,
    };
    const result = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(output).toStrictEqual(result);
  });
  it('should get a category', async () => {
    const id = '000a6c80-3659-44de-b763-29d53f0212a7';
    const output: CreateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'Movie Description',
      is_active: true,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['getUseCase'] = mockGetUseCase;

    const result = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(result);
  });
  it('should list categories', async () => {
    const id = '000a6c80-3659-44de-b763-29d53f0212a7';
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id,
          name: 'Movie Test',
          description: 'Movie Description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      per_page: 1,
      last_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc' as SortDirection,
      filter: 'test',
    };
    const result = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(output).toStrictEqual(result);
  });

  it('should update a category', async () => {
    const id = '000a6c80-3659-44de-b763-29d53f0212a7';
    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'Movie Description',
      is_active: true,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'Movie Description',
      is_active: true,
    };
    const result = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(output).toStrictEqual(result);
  });

  it('should delete a category', async () => {
    const id = '000a6c80-3659-44de-b763-29d53f0212a7';
    const output = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['deleteUseCase'] = mockDeleteUseCase;
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const result = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(result);
  });
});
