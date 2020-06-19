import * as colors from 'colors';


export const successfullMessage = (message: string) =>
  console.log(colors.bgGreen.white.bold(message));
export const errorMessage = (message: string) => console.log(colors.bgRed.white.bold(message));
export const infoMessage = (message: string) => console.log(colors.bgBlue.white.bold(message));
