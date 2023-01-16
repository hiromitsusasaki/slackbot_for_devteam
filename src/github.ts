import { Octokit, App } from "https://cdn.skypack.dev/octokit?dts";

const octokit = new Octokit({auth: Deno.env.get("GITHUB_PERSONAL_ACCESS_TOKEN")});

const REPOSITORY_OWNER = "hiromitsusasaki"
const REPOSITORY_NAME = "sharinglist_rails"

const WAIT_FOR_RELEASE = "リリース待ち"
const READY_FOR_REVIEW= "レビュー依頼"


export const RemindGithubPrReview = async () => {
  const { data: pullRequests } = await octokit.rest.pulls.list({
    owner: REPOSITORY_OWNER,
    repo: REPOSITORY_NAME,
    state: 'open',
  });

  const readyForReviewPullRequests = [];

  pullRequests.forEach((pullRequest) => {
    if (pullRequest.labels.map((label) => label.name).includes(READY_FOR_REVIEW)) {
      readyForReviewPullRequests.push(pullRequest);
    }
  });

  const results = [];

  readyForReviewPullRequests.forEach((pullRequest) => {
    results.push({
      title: pullRequest.title,
      url: pullRequest.html_url,
      assignees: pullRequest.assignees.map((assignee) => assignee.login),
    })
  });

  return results;
}

export const RemindGithubPrWaitForRelease = async () => {
  const { data: pullRequests } = await octokit.rest.pulls.list({
    owner: REPOSITORY_OWNER,
    repo: REPOSITORY_NAME,
    state: 'open',
  });

  const waitForReleasePullRequests = [];

  pullRequests.forEach((pullRequest) => {
    if (pullRequest.labels.map((label) => label.name).includes(WAIT_FOR_RELEASE)) {
      waitForReleasePullRequests.push(pullRequest);
    }
  });

  const results = [];

  waitForReleasePullRequests.forEach((pullRequest) => {
    results.push({
      title: pullRequest.title,
      url: pullRequest.html_url,
      assignees: pullRequest.assignees.map((assignee) => assignee.login),
    })
  });

  return results;
}
