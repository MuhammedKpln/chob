import * as argparser from 'commander';
import * as colors from 'colors';
import { grabApplicationsFromApi, search } from './main';
import * as pkg from '../package.json';

export let experimentalFeatures: boolean = false;


const helpText = () => colors.bgCyan.white.bold('Usage: chob pkgName');
const searchApplication = env => {
  const appName = env.args[0]
  console.log(
    colors.bgGreen.white.bold(`🔎 Searching ${appName} on repositories.`),
  );
  grabApplicationsFromApi().then(() => {
    search(appName.toLowerCase());
  });
};

argparser
  .option('--enableExperiementalFeatures', 'Enables experiemental features')
  .action((appName, args) => {
    if(args) {
      if (args.enableExperiementalFeatures) {
        experimentalFeatures = true;
      }
      searchApplication(appName);
    }

  });


argparser.version(pkg.version);
argparser.parse(process.argv);

const args = process.argv.slice(2)

if (args.length < 1) {
  argparser.outputHelp(helpText);
}
