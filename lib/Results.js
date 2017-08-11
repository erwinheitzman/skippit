const config = require('./utils/getConfig');
const Files = require('./Files');

const { results } = config;

class Results {
    get () { return Files.get(results.path, results.formats); }
}

module.exports = new Results();
