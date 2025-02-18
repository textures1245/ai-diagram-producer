export interface IRepository<T> {
  save(aggregateRoot: T, expectedVersion: number): void;
  getById(aggregateId: string): Promise<T>;
  getManyByDynamicQuery(field: string, aggregateId: string): Promise<T[]>;
}
