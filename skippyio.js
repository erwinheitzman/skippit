// require('./lib/utils/ConfigurationHelper.js')
// const ConfigurationHelper = require('./lib/utils/ConfigurationHelper.js').ConfigurationHelper
// const configurationHelper = new ConfigurationHelper
// configurationHelper.init()
const Githandler = require('./lib/utils/SourceControlHandler.js')
const gitHandler = new Githandler
gitHandler.disableTestsAndPushChanges()