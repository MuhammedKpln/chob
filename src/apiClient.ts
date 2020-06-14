import { errorMessage, successfullMessage } from './main';
import * as request from 'request';
import {
  flathubStructure,
  snapStrucuure,
  appimageStructure,
} from './dataStructure';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export class ApiClient {
  private flathubApi = 'https://flathub.org/api/v1/apps/';
  private snapApi =
    'https://raw.githubusercontent.com/MuhammedKpln/chob-snap-api/master/snapcraft.json';
  private appimageApi = 'https://appimage.github.io/feed.json';

  private flathubData;
  private snapData;
  private appimageData;

  async get(url: string | Object): Promise<any> {
    return new Promise( async (resolve, reject) => {
      request.get(url, (error, response, body) => {
        if (error && response.statusCode !== 200) {
          return reject(error);
        }

        return resolve(body);
      });
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

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
    } else {
      errorMessage(`You already have downloaded this file in ${homeFolder}`);
      return false;
    }
    const file = fs.createWriteStream(filePath);

    request
      .get({
        url: url,
        followAllRedirects: true,
      })
      .pipe(file)
      .on('finish', () => {
        successfullMessage(
          `Your download is finished, it is stored at ${filePath}`,
        );
        return true;
      })
      .on('error', e => {
        errorMessage('Could not download the app image.');
        console.error(e);
        return false;
      });

    return true;
  }

  grabDataFromFlathub(): Promise<flathubStructure[]> {
    return new Promise((resolve, reject) => {
      request.get(this.flathubApi, (error, response, body) => {
        if (error && response.statusCode !== 200) {
          return reject(error);
        }

        this.flathubData = JSON.parse(body);
        return resolve(this.flathubData);
      });
    });
  }

  grabDataFromSnap(): Promise<snapStrucuure> {
    return new Promise((resolve, reject) => {
      request.get(this.snapApi, (error, response, body) => {
        if (error && response.statusCode !== 200) {
          return reject(error);
        }

        this.snapData = JSON.parse(body);
        return resolve(this.snapData);
      });
    });
  }

  grabDataAppImage(): Promise<appimageStructure> {
    return new Promise((resolve, reject) => {
      request.get(this.appimageApi, (error, response, body) => {
        if (error && response.statusCode !== 200) {
          return reject(error);
        }

        this.appimageData = JSON.parse(body);
        return resolve(this.appimageData);
      });
    });
  }
}
