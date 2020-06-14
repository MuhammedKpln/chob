import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import { flathubStructure, snapStrucuure, appimageStructure } from './dataStructure'
import { updateInterval } from './cli'


interface ICacheManager {
    shouldUpdateCache: () => boolean
    updateCache: (data: IUpdateCacheObject) => boolean | Error
    getSourcesFromCache: () => IUpdateCacheObject
}

interface IUpdateCacheObject extends Object {
    flathubData: flathubStructure[]
    snapData: snapStrucuure
    appimageData: appimageStructure
}

export default class CacheManager implements ICacheManager {

    private cacheLocation: string
    private flathubCachePath: string
    private snapCachePath: string
    private appimageCachePath: string
    private updatedAtFilePath: string
    private updateCacheInterval: number


    constructor() {
        this.cacheLocation = path.resolve(os.homedir(), 'chob');
        this.flathubCachePath = path.resolve(this.cacheLocation, '.flathub.json');
        this.snapCachePath = path.resolve(this.cacheLocation, '.snap.json');
        this.appimageCachePath = path.resolve(this.cacheLocation, '.appimage.json');
        this.updatedAtFilePath = path.resolve(this.cacheLocation, '.updatedAt');
        this.updateCacheInterval = updateInterval

        if (!this.checkCacheFiles()) {
            this.createCacheFiles()
        }

    }

    getSourcesFromCache(): IUpdateCacheObject {
        const flathubData: flathubStructure[] = JSON.parse(fs.readFileSync(this.flathubCachePath).toString())
        const snapData: snapStrucuure = JSON.parse(fs.readFileSync(this.snapCachePath).toString())
        const appimageData: appimageStructure = JSON.parse(fs.readFileSync(this.appimageCachePath).toString())

        return {
            flathubData,
            snapData,
            appimageData
        }
    }


    updateCache(data: IUpdateCacheObject): boolean | Error {
        try {
            const { flathubData, snapData, appimageData } = data

            fs.writeFileSync(this.flathubCachePath, JSON.stringify(flathubData))
            fs.writeFileSync(this.snapCachePath, JSON.stringify(snapData))
            fs.writeFileSync(this.appimageCachePath, JSON.stringify(appimageData))
            fs.writeFileSync(this.updatedAtFilePath, Date.now().toString())
            return true

        } catch (err) {
            throw new Error(err)
        }
    }

    shouldUpdateCache() {
        const date = Number(fs.readFileSync(this.updatedAtFilePath).toString())
        const tomorrowDate = new Date(date).setDate(new Date(date).getDate() + this.updateCacheInterval)

        if (!date) {
            return true
        }

        if (tomorrowDate < Date.now()) {
            return true
        }

        return false


    }


    private checkCacheFiles(): boolean {
        const flathubFile = fs.existsSync(this.flathubCachePath)
        const snapFile = fs.existsSync(this.snapCachePath)
        const appimageFile = fs.existsSync(this.appimageCachePath)
        const updateFile = fs.existsSync(this.updatedAtFilePath)

        if (flathubFile && snapFile && appimageFile && updateFile) {
            return true
        }

        return false

    }

    private createCacheFiles(): boolean | Error {
        try {
            const data = JSON.stringify({})
            fs.writeFileSync(this.flathubCachePath, data)
            fs.writeFileSync(this.snapCachePath, data)
            fs.writeFileSync(this.appimageCachePath, data)
            fs.writeFileSync(this.updatedAtFilePath, '')


            return true
        } catch (err) {
            throw new Error('Could not create cache files!')
        }
    }



}
