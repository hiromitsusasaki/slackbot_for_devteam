import { Manifest } from "deno-slack-sdk/mod.ts";
import RemindGithubPrsWorkflow from "./workflows/remind_github_prs_workflow.ts";

export default Manifest({
  name: "slackbot_for_devteam",
  description: "Useful chatbot for devteam on Slack",
  icon: "assets/default_new_app_icon.png",
  workflows: [RemindGithubPrsWorkflow],
  outgoingDomains: ["github.com", "api.github.com"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "app_mentions:read",
  ],
});
