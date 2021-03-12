from requests.models import Response
from api_client import ApiClient
from type.github import IGithubLatestReleases


class GitHub:
    repo_url: str
    user_name: str
    user_repo: str
    github_endpoint: str
    user_agent: str
    api_client: ApiClient

    def __init__(self, repo_url: str) -> None:
        self.repo_url = repo_url
        self.user_name = self.repo_url.split('/')[3]
        self.user_repo = self.repo_url.split('/')[4]
        self.github_endpoint = 'https://api.github.com'
        self.user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'

        self.api_client = ApiClient()

    def get_the_latest_release(self) -> IGithubLatestReleases:
        self.repo_url = f'{self.github_endpoint}/repos/{self.user_name}/{self.user_repo}/releases/latest'

        headers = {
            'User-Agent': self.user_agent
        }

        return self.api_client.get(self.repo_url, headers=headers).json()

    def get_tags(self) -> Response:
        self.repo_url = f'{self.github_endpoint}/repos/{self.user_name}/{self.user_repo}/tags'

        headers = {
            'User-Agent': self.user_agent
        }

        return self.api_client.get(self.repo_url, headers=headers).json()
