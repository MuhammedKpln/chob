import * as argparser from 'commander'
import * as colors from 'colors'
import { grabApplicationsFromApi, search } from './main'

argparser.command('*')
  .action(env => {
    console.log(colors.bgGreen.white.bold(`🔎 Searching ${env} on repositories.`));
    grabApplicationsFromApi().then(() => {
      search(env.toLowerCase())
    })
  })
argparser.parse(process.argv);


