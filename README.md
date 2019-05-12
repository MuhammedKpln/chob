# Chob

[![TypeScript version][ts-badge]][typescript-34]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][LICENSE]

[![Donate][donate-badge]][donate]

Chob is an helper tool for searching application accross platforms (Flathub, Snapcraft and AppImage)

## Usage

1. Download executable file for your linux distro from [Releases][release] 
2. chmod +x chob-linux
3. ./chob-linux pkgName

## Build instructions

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs]. To start, just clone the repository with following commands:

```sh
git clone https://github.com/MuhammedKpln/chob.git
cd chob
npm install && yarn
```
## Available scripts

+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `build` - transpile TypeScript to ES6,
+ `build:watch` - interactive watch mode to automatically transpile source files,
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:watch` - interactive watch mode to automatically re-run tests


## License
Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-3.4-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2010.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v10.x/docs/api/
[travis-badge]: https://travis-ci.org/jsynowiec/node-typescript-boilerplate.svg?branch=master
[typescript]: https://www.typescriptlang.org/
[typescript-34]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/MuhammedKpln/chob/blob/master/LICENSE

[donate-badge]: https://img.shields.io/badge/☕-buy%20me%20a%20coffee-46b798.svg
[donate]: https://www.buymeacoffee.com/muhammedkpln
[jest]: https://facebook.github.io/jest/
[tslint]: https://palantir.github.io/tslint/
[tslint-microsoft-contrib]: https://github.com/Microsoft/tslint-microsoft-contrib
[prettier]: https://prettier.io
[release]: https://github.com/MuhammedKpln/chob/releases