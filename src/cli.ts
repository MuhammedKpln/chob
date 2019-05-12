import * as argparser from 'commander'
import * as colors from 'colors'
import { grabApplicationsFromApi, search } from './main'
import * as pkg from "../package.json"

const helpText = () => colors.bgCyan.white.bold('Usage: chob pkgName')

argparser.command('*')
  .action(env => {
    console.log(colors.bgGreen.white.bold(`🔎 Searching ${env} on repositories.`));
    grabApplicationsFromApi().then(() => {
      search(env.toLowerCase())
    })
  })
argparser.version(pkg.version)
argparser.parse(process.argv);

if (!process.argv.slice(2).length) {
  argparser.outputHelp(helpText);
}


