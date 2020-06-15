import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import { flathubStructure, snapStrucuure, appimageStructure } from './dataStructure'
import { successfullMessage } from './helpers'

export interface ICacheManager {
    shouldUpdateCache: () => boolean
    updateCache: (data: IUpdateCacheObject) => boolean | Error
    getSourcesFromCache: () => IUpdateCacheObject
    updateCacheStatment: (statment: boolean) => boolean
    updateInterval: (interval: number) => boolean
    hasCachedSources: boolean
    isCacheEnabled: boolean
}

interface IUpdateCacheObject extends Object {
    flathubData: flathubStructure[]
    snapData: snapStrucuure
    appimageData: appimageStructure
}

interface IConfig extends Object {
    enabled: boolean
    interval: number
}

export default class CacheManager implements ICacheManager {

    private cacheLocation: string
    private flathubCachePath: string
    private snapCachePath: string
    private appimageCachePath: string
    private updatedAtFilePath: string
    private updateCacheInterval: number
    private configPath: string
    private config: IConfig
    isCacheEnabled: boolean
    hasCachedSources: boolean


    constructor() {
        this.cacheLocation = path.resolve(os.homedir(), 'chob');
        this.flathubCachePath = path.resolve(this.cacheLocation, '.flathub.json');
        this.snapCachePath = path.resolve(this.cacheLocation, '.snap.json');
        this.appimageCachePath = path.resolve(this.cacheLocation, '.appimage.json');
        this.updatedAtFilePath = path.resolve(this.cacheLocation, '.updatedAt');
        this.configPath = path.resolve(this.cacheLocation, 'config.json');


        if (!fs.existsSync(this.cacheLocation)) {
            fs.mkdirSync(this.cacheLocation)
        }

        if (!this.checkCacheFiles()) {
            this.createCacheFiles()
        }

        this.config = this.parseConfig()
        this.isCacheEnabled = this.config.enabled
        this.updateCacheInterval = this.config.interval || 1


        this.hasCachedSources = this.checkHasCachedSources()


    }

    updateInterval(interval: number): boolean {
        this.config.interval = interval

        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config))
            return true
        } catch (err) {
            return false
        }
    }

    updateCacheStatment(statment: boolean): boolean {
        this.config.enabled = statment
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config))
            return true
        } catch (err) {
            return false
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

            successfullMessage('⚡ Created cache, your results will now pull from cached sources! ⚡')

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

    private parseConfig(): IConfig {
        const configFile = fs.readFileSync(this.configPath).toString()
        return JSON.parse(configFile)
    }

    private checkHasCachedSources(): boolean {
        const flathubData: flathubStructure[] = JSON.parse(fs.readFileSync(this.flathubCachePath).toString())

        if (Object.keys(flathubData).length > 0) {
            return true
        }

        return false

    }

    private checkCacheFiles(): boolean {
        const flathubFile = fs.existsSync(this.flathubCachePath)
        const snapFile = fs.existsSync(this.snapCachePath)
        const appimageFile = fs.existsSync(this.appimageCachePath)
        const updateFile = fs.existsSync(this.updatedAtFilePath)
        const configPath = fs.existsSync(this.configPath)

        if (flathubFile && snapFile && appimageFile && updateFile && configPath) {
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
            fs.writeFileSync(this.configPath, data)


            return true
        } catch (err) {
            throw new Error('Could not create cache files!')
        }
    }



}