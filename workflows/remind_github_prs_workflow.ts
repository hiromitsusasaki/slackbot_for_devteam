import {
  DefineWorkflow,
  Schema,
} from "deno-slack-sdk/mod.ts";
import { RemindGithubPrReviewFunctionDefinition } from "../functions/remind_github_pr_review_function.ts";

const RemindGithubPrsWorkflow = DefineWorkflow({
  callback_id: "remind_github_prs_workflow",
  title: "Remind Github PRs Workflow",
  description: "A workflow to remind Github PRs",
  input_parameters: {
    properties: {
      channelId: {
        type: Schema.slack.types.channel_id,
      },
      channelName: {
        type: Schema.types.string,
      },
      userId: {
        type: Schema.slack.types.user_id,
      },
      text: {
        type: Schema.types.string,
      },
    },
    required: ["channelId", "channelName", "userId", "text"],
  },
});

const RemindGithubPrReview = RemindGithubPrsWorkflow.addStep(
  RemindGithubPrReviewFunctionDefinition,
  {
    source_message: RemindGithubPrsWorkflow.inputs.text,
  }
)

RemindGithubPrsWorkflow.addStep(
  Schema.slack.functions.SendMessage,
  {
    channel_id: RemindGithubPrsWorkflow.inputs.channelId,
    message: RemindGithubPrReview.outputs.result,
  },
);

export default RemindGithubPrsWorkflow;
