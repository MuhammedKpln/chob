import { flathubStructure, defaultStructure, snapStrucuure, appimageStructure } from './dataStructure';

export function serializeFlathubData(data: flathubStructure) : Array<Object> {
    let serializedData: Object[] = [];

    for (const app of data) {
        serializedData.push({
            name: app.name,
            type: 2,
            dest: `https://flathub.org/apps/details/${app.flatpakAppId}`
        })
    }

    return serializedData
}


export function serializeSnapData(data: snapStrucuure) : Object[] {
    let serializedData: Object[] = [];

    for (const app of data['_embedded']['clickindex:package']) {
        serializedData.push({
            name: app.title,
            type: 3,
            dest: `https://snapcraft.io/${app.package_name}`
        })
    }

    return serializedData
}



export function serializeAppImageData(data: appimageStructure) : Object[] {
    let serializedData: Object[] = [];

    for (const app of data) {
        serializedData.push({
            name: app.title,
            type: 3,
            dest: `https://snapcraft.io/${app.package_name}`
        })
    }

    return serializedData
}