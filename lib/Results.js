const { existsSync } = require('fs');
const { join } = require('path');
const Files = require('./Files');
const configExists = existsSync(join(__dirname, '../config.json'));
const config = configExists ? require('../config') : null;


class Results {
    get (settings = config) {
        return Files.get(settings.results.path, settings.results.formats);
    }
}

module.exports = new Results();
