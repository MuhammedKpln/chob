import * as colors from 'colors';


export const successfullMessage = message =>
  console.log(colors.bgGreen.white.bold(message));
export const errorMessage = message => console.log(colors.bgRed.white.bold(message));
export const infoMessage = message => console.log(colors.bgBlue.white.bold(message));
