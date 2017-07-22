const Githandler = require('./lib/utils/SourceControlHandler.js')
const gitHandler = new Githandler
gitHandler.clone('https://github.com/erwinheitzman/selenium-build-monitor.git')