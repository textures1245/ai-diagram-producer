
import type { NextFunction, Response, Request } from "express";
import type { Logger } from "pino";


export class LogRequestMiddleware {
  constructor(
     private readonly logger: Logger
  ) {}

  domainInfoRequest(req: Request, res: Response, next: NextFunction) {
    // Extract request information
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get("user-agent") || "unknown";

    // Log the request information
    this.logger.info({
      method,
      url,
      ip,
      userAgent,
      requestId: req.headers["x-request-id"] || "",
      message: `${method} ${url}`,
    });

    next();
  }
}
