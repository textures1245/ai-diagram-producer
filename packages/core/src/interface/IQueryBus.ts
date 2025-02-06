import type { IQuery } from "./IQuery";
import type { IQueryHandler } from "./IQueryHandler";

export interface IQueryBus<BaseQuery extends IQuery = IQuery> {
  registerHandler(queryHandler: IQueryHandler<BaseQuery>): void;
  execute<T extends BaseQuery = BaseQuery, R = any>(query: T): Promise<R>;
}
