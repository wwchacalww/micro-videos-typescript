import CategoryRepository from "../../domain/repository/category.repository";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  id: string;
};

export type Output = void;

export default class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    await this.categoryRepo.findById(input.id);
    await this.categoryRepo.delete(input.id);
  }
}
