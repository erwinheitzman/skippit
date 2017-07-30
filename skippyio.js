const configurationHelper = require('./lib/utils/ConfigurationHelper.js').ConfigurationHelper
configurationHelper.init()

const Githandler = require('./lib/utils/SourceControlHandler.js')
const gitHandler = new Githandler

gitHandler.disableTestsAndPushChanges()