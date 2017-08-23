const fs = require('fs');
const path = require('path');
const readline = require('readline');
const questions = require('./setupQuestions.js');

class ConfigurationHelper {
    constructor () {
        this.overwrite = false;
        this.prefix = '\u001b[1;36m';
        this.suffix = '\u001b[0m';
        this.questions = questions;
        this.answers = {};
    }

    setupConfig () {
        const self = this;

        return {
            tests: {
                path: self.answers['tests.path']
                    || self.questions['tests.path'].defaultValue,
                formats: self.answers['tests.formats']
                    ? self.answers['tests.formats'].split(',')
                    : self.questions['tests.formats'].defaultValue
            },
            results: {
                path: self.answers['results.path']
                    || self.questions['results.path'].defaultValue,
                formats: self.answers['results.formats']
                    ? self.answers['results.formats'].split(',')
                    : self.questions['results.formats'].defaultValue
            },
            remote: self.answers.remote
                || self.questions.remote.defaultValue,
            repoPath: self.answers.repoPath
                || self.questions.repoPath.defaultValue,
            maxFailures: self.answers.maxFailures
                ? parseInt(self.answers.maxFailures, 10)
                : self.questions.maxFailures.defaultValue
        };
    }

    createConfig () {
        const self = this;

        if (self.overwrite === true) {
            fs.writeFileSync(
                path.join(__dirname, '../../config.json'),
                JSON.stringify(self.setupConfig(), null, 4),
                'utf8'
            );
        }
    }

    askQuestion (questionKey) {
        const self = this;
        const { message, defaultValue } = self.questions[questionKey];
        let coloredQuestion = self.prefix + message + self.suffix;

        return new Promise((resolve, reject) => {
            const rl = readline.createInterface(process.stdin, process.stdout);

            if (questionKey === 'overwrite') {
                if (!fs.existsSync(path.join(__dirname, '../../config.json'))) {
                    resolve();

                    return;
                }

                coloredQuestion += '\n[yes]\n[no]\n';
            }

            rl.question(coloredQuestion, (data) => {
                if (questionKey === 'overwrite') {
                    if (data === 'no') {
                        self.overwrite = false;

                        return reject();
                    }

                    if (data !== 'yes') {
                        self.overwrite = false;
                        rl.close();

                        return self.askQuestions().then(() => {
                            self.createConfig();
                        });
                    }

                    self.overwrite = true;
                    rl.close();

                    return resolve();
                }

                rl.close();
                self.answers[questionKey] = data;

                return resolve();
            });

            if (defaultValue) {
                rl.write(defaultValue.toString());
            }
        });
    }

    askQuestions () {
        const self = this;

        return (async () => {
            for (const questionKey in self.questions) {
                await self.askQuestion(questionKey);
            }
        })();
    }

    init () {
        const self = this;
        const argv = process.argv.slice(2);

        return new Promise((resolve) => {
            if (argv[0] === 'config') {
                self.askQuestions().then(() => {
                    self.createConfig();
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = new ConfigurationHelper();
