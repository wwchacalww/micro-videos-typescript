import CategoryRepository from "../../domain/repository/category.repository";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  id: string;
};

export default class DeleteCategoryUseCase implements UseCase<Input, void> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<void> {
    await this.categoryRepo.delete(input.id);
  }
}
