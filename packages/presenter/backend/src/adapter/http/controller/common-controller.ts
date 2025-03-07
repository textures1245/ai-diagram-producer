import {
    controller,
    httpGet,
    request,
    response,
  } from "inversify-express-utils";
  import type { Request, Response } from "express";
  import { ok } from "../processor/resp";
  
  @controller("")
  export class CommonController {
    @httpGet("/hp")
    async healthCheck(@request() _req: Request, @response() res: Response) {
      return res.json(ok("Health Check", undefined));
    }
  }
  