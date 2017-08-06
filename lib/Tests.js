const fs = require('fs');
const path = require('path');
const { Files } = require('./Files');
const files = new Files();
const { Results } = require('./Results');
const results = new Results();
const config = require('./utils/getConfig');
const { repoPath, tests } = config;

const logger = require('./Logger');

module.exports.Tests = class {
    get () {
        // TODO: Ask if the test files are in a repo
        // else save changes locally instead

        return files.get(path.join(repoPath, tests.path), tests.formats, true);
    }

    disable (callback) {
        results.process();

        this.get().forEach(file => {
            fs.readFile(file, 'utf8', (err, data) => {
                let newData = false;

                if (err) {
                    throw err;
                }

                for (const test in results.failedTests) {
                    // Matches (arrow) function(s) declaration/expression(s)
                    // with and without parameters/values

                    const regex = new RegExp(
                        '(it|test)(\\([\'|"]' + test + '[\'|"],\\s?'
                        + '(?:function\\s?\\((?:[\'|"]?\\w+)?[\'|"]?\\)\\s?{'
                        + '|'
                        + '\\w+\\);?'
                        + '|'
                        + '\\(?(?:[\'|"]?\\w+)?[\'|"]?\\)?\\s?=>\\s?{?))', 'g'
                    );

                    if (results.failedTests[test].failed >= 3) {
                        if (data.match(regex)) {
                            data = data.replace(regex, '$1.skip$2');
                            newData = true;
                            logger.disabledTests = { file: file, test: test };
                        }
                    }
                }

                if (newData) {
                    fs.writeFile(file, data, 'utf8', err => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
        });

        callback();
    }
};
