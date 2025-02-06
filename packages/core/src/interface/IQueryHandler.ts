import type { IQuery } from "./IQuery";

export interface IQueryHandler<T extends IQuery = any, R = any> {
  queryToHandler: string;
  execute(query: T): Promise<R>;
}
