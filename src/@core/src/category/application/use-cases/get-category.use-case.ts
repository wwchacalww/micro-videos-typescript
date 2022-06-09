import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace GetCategoryUseCase {
  export type Input = {
    id: string;
  };

  export type Output = CategoryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const category = await this.categoryRepo.findById(input.id);
      return CategoryOutputMapper.toOutput(category);
    }
  }
}

export default GetCategoryUseCase;
