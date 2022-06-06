import { Category } from "../../domain/entities/category";
import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput } from "../dto/category-output.dto";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;

export default class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    const category = new Category(input);
    await this.categoryRepo.insert(category);
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
