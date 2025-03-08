import { guard } from "$lib/guard";
import AuthPage from "@/routes/auth.page.svelte";
import ChatPage from "@/routes/workspace/[workspace-id]/chat.page.svelte";
import WorkspaceLayout from "@/routes/workspace/workspace.layout.svelte";

// export const routes = [
//   {
//     name: "/",
//     component: AuthPage,
//   },
//   {
//     name: "/chat",
//     layout: WorkspaceLayout,
//     onlyIf: { guard, redirect: "/" },
//     nestedRoutes: [
//       {
//         name: ":id",
//         component: ChatPage,
//         onlyIf: { guard, redirect: "/" },
//       },
//     ],
//   },
// ];

export const routes = {
  "/": AuthPage,
  "/workspace": WorkspaceLayout,
  "/workspace/:workspaceId": ChatPage,
};
