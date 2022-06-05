import { Category } from "category/domain/entities/category";
import CategoryRepository from "../../domain/repository/category.repository";

export type Input = {
  name: string;
  description: string;
  is_active: boolean;
};

export type Output = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
};

export default class CreateCategoryUseCase {
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
