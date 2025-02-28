import { defineExtensionMessaging } from "@webext-core/messaging";
import type { IAuthMessaging } from "../service/messaging/auth-service.interface";

interface ProtocalMap extends IAuthMessaging {}

const msg = defineExtensionMessaging<ProtocalMap>();
export default msg;
