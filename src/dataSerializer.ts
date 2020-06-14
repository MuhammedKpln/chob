import {
  flathubStructure,
  snapStrucuure,
  appimageStructure,
} from './dataStructure';

export function serializeFlathubData(data: flathubStructure[]): Object[] {
  let serializedData: Object[] = [];

  for (const app of data) {
    serializedData.push({
      name: app.name,
      type: 2,
      src: `https://flathub.org/apps/details/${app.flatpakAppId}`,
      version: app.currentReleaseVersion
    });
  }

  return serializedData;
}

export function serializeSnapData(data: snapStrucuure): Object[] {
  let serializedData: Object[] = [];

  for (const app of data['_embedded']['clickindex:package']) {
    serializedData.push({
      name: app.title,
      type: 3,
      src: `https://snapcraft.io/${app.package_name}`,
      version: app.version
    });
  }

  return serializedData;
}

export function serializeAppImageData(data: appimageStructure): Object[] {
  let serializedData: Object[] = [];
  for (const app of data.items) {
    serializedData.push({
      name: app.name,
      type: 1,
      src: `https://appimage.github.io/${app.name}`,
      repoUrl: app.links?.[1]?.['url'],
    });
  }

  return serializedData;
}
