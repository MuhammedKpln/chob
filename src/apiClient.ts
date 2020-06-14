import { errorMessage, successfullMessage } from './main';
const fetch = require('node-fetch').default
import {
  flathubStructure,
  snapStrucuure,
  appimageStructure,
} from './dataStructure';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { pipeline } from 'stream'
const streamPipeline = util.promisify(pipeline)



export class ApiClient {
  private flathubApi = 'https://flathub.org/api/v1/apps/';
  private snapApi =
    'https://raw.githubusercontent.com/MuhammedKpln/chob-snap-api/master/snapcraft.json';
  private appimageApi = 'https://appimage.github.io/feed.json';

  private flathubData;
  private snapData;
  private appimageData;

  async get(url: string, options: Object = {}): Promise<Response> {
    return new Promise(async (resolve, reject) => {
      const response: Response = await fetch(url, options)
      if (response.status !== 200) {
        return reject(response)
      }

      return resolve(response)
    });
  }

  async download(url: string, fileName: string): Promise<boolean> {
    const homeFolder = path.resolve(os.homedir(), 'chob');
    const filePath = path.resolve(
      homeFolder,
      `${fileName.toLowerCase()}.AppImage`,
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

    const response = await this.get(url)

    //@ts-ignore
    return streamPipeline(response.body, file).then(() => {
      successfullMessage(
        `Your download is finished, it is stored at ${filePath}`,
      );

      return true
    }).catch(() => {
      errorMessage('Could not download the app image.');
      return false
    })

  }

  grabDataFromFlathub(): Promise<flathubStructure[]> {
    return new Promise(async (resolve, reject) => {

      this.get(this.flathubApi).then(resp => {
        return resp.json()
      }).then(json => {
        this.flathubData = json
        return resolve(this.flathubData)
      }).catch(err => {
        return reject(err)
      })

    });
  }

  grabDataFromSnap(): Promise<snapStrucuure> {
    return new Promise((resolve, reject) => {

      this.get(this.snapApi).then(resp => {
        return resp.json()
      }).then(json => {
        this.snapData = json
        return resolve(this.snapData)
      }).catch(err => {
        return reject(err)
      })

    });
  }

  grabDataAppImage(): Promise<appimageStructure> {
    return new Promise((resolve, reject) => {

      this.get(this.appimageApi).then(resp => {
        return resp.json()
      }).then(json => {
        this.appimageData = json
        return resolve(this.appimageData)
      }).catch(err => {
        return reject(err)
      })

    });
  }
}
