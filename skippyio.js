const Githandler = require('./lib/utils/SourceControlHandler');
const logger = require('./lib/Logger');

const gitHandler = new Githandler();

require('./lib/utils/ConfigurationHelper').init(() => {
    gitHandler.disableTestsAndPushChanges(() => {
        logger.createLogFile();
    });
});
