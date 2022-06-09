import { Category } from "../../domain/entities/category";
import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace CreateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const category = new Category(input);
      await this.categoryRepo.insert(category);
      return CategoryOutputMapper.toOutput(category);
    }
  }

  export type Input = {
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;
}

export default CreateCategoryUseCase;
