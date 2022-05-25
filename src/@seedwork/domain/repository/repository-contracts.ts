import Entity from "../entity/entity";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

type SortDirection = "asc" | "desc";
export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams {
  protected _page: number;
  protected _per_page: number = 15;
  protected _sort: string | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: string | null;

  constructor(props: SearchProps = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }
  private set page(value: number) {}

  get per_page() {
    return this._per_page;
  }
  private set per_page(value: number) {}

  get sort() {
    return this._sort;
  }
  private set sort(value: string | null) {}

  get sort_dir() {
    return this._sort_dir;
  }
  private set sort_dir(value: SortDirection | null) {}

  get filter() {
    return this._filter;
  }
  private set filter(value: string | null) {}
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SearchOutput>;
}
