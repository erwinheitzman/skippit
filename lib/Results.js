const { existsSync } = require('fs');
const config = existsSync('../config') ? require('../config') : null;
const Files = require('./Files');

class Results {
    get (settings = config) {
        return Files.get(settings.results.path, settings.results.formats);
    }
}

module.exports = new Results();
