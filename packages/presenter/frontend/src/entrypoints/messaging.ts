import { defineExtensionMessaging } from "@webext-core/messaging";
import type { IAuthMessaging } from "$service/messaging/auth-message.interface";

interface ProtocalMap extends IAuthMessaging {}

const msg = defineExtensionMessaging<ProtocalMap>();
export default msg;
