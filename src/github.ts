const AUTH_TOKEN = Deno.env.get("GITHUB_PERSONAL_ACCESS_TOKEN");

const REPOSITORY_OWNER = "hiromitsusasaki"
const REPOSITORY_NAME = "slackbot_for_devteam"

const WAIT_FOR_RELEASE = "リリース待ち"
const READY_FOR_REVIEW= "レビュー依頼"

const GetPulls = async () => {
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
  return await res.json();
}

export const RemindGithubPrReview = async () => {

  const pullRequests = await GetPulls();

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

export const RemindGithubPrWaitForRelease = async () => {
  const pullRequests = await GetPulls();
  const waitForReleasePullRequests: any[] = [];

  pullRequests.forEach((pullRequest: { labels: any[]; }) => {
    if (pullRequest.labels.map((label: { name: any; }) => label.name).includes(WAIT_FOR_RELEASE)) {
      waitForReleasePullRequests.push(pullRequest);
    }
  });

  const results: { title: any; url: any; assignees: any; }[] = [];

  waitForReleasePullRequests.forEach((pullRequest) => {
    results.push({
      title: pullRequest.title,
      url: pullRequest.html_url,
      assignees: pullRequest.assignees.map((assignee: { login: any; }) => assignee.login),
    })
  });

  return results;
}
