import { ApiClient } from './apiClient'
import { serializeSnapData, serializeAppImageData } from './dataSerializer'
import * as open from 'opener'
import * as chalk from 'chalk'
import * as prompt from 'prompts'
import TYPES from './types'


let applicationList: Array<Object> = []

const successfullMessage = message => console.log(chalk.bgGreen.bold(message))
const errorMessage = message => console.log(chalk.bgRed.bold(message))
const infoMessage = message => console.log(chalk.bgBlueBright.bold(message))

function updateApplicationList(applications: Array<Object>): void {
  applicationList = applications
}

function openApplicationSource(app: Object): boolean | void {
  return open(app['src'])
}
export function search(userInput: String): any {
  const appsToBeOpened = []
  for (const app of applicationList) {
    // === userinput
    if (String(app['name']).toLowerCase().includes(String(userInput))) {
      appsToBeOpened.push(app)
    }
  }
  if (appsToBeOpened.length > 0) {
    // foundedApp
    return result(appsToBeOpened)
  } else {
    errorMessage(`Couldn't find any package with name of ${userInput}`)
    return false
  }
}

async function result(apps: Array<Object>): Promise<any> {


  errorMessage(`Found ${apps.length} applications, please choose which one you want.`)

  for (let i = 0; i < apps.length; i++) {
    infoMessage(`${i}) ${apps[i]['name']} - ${TYPES[apps[i]['type']]}`)
  }



  try {
    const response = await prompt({
      type: 'number',
      name: 'value',
      message: 'Select number of an application.',
      validate: value => value > apps.length ? `Please select numbers between 0-${apps.length - 1}` : true
    })


    return openApplicationSource(apps[response.value])
  } catch (error) {
    errorMessage('Please select a valid application number.')
    return false
  }
}

export function grabApplicationsFromApi() {

  return new Promise(async (resolve, reject) => {
    const apiClient = new ApiClient()

    const snapData = await apiClient.grabDataFromSnap()
    let serializedData = serializeSnapData(snapData)

    const appimageData = await apiClient.grabDataAppImage()
    serializedData = serializedData.concat(serializeAppImageData(appimageData))

    updateApplicationList(serializedData)

    return resolve()
  })

}
