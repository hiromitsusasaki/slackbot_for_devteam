import { Trigger } from "deno-slack-api/types.ts";
import RemindGithubPrsWorkflow from "../workflows/remind_github_prs_workflow.ts";

const onDemandRemindGithubTrigger : Trigger<typeof RemindGithubPrsWorkflow.definition> = {
  type: "event",
  name: "On demand remind github trigger",
  description: "A trigger that reminds you to check github",
  workflow: "#/workflows/remind_github_prs_workflow",
  event: {
    event_type: "slack#/events/app_mentioned",
    channel_ids: ["C01SRDA052A"]
  },
  inputs: {
    channelId: {
      value: "{{data.channel_id}}"
    },
    channelName: {
      value: "{{data.channel_name}}"
    },
    userId: {
      value: "{{data.user_id}}"
    },
    text: {
      value: "{{data.text}}"
    },
  },
};

export default onDemandRemindGithubTrigger;