import { ApiClient } from './apiClient';
import { IApiClient, IGithubApi, IGithubLatestReleases, ITags } from './dataStructure';

/**
 * Helper class for making github requests
 * @class GithubApi
 */
export class GithubApi implements IGithubApi {
  private repoUrl: string;
  private userName: string;
  private userRepo: string;
  private apiClient: IApiClient;
  private githubApi: string;
  private userAgent: string;

  constructor(repoUrl: string) {
    this.userName = repoUrl.split('/')[3];
    this.userRepo = repoUrl.split('/')[4];
    this.githubApi = 'https://api.github.com';
    this.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

    this.apiClient = new ApiClient();
  }

  public async getTheLatestRelease(): Promise<IGithubLatestReleases> {
    this.repoUrl = `${this.githubApi}/repos/${this.userName}/${this.userRepo}/releases/latest`;

    const options = {
      headers: {
        'User-Agent': this.userAgent,
      },
    };
    const request = await this.apiClient.get(this.repoUrl, options);

    return request.json();
  }

  public async getTags(): Promise<ITags[]> {
    this.repoUrl = `${this.githubApi}/repos/${this.userName}/${this.userRepo}/tags`;

    const options = {
      headers: {
        'User-Agent': this.userAgent,
      },
    };
    const request = await this.apiClient.get(this.repoUrl, options);

    return request.json();
  }
}
