import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import uniqueEntityIdVo from "../value-objects/unique-entity-id.vo";
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
} from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string | uniqueEntityIdVo): Promise<E> {
    const _id = `${id}`;
    return this._get(_id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const indexFound = this.items.findIndex((item) => item.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: string | uniqueEntityIdVo): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    const indexFound = this.items.findIndex((item) => item.id === _id);
    this.items.splice(indexFound, 1);
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundError(`Entity not found using ID ${id}`);
    }
    return item;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  search(props: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
