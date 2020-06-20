import * as pkg from '../package.json';
import { ApiClient } from './apiClient';
import { IApiClient, IGithubApi, IGithubLatestReleases } from './dataStructure';
import { GithubApi } from './GithubApi';
import { infoMessage } from './helpers';


/**
 * A utility to check if application is up-to-dated.
 * @class UpdateManager
 *
 */
export class UpdateManager {

  private ghApi: IGithubApi;
  private apiClient: IApiClient;
  private latestRelease: IGithubLatestReleases;

  constructor() {
    this.ghApi = new GithubApi('https://github.com/muhammedkpln/chob');
    this.apiClient = new ApiClient();
  }

  public async isUpdated(): Promise<boolean> {
    this.latestRelease = await this.ghApi.getTheLatestRelease();

    if (this.latestRelease.tag_name !== pkg.version && !this.latestRelease.prerelease) {
      return false;
    }

    return true;
  }

  public async updateChob(): Promise<boolean> {
    const assets = this.latestRelease.assets;

    for (const asset of assets) {
      if (asset.name === 'chob') {
        try {
          infoMessage('Downloading latest release of chob.')
          await this.apiClient.download(asset.browser_download_url, 'chob');

          return true;
        } catch (e) {
          console.log(e);

          return false;
        }
      } else {
        return false;
      }
    }

    return false
  }


}
