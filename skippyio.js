require('./lib/utils/ConfigurationHelper').init(() => {
    const Githandler = require('./lib/utils/SourceControlHandler');
    const gitHandler = new Githandler();

    gitHandler.disableTestsAndPushChanges(() => {
        const logger = require('./lib/Logger');

        logger.createLogFile();
    });
});
