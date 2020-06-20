import * as fs from 'fs';
import { FetchError, Response } from 'node-fetch';
import * as os from 'os';
import * as path from 'path';
import { pipeline } from 'stream';
import * as util from 'util';
import { CacheManager } from './cacheManager';
import { cacheFeature } from './cli';
import { IAppImage, IFlathub, IApiClient, ICacheManager, ISnap } from './dataStructure';
import { errorMessage, successfullMessage } from './helpers';

const fetch = require('node-fetch').default;


const streamPipeline = util.promisify(pipeline);

/**
 * A wrapper for node-fetch library.
 * @class ApiClient
 */
export class ApiClient implements IApiClient {
  private flathubApi: string;
  private snapApi: string;
  private appimageApi: string;

  private flathubData: IFlathub[];
  private snapData: ISnap;
  private appimageData: IAppImage;
  private cacheManager: ICacheManager;

  constructor() {
    this.cacheManager = new CacheManager();
    this.flathubApi = 'https://flathub.org/api/v1/apps/';
    this.snapApi = 'https://raw.githubusercontent.com/MuhammedKpln/chob/master/snapcraft.json';
    this.appimageApi = 'https://appimage.github.io/feed.json';


    if (cacheFeature && !this.cacheManager.hasCachedSources) {
      errorMessage('⚡ Could not find any cached sources, your search will be cached after this results.');
    }

  }

  public async get(url: string, options: Object = {}): Promise<Response> {
    return new Promise(async (resolve, reject) => {
      const response: Response = await fetch(url, options);
      if (response.status !== 200) {
        return reject(response);
      }

      return resolve(response);
    });
  }

  public async download(url: string, fileName: string): Promise<boolean> {
    const homeFolder = path.resolve(os.homedir(), 'chob');
    const filePath = path.resolve(
      homeFolder,
      `${fileName.toLowerCase()}`,
    );
    if (!fs.existsSync(homeFolder)) {
      fs.mkdirSync(path.resolve(os.homedir(), 'chob'));
    }

    if (fs.existsSync(filePath)) {
      errorMessage(`You already have downloaded this file in ${homeFolder}`);

      return false;
    }
    fs.writeFileSync(filePath, '');

    const file = fs.createWriteStream(filePath);

    const response = await this.get(url);

    return streamPipeline(response.body, file).then(() => {
      successfullMessage(
        `Your download is finished, it is stored at ${filePath}`,
      );

      return true;
    }).catch(() => {
      errorMessage('Could not download the app image.');

      return false;
    });

  }

  public grabDataFromFlathub(): Promise<IFlathub[]> {
    return new Promise(async (resolve, reject) => {

      if (cacheFeature && this.cacheManager.hasCachedSources) {
        const { flathubData } = this.cacheManager.getSourcesFromCache();

        return resolve(flathubData);
      }

      this.get(this.flathubApi).then((resp: Response) => {
        return resp.json();
      }).then((json: IFlathub[]) => {
        this.flathubData = json;

        return resolve(this.flathubData);
      }).catch((err: FetchError) => {
        return reject(err);
      });

    });
  }

  public grabDataFromSnap(): Promise<ISnap> {
    return new Promise<ISnap>((resolve, reject) => {

      if (cacheFeature && this.cacheManager.hasCachedSources) {
        const { snapData } = this.cacheManager.getSourcesFromCache();

        return resolve(snapData);
      }

      this.get(this.snapApi).then((resp: Response) => {
        return resp.json();
      }).then((json: ISnap) => {
        this.snapData = json;

        return resolve(this.snapData);
      }).catch((err: FetchError) => {
        return reject(err);
      });

    });
  }

  public grabDataAppImage(): Promise<IAppImage> {
    return new Promise((resolve, reject) => {
      if (cacheFeature && this.cacheManager.hasCachedSources) {
        const { appimageData } = this.cacheManager.getSourcesFromCache();

        return resolve(appimageData);
      }

      this.get(this.appimageApi).then((resp: Response) => {
        return resp.json();
      }).then((json: IAppImage) => {
        this.appimageData = json;

        return resolve(this.appimageData);
      }).catch((err: FetchError) => {
        return reject(err);
      });

    });
  }
}
