const Githandler = require('./lib/utils/SourceControlHandler.js')
const gitHandler = new Githandler
gitHandler.disableTestsAndPushChanges()