const config = require('../config');
const Files = require('./Files');

class Results {
    get (settings = config) {
        return Files.get(settings.results.path, settings.results.formats);
    }
}

module.exports = new Results();
