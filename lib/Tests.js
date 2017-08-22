const fs = require('fs');
const path = require('path');
const Files = require('./Files');
const XmlProcessor = require('./XmlProcessor');
const config = require('./utils/getConfig');
const Logger = require('./Logger');
const { repoPath, tests } = config;

class Tests {
    constructor () {
        this.failed = {};
    }

    get () {
        // TODO: Ask if the test files are in a repo
        // else save changes locally instead

        return Files.get(path.join(repoPath, tests.path), tests.formats, true);
    }

    disable (callback) {
        const self = this;

        self.failed = XmlProcessor.processFiles();

        function disableTests (file, data) {
            let newData = data;
            let dataIsModified = false;

            for (const test in self.failed) {
                const regex = new RegExp(
                    // Matches (arrow) function(s) declaration/expression(s)
                    // with and without parameters/values
                    '(it|test)(\\([\'|"]' + test + '[\'|"],\\s?'
                    + '(?:function\\s?\\((?:[\'|"]?\\w+)?[\'|"]?\\)\\s?{'
                    + '|'
                    + '\\w+\\);?'
                    + '|'
                    + '\\(?(?:[\'|"]?\\w+)?[\'|"]?\\)?\\s?=>\\s?{?))', 'g'
                );

                if (self.failed[test].failed >= 3) {
                    if (newData.match(regex)) {
                        dataIsModified = true;
                        newData = newData.replace(regex, '$1.skip$2');
                        Logger.disabledTests = { file: file, test: test };
                    }
                }
            }

            if (dataIsModified) {
                fs.writeFile(file, newData, 'utf8', (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }

        this.get().forEach(file => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }

                disableTests(file, data);
            });
        });

        callback();
    }
}

module.exports = new Tests();
