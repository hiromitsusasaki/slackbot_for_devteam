import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const RemindGithubPrReviewFunctionDefinition = DefineFunction({
  callback_id: "remind_github_pr_review_function",
  title: "Remind Github PR Review Function",
  description: "A function to remind Github PR Review",
  source_file: "functions/remind_github_pr_review_function.ts",
  input_parameters: {
    properties: {
      source_message: {
        type: Schema.types.string,
        description: "Source message text"
      }
    },
    required: ["source_message"]
  },
  output_parameters: {
    properties: {
      result: {
        type: Schema.types.string,
        description: "Remind Github PR Review Result",
      }
    },
    required: ["result"]
  },
});

const RemindGithubPrReview = async (env: any) => {
  const AUTH_TOKEN = env.GITHUB_PERSONAL_ACCESS_TOKEN

  const REPOSITORY_OWNER = "hiromitsusasaki"
  const REPOSITORY_NAME = "slackbot_for_devteam"

  const READY_FOR_REVIEW= "レビュー依頼"

  const apiUrl = "https://api.github.com"
  const apiResource = `repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/pulls`

  const requestUrl = `${apiUrl}/${apiResource}`
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${AUTH_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28"
  }

  const req = new Request(requestUrl, { headers: headers })
  const res = await fetch(req);
  const pullRequests = await res.json();

  const readyForReviewPullRequests: any[] = [];

  pullRequests.forEach((pullRequest: { labels: any[]; }) => {
    if (pullRequest.labels.map((label: { name: any; }) => label.name).includes(READY_FOR_REVIEW)) {
      readyForReviewPullRequests.push(pullRequest);
    }
  });

  const results: { title: any; url: any; reviewers: any; }[] = [];

  readyForReviewPullRequests.forEach((pullRequest) => {
    results.push({
      title: pullRequest.title,
      url: pullRequest.html_url,
      reviewers: pullRequest.requested_reviewers.map((requested_reviewer: { login: any; }) => requested_reviewer.login),
    })
  });

  return results;
}

export default SlackFunction(
  RemindGithubPrReviewFunctionDefinition,
  async ({inputs, env}) => {


    console.log(inputs.source_message)
    const resultArray = await RemindGithubPrReview(env);
    let result = ""
    if (resultArray.length === 0) {
      result = "No PRs to review";
    } else {
      result = "The following PRs need to be reviewed:\n";
      resultArray.forEach((resultItem) => {
        result += resultItem.title + "\n" + resultItem.url + "\n" + "reviewers: " + resultItem.reviewers.join(", ") + "\n\n";
      });
    }
    return { outputs: { result } };
  },
);
