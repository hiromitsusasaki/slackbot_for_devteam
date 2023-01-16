import {
  DefineWorkflow,
  Schema,
} from "deno-slack-sdk/mod.ts";

const RemindGithubPrReviewW = DefineWorkflow({
  callback_id: "remind_github_pr_review_workflow",
  title: "Remind Github PR Review Workflow",
  description: "A workflow to remind Github PR Review",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user", "interactivity"],
  },
});