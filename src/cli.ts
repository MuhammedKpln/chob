import * as argparser from 'commander';
import * as colors from 'colors';
import { grabApplicationsFromApi, search } from './main';
import * as pkg from '../package.json';

export let experimentalFeatures: boolean = false;

const helpText = () => colors.bgCyan.white.bold('Usage: chob pkgName');
const searchApplication = env => {
  console.log(
    colors.bgGreen.white.bold(`🔎 Searching ${env} on repositories.`),
  );
  grabApplicationsFromApi().then(() => {
    search(env.toLowerCase());
  });
};

argparser
  .option('--enableExperiementalFeatures', 'Enables experiemental features')
  .action((appName, args) => {
    if (args.enableExperiementalFeatures) {
      experimentalFeatures = true;
    }
    searchApplication(appName);
  });

argparser.version(pkg.version);
argparser.parse(process.argv);

if (!process.argv.slice(2).length) {
  argparser.outputHelp(helpText);
}
