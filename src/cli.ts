import * as argparser from 'commander'
import * as colors from 'colors'
import { grabApplicationsFromApi, search } from './main'
import * as pkg from "../package.json"

argparser.command('*')
  .action(env => {
    console.log(colors.bgGreen.white.bold(`🔎 Searching ${env} on repositories.`));
    grabApplicationsFromApi().then(() => {
      search(env.toLowerCase())
    })
  })
argparser.help(() => {
  return colors.bgMagenta.white.bold('Usage: chob pkgName')
})
argparser.version(pkg.version)
argparser.parse(process.argv);