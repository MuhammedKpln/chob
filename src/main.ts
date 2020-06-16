import { defaultStructure } from './dataStructure';
import { GithubApi } from './GithubApi';
import { experimentalFeatures, cacheFeature, forceUpdateCache } from './cli';
import { errorMessage, infoMessage, successfullMessage } from './helpers'
import { ApiClient } from './apiClient';
import {
  serializeSnapData,
  serializeAppImageData,
  serializeFlathubData,
} from './dataSerializer';
import * as open from 'opener';
import * as prompt from 'prompts';
import { TYPES, getTypeNm } from './types';
import CacheManager from './cacheManager';

let applicationList: Array<Object> = [];

function updateApplicationList(applications: Array<Object>): void {
  applicationList = applications;
}

function openApplicationSource(app: Object): boolean | void {
  return open(app['src']);
}
export function search(userInput: String): any {
  const appsToBeOpened = [];
  for (const app of applicationList) {
    // === userinput
    if (
      String(app['name'])
        .toLowerCase()
        .includes(String(userInput))
    ) {
      appsToBeOpened.push(app);
    }
  }
  if (appsToBeOpened.length > 0) {
    // foundedApp
    return result(appsToBeOpened);
  } else {
    errorMessage(`Couldn't find any package with name of ${userInput}`);
    return false;
  }
}

async function result(apps: Array<defaultStructure>): Promise<any> {
  errorMessage(
    `Found ${apps.length} applications, please choose which one you want.`,
  );

  for (let i = 0; i < apps.length; i++) {
    infoMessage(`${i}) ${apps[i]['name']} (${apps[i]!['version'] || 'Unknown version'}) - ${TYPES[apps[i]['type']]}`);
  }

  try {
    const response = await prompt({
      type: 'number',
      name: 'value',
      message: 'Select number of an application.',
      validate: value =>
        value > apps.length
          ? `Please select numbers between 0-${apps.length - 1}`
          : true,
    });

    if (experimentalFeatures && apps[response.value].type === getTypeNm.appimage) {
      if (apps[response.value]['repoUrl']) {

        if(await askForInstallation()) {
          infoMessage('Downloading AppImage automatically...')
          installAppImage(<defaultStructure>apps[response.value]);  
        } else {
          successfullMessage(`Opening ${apps[response.value]['name']}`);
          return openApplicationSource(apps[response.value]);
        }
      } else {
        errorMessage('Could not find a download url for this file.')
        return false;
      }
    } else {
      successfullMessage(`Opening ${apps[response.value]['name']}`);
      return openApplicationSource(apps[response.value]);

    }
  } catch (error) {
    errorMessage('Please select a valid application number.');
    return false;
  }
}

async function askForInstallation(): Promise<boolean> {
  const test = await prompt({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to install appimage automatically?',
    initial: true,
  })

  if(!test.value) {
    return false
  }

  return true
  

}

async function installAppImage(app: defaultStructure) {
  const api = new GithubApi(app?.repoUrl);
  const latestRelease = await api.getTheLatestRelease();
  const apiClient = new ApiClient();

  let downloadUrl: string
  if (latestRelease) {
    infoMessage('Found latest release trying to download...')
    for (const asset of latestRelease.assets) {
      if(asset?.name.endsWith('.AppImage')) {
        downloadUrl = asset?.browser_download_url
      }
    }
    return apiClient.download(downloadUrl, app.name)
  }

  return false
}

export function grabApplicationsFromApi() {
  return new Promise(async (resolve, reject) => {
    try {
      const apiClient = new ApiClient();

      infoMessage('Searching on AppImage feed..');
      const appimageData = await apiClient.grabDataAppImage();
      let serializedData = serializeAppImageData(appimageData);

      infoMessage('Searching on Flathub..');
      const flathubData = await apiClient.grabDataFromFlathub();
      serializedData = serializedData.concat(serializeFlathubData(flathubData));

      infoMessage('Searching on Snapcraft..');
      const snapData = await apiClient.grabDataFromSnap();
      serializedData = serializedData.concat(serializeSnapData(snapData));


      if (cacheFeature) {
        const cacheManager = new CacheManager()
        const updateCache = {
          appimageData,
          flathubData,
          snapData
        }

        if (cacheManager.shouldUpdateCache() || forceUpdateCache) {
          cacheManager.updateCache(updateCache)
        }
      }

      updateApplicationList(serializedData);

      return resolve();
    } catch (error) {
      return reject(error);
    }
  });
}
