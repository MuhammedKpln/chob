import * as argparser from 'commander';
import * as colors from 'colors';
import { grabApplicationsFromApi, search } from './main';
import * as pkg from '../package.json';

export let experimentalFeatures: boolean = false;


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





argparser.version(pkg.version);
argparser.parse(process.argv);




// console.log(argparser.enableExperiementalFeatures)

const args = process.argv.slice(2)

if (args.length < 1) {
  argparser.outputHelp(helpText);
} else {
  const appName = argparser.args[0]
  if (argparser.enableExperiementalFeatures) {
    experimentalFeatures = true;
  }
  searchApplication(appName);

}
