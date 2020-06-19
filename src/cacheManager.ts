import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  IAppImage,
  IFlathub,
  ICacheManager,
  IConfig,
  IUpdateCacheObject,
  ISnap,
} from './dataStructure';
import { successfullMessage } from './helpers';


/**
 * Cache helper class for managing the cache
 * @class CacheManager
 */
export class CacheManager implements ICacheManager {

  public isCacheEnabled: boolean;
  public hasCachedSources: boolean;
  private readonly cacheLocation: string;
  private readonly flathubCachePath: string;
  private readonly snapCachePath: string;
  private readonly appimageCachePath: string;
  private readonly updatedAtFilePath: string;
  private readonly updateCacheInterval: number;
  private readonly configPath: string;
  private readonly config: IConfig;



  constructor() {
    this.cacheLocation = path.resolve(os.homedir(), 'chob');
    this.flathubCachePath = path.resolve(this.cacheLocation, '.flathub.json');
    this.snapCachePath = path.resolve(this.cacheLocation, '.snap.json');
    this.appimageCachePath = path.resolve(this.cacheLocation, '.appimage.json');
    this.updatedAtFilePath = path.resolve(this.cacheLocation, '.updatedAt');
    this.configPath = path.resolve(this.cacheLocation, 'config.json');


    if (!fs.existsSync(this.cacheLocation)) {
      fs.mkdirSync(this.cacheLocation);
    }

    if (!this.checkCacheFiles()) {
      this.createCacheFiles();
    }

    this.config = this.parseConfig();
    this.isCacheEnabled = this.config.cacheEnabled;
    this.updateCacheInterval = this.config.chacheUpdateInterval || 1;


    this.hasCachedSources = this.checkHasCachedSources();


  }

  public updateInterval(interval: number): boolean {
    this.config.chacheUpdateInterval = interval;

    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config));

      return true;
    } catch (err) {
      return false;
    }
  }

  public updateCacheStatment(statment: boolean): boolean {
    this.config.cacheEnabled = statment;
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config));
      return true;
    } catch (err) {
      return false;
    }
  }

  public getSourcesFromCache(): IUpdateCacheObject {
    const flathubData: IFlathub[] = JSON.parse(fs.readFileSync(this.flathubCachePath).toString());
    const snapData: ISnap = JSON.parse(fs.readFileSync(this.snapCachePath).toString());
    const appimageData: IAppImage = JSON.parse(fs.readFileSync(this.appimageCachePath).toString());

    return {
      flathubData,
      snapData,
      appimageData,
    };
  }


  public updateCache(data: IUpdateCacheObject): boolean | Error {
    try {
      const { flathubData, snapData, appimageData } = data;

      fs.writeFileSync(this.flathubCachePath, JSON.stringify(flathubData));
      fs.writeFileSync(this.snapCachePath, JSON.stringify(snapData));
      fs.writeFileSync(this.appimageCachePath, JSON.stringify(appimageData));
      fs.writeFileSync(this.updatedAtFilePath, Date.now().toString());

      successfullMessage('⚡ Created cache, your results will now pull from cached sources! ⚡');

      return true;

    } catch (err) {
      throw new Error(err);
    }
  }

  public shouldUpdateCache() {
    const date = Number(fs.readFileSync(this.updatedAtFilePath).toString());
    const tomorrowDate = new Date(date).setDate(new Date(date).getDate() + this.updateCacheInterval);

    if (!date) {
      return true;
    }

    if (tomorrowDate < Date.now()) {
      return true;
    }

    return false;


  }

  private parseConfig(): IConfig {
    const configFile = fs.readFileSync(this.configPath).toString();

    return JSON.parse(configFile);
  }

  private checkHasCachedSources(): boolean {
    const flathubData: IFlathub[] = JSON.parse(fs.readFileSync(this.flathubCachePath).toString());

    if (Object.keys(flathubData).length > 0) {
      return true;
    }

    return false;

  }

  private checkCacheFiles(): boolean {
    const flathubFile = fs.existsSync(this.flathubCachePath);
    const snapFile = fs.existsSync(this.snapCachePath);
    const appimageFile = fs.existsSync(this.appimageCachePath);
    const updateFile = fs.existsSync(this.updatedAtFilePath);
    const configPath = fs.existsSync(this.configPath);

    if (flathubFile && snapFile && appimageFile && updateFile && configPath) {
      return true;
    }

    return false;

  }

  private createCacheFiles(): boolean | Error {
    try {
      const data = JSON.stringify({});
      fs.writeFileSync(this.flathubCachePath, data);
      fs.writeFileSync(this.snapCachePath, data);
      fs.writeFileSync(this.appimageCachePath, data);
      fs.writeFileSync(this.updatedAtFilePath, '');
      fs.writeFileSync(this.configPath, data);


      return true;
    } catch (err) {
      throw new Error('Could not create cache files!');
    }
  }


}
