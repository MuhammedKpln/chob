import * as argparser from 'commander'
import * as chalk from 'chalk'
import { grabApplicationsFromApi, search } from './main'

argparser.command('*')
  .action(env => {
    console.log(chalk.bgGreen.bold(`🔎 Searching ${env} on repositories.`));
    grabApplicationsFromApi().then(() => {
      search(env.toLowerCase())
    })
  })
argparser.parse(process.argv);


