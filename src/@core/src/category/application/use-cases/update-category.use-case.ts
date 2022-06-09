import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace UpdateCategoryUseCase {
  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id);
      entity.update(input.name, input.description);
      if (input.is_active === true) {
        entity.activate();
      }
      if (input.is_active === false) {
        entity.desactivate();
      }

      await this.categoryRepo.update(entity);
      return CategoryOutputMapper.toOutput(entity);
    }
  }
}

export default UpdateCategoryUseCase;
