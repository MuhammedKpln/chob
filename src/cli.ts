import * as argparser from 'commander';
import { grabApplicationsFromApi, search } from './main';
import * as pkg from '../package.json';
import { infoMessage, successfullMessage } from './helpers';
import * as colors from 'colors';
import CacheManager from './cacheManager';

const cache = new CacheManager()
export let experimentalFeatures: boolean = false;
export let cacheFeature: boolean = cache.isCacheEnabled || false
export let updateInterval: number = 1
export let forceUpdateCache: boolean = false

const helpText = () => colors.bgCyan.white.bold('Usage: chob pkgName');
const searchApplication = appName => {
  infoMessage(`🔎 Searching ${appName} on repositories.`)
  grabApplicationsFromApi().then(() => {
    search(appName.toLowerCase());
  });
};

argparser
  .option('--enableExperiementalFeatures', 'Enables experiemental features')
  .option('--enableCache', 'Enables cache feature')
  .option('--disableCache', 'Disables cache feature')
  .option('--updateInterval <number>', 'Update the cache in interval (Number expected. It will count as days.) ')
  .option('--forceUpdateCache', 'Forcing cache to be up to dated.')

argparser.version(pkg.version);
argparser.parse(process.argv);

const args = process.argv.slice(2)

if (args.length < 1) {
  argparser.outputHelp(helpText);
} else {
  let appName = argparser.args[0]
  
  if (argparser.enableExperiementalFeatures) {
    experimentalFeatures = true;
  }

  if (argparser.updateInterval) {
    updateInterval = argparser.updateInterval;
    successfullMessage('⚡ Updated cache updating interval with ' + updateInterval)
    cache.updateInterval(updateInterval)
  }

  if (argparser.enableCache) {
    successfullMessage('⚡ Your cache will now be enabled.')
    cacheFeature = true;
    cache.updateCacheStatment(true)
  }
  
  if (argparser.disableCache) {
    successfullMessage('⚡ Your cache will now be disabled.')
    cache.updateCacheStatment(false)
  }
  
  if(argparser.forceUpdateCache) {
    appName = 'updating' 
    cacheFeature = true
    forceUpdateCache = true    
  }

  searchApplication(appName);

}
