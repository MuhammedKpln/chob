import { IGithubLatestReleases, ITags } from './dataStructure';
import { ApiClient } from './apiClient';

const apiClient = new ApiClient();
export class GithubApi {
  private repoUrl: string;
  private userName: string;
  private userRepo: string;
  private githubApi: string = 'https://api.github.com';
  private userAgent: string =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

  constructor(repoUrl: string) {
    this.userName = repoUrl.split('/')[3];
    this.userRepo = repoUrl.split('/')[4];
  }
  async getTheLatestRelease(): Promise<IGithubLatestReleases> {
    const { githubApi, userName, userRepo, userAgent } = this;
    this.repoUrl = `${githubApi}/repos/${userName}/${userRepo}/releases/latest`;

    const options = {
      url: this.repoUrl,
      headers: {
        'User-Agent': userAgent,
      },
    };
    const data: string = await apiClient.get(options);

    return JSON.parse(data);
  }

  async getTags(): Promise<ITags[]> {
    const { githubApi, userName, userRepo, userAgent } = this;
    this.repoUrl = `${githubApi}/repos/${userName}/${userRepo}/tags`;

    const options = {
      url: this.repoUrl,
      headers: {
        'User-Agent': userAgent,
      },
    };
    const data = await apiClient.get(options);

    return JSON.parse(data);
  }
}
