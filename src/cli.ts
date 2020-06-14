import * as argparser from 'commander';
import * as colors from 'colors';
import { grabApplicationsFromApi, search } from './main';
import * as pkg from '../package.json';

export let experimentalFeatures: boolean = false;
export let cacheFeature: boolean = false
export let updateInterval: number = 1

const helpText = () => colors.bgCyan.white.bold('Usage: chob pkgName');
const searchApplication = appName => {
  console.log(
    colors.bgGreen.white.bold(`🔎 Searching ${appName} on repositories.`),
  );
  grabApplicationsFromApi().then(() => {
    search(appName.toLowerCase());
  });
};

argparser
  .option('--enableExperiementalFeatures', 'Enables experiemental features')
  .option('--enableCache', 'Enables feature')
  .option('--updateInterval <number>', 'Update the cache in interval (Number expected. It will count as days.) ')


argparser.version(pkg.version);
argparser.parse(process.argv);

const args = process.argv.slice(2)

if (args.length < 1) {
  argparser.outputHelp(helpText);
} else {
  const appName = argparser.args[0]
  
  if (argparser.enableExperiementalFeatures) {
    experimentalFeatures = true;
  }
  console.log(argparser.updateInterval)

  if (argparser.updateInterval) {
    updateInterval = argparser.updateInterval;
  }

  if (argparser.enableCache) {
    cacheFeature = true;
  }
  
  searchApplication(appName);

}
