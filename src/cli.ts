import * as colors from 'colors';
import * as yargs from 'yargs';
import * as pkg from '../package.json';
import { CacheManager } from './cacheManager';
import { infoMessage, successfullMessage } from './helpers';
import { grabApplicationsFromApi, search } from './main';
import { UpdateManager } from './updateManager';


const cache = new CacheManager();
const updateManager = new UpdateManager();
export let experimentalFeatures: boolean = false;
export let cacheFeature: boolean = cache.isCacheEnabled || false;
export let updateInterval: number = 1;
export let forceUpdateCache: boolean = false;


const helpText = () => colors.bgCyan.white.bold('Usage: chob pkgName');
const searchApplication = (appName: string) => {
  infoMessage(`🔎 Searching ${appName} on repositories.`);
  grabApplicationsFromApi().then(async () => {
    await search(appName.toLowerCase());
  });
};


const checkForUpdate = async () => {
  const isUpdated = await updateManager.isUpdated();

  if(!isUpdated) {
    infoMessage(`There is a new version for chob! To download it use ${colors.bold('chob update now')}`)

    return true
  }
  successfullMessage('Yay! You are using the latest version!')

  return false
};

const update = async () => {
  if(await checkForUpdate()) {
    await updateManager.updateChob()
  }
}


export const argv = yargs
  .command('check', 'Check for updates', checkForUpdate)
  .command('update', 'Update the chob utility.', update)
  .options({
      eex: {
        alias: 'enableExperiementalFeatures',
        demandOption: true,
        default: false,
        describe: 'Enables the experiemental features',
        type: 'boolean',
        nargs: 2,
      },

      enableCache: {
        demandOption: false,
        default: false,
        describe: 'Enables cache feature',
        type: 'boolean',
      },
      disableCache: {
        demandOption: false,
        default: false,
        describe: 'Disables cache feature',
        type: 'boolean',
      },
      updateInterval: {
        demandOption: false,
        default: 1,
        describe: 'Update the cache in interval (Number expected. It will count as days.)',
        type: 'number',
      },
      forceUpdateCache: {
        demandOption: false,
        default: false,
        describe: 'Forcing cache to be up-to-dated.',
        type: 'boolean',
      },
    },
  )
  .version(pkg.version)
  .usage(helpText())
  .argv;

const appNameArg = argv._[0]

if (argv._.length > 0 && appNameArg !== 'check' && appNameArg !== 'update' ) {
  searchApplication(appNameArg);
} else {
  if (appNameArg !== 'check' && appNameArg !== 'update') {
    console.log(helpText());
  }
}

if (argv.enableExperiementalFeatures || argv.eex) {
  experimentalFeatures = true;
}

if (argv.updateInterval !== 1) {
  updateInterval = argv.updateInterval;
  successfullMessage(`⚡ Updated cache updating interval with ${updateInterval}`);
  cache.updateInterval(updateInterval);
}

if (argv.enableCache) {
  successfullMessage('⚡ Your cache will now be enabled.');
  cacheFeature = true;
  cache.updateCacheStatment(true);
}

if (argv.disableCache) {
  successfullMessage('⚡ Your cache will now be disabled.');
  cache.updateCacheStatment(false);
}

if (argv.forceUpdateCache) {
  cacheFeature = true;
  forceUpdateCache = true;
}
