import * as request from 'request'
import { flathubStructure, snapStrucuure, appimageStructure } from './dataStructure'

export class ApiClient {

    private flathubApi = 'https://flathub.org/api/v1/apps/'
    private snapApi = 'https://search.apps.ubuntu.com/api/v1/search'
    private appimageApi = 'https://appimage.github.io/feed.json'

    private flathubData;
    private snapData;
    private appimageData;


    grabDataFromFlathub(): Promise<flathubStructure> {
        return new Promise((resolve, reject) => {
            request.get(this.flathubApi, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    return reject(error)
                }

                this.flathubData = JSON.parse(body)
                return resolve(this.flathubData)
            })
        })
    }


    grabDataSnapCraft(): Promise<snapStrucuure> {
        return new Promise((resolve, reject) => {
             request.get(this.snapApi, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    return reject(error)
                }

                this.snapData = JSON.parse(body)
                return resolve(this.snapData)
            })

        })
    }

    grabDataAppImage(): Promise<appimageStructure> {
        return new Promise((resolve, reject) => {
             request.get(this.appimageApi, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    return reject(error)
                }

                this.appimageData = JSON.parse(body)
                return resolve(this.appimageData)
            })

        })
    }

}
