import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput } from "../dto/category-output.dto";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  id: string;
};

export type Output = CategoryOutput;

export default class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    const category = await this.categoryRepo.findById(input.id);
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
