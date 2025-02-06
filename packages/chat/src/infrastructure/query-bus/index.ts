import type { IQuery, IQueryBus, IQueryHandler } from "@ai-ctx/core";

export class QueryBus<BaseQuery extends IQuery = IQuery>
  implements IQueryBus<BaseQuery>
{
  public handlers: Map<string, IQueryHandler<BaseQuery>> = new Map();

  public registerHandler(handlers: IQueryHandler<BaseQuery, any>): void {
    const queryName = handlers.queryToHandler;
    if (this.handlers.has(queryName)) {
      return;
    }
    this.handlers.set(queryName, handlers);
  }
  public async execute<T extends BaseQuery = BaseQuery, R = any>(query: T) {
    if (this.handlers.has(query.constructor.name)) {
      return (
        this.handlers.get(query.constructor.name) as IQueryHandler<BaseQuery>
      ).execute(query);
    }
  }
}
