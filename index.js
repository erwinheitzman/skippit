const ConfigParser = require('./lib/utils/ConfigParser').ConfigParser
const configParser = new ConfigParser
const Files = require('./lib/Files').Files
const files = new Files

configParser.config = 'rapid.json'

console.log(files.get(configParser.config.resultsPath, [], true))