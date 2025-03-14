import { defineExtensionMessaging } from "@webext-core/messaging";
import type { IAuthMessaging } from "$service/messaging/auth-message.interface";
import { IWorkspaceMessaging } from "$service/messaging/workspace-message.interface";
import { IChatMessaging } from "$service/messaging/chat-message.interface";

interface ProtocalMap extends IAuthMessaging, IWorkspaceMessaging, IChatMessaging {}

const msg = defineExtensionMessaging<ProtocalMap>();
export default msg;
