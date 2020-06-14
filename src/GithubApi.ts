import { IGithubLatestReleases, ITags } from './dataStructure';
import { ApiClient } from './apiClient';


export class GithubApi {
  private repoUrl: string;
  private userName: string;
  private userRepo: string;
  private apiClient
  private githubApi: string = 'https://api.github.com';
  private userAgent: string =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

  constructor(repoUrl: string) {
    this.userName = repoUrl.split('/')[3];
    this.userRepo = repoUrl.split('/')[4];
    this.apiClient = new ApiClient()
  }
  async getTheLatestRelease(): Promise<IGithubLatestReleases> {
    const { githubApi, userName, userRepo, userAgent } = this;
    this.repoUrl = `${githubApi}/repos/${userName}/${userRepo}/releases/latest`;

    const options = {
      headers: {
        'User-Agent': userAgent,
      },
    };
    const request: Response = await this.apiClient.get(this.repoUrl, options);
    const data = await request.json() 
    return data;
  }

  async getTags(): Promise<ITags[]> {
    const { githubApi, userName, userRepo, userAgent } = this;
    this.repoUrl = `${githubApi}/repos/${userName}/${userRepo}/tags`;

    const options = {
      headers: {
        'User-Agent': userAgent,
      },
    };
    const request: Response = await this.apiClient.get(this.repoUrl, options);
    const data = await request.json() 

    return data
  }
}
