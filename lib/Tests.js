const { readFile, writeFile, existsSync } = require('fs');
const path = require('path');
const Files = require('./Files');
const xmlProcessor = require('./processors/XmlProcessor');
const jsonProcessor = require('./processors/JsonProcessor');
const config = existsSync('../config') ? require('../config') : null;

class Tests {
    constructor () {
        this.failed = {};
    }

    get (settings = config) {
        // TODO: Ask if the test files are in a repo
        // else save changes locally instead
        const filePath = path.join(settings.repoPath, settings.tests.path);

        return Files.get(filePath, settings.tests.formats, true);
    }

    disable (callback, settings = config) {
        const fileTypeList = [];

        settings.results.formats.forEach(format => {
            if (format === 'xml') {
                fileTypeList.push(
                    xmlProcessor.processFiles(
                        Files.get(settings.results.path, [format], true)
                    )
                );
            }
            if (format === 'json') {
                fileTypeList.push(
                    jsonProcessor.processFiles(
                        Files.get(settings.results.path, [format], true)
                    )
                );
            }
        });

        function disableTests (file, data) {
            let newData = data;
            let dataIsModified = false;

            fileTypeList.forEach(set => {
                for (const test in set) {
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

                    if (set[test].failed >= settings.maxFailures) {
                        if (newData.match(regex)) {
                            dataIsModified = true;
                            newData = newData.replace(regex, '$1.skip$2');
                        }
                    }
                }
            });

            if (dataIsModified) {
                writeFile(file, newData, 'utf8', (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }

        this.get(settings).forEach(file => {
            readFile(file, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }

                disableTests(file, data);
            });
        });

        callback(settings);
    }
}

module.exports = new Tests();
