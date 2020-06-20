import * as fs from 'fs';
import { ApiClient } from './apiClient';


const apiClient = new ApiClient()

async function scrapper() {
    const snapData = await apiClient.grabDataFromSnap()

    try {
        fs.writeFileSync('../snapcraft.json', JSON.stringify(snapData))
    } catch (err) {
        console.error(err);
    }
}


scrapper().then(r => console.log('ok'))
