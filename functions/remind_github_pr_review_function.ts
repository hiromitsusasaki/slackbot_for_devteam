import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackFunctionDefinition } from "https://deno.land/x/deno_slack_sdk@1.4.3/functions/mod";
import { RemindGithubPrReview } from "../src/github.ts";

export const RemindGithubPrReviewFunctionDefinition : SlackFunctionDefinition = DefineFunction({
  callback_id: "remind_github_pr_review_function",
  title: "Remind Github PR Review Function",
  description: "A function to remind Github PR Review",
  source_file: "functions/remind_github_pr_review_function.ts",
  input_parameters: undefined,
  output_parameters: {
    properties: {
      isSuccess: {
        type: Schema.types.boolean,
        description: "Is success",
      }
    },
    required: ["isSuccess"]
  },
});

export default SlackFunction(
  RemindGithubPrReviewFunctionDefinition,
  async ({ inputs, client }) => {
    const data = await RemindGithubPrReview();
    const isSuccess = true;
    return { outputs: { isSuccess: isSuccess, data: data } };
  },
);