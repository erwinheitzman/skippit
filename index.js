// const Tests = require('./lib/Tests').Tests
// const tests = new Tests
// tests.disable()
const path = require('path')
const configPath = path.resolve(__dirname, './_config.json')

const ConfigParser = require('./lib/utils/ConfigParser').ConfigParser
const configParser = new ConfigParser
configParser.addConfig(configPath)

console.log(configParser.config)