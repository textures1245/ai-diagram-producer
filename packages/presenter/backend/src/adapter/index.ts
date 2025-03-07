import * as dotenv from "dotenv";
dotenv.config();
import "@adapter/http/controller/index";
import { adapterInitialize } from "./http";
import "reflect-metadata";

(async () => {
    await adapterInitialize()
})()