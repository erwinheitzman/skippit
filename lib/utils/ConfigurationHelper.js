const fs = require('fs');
const path = require('path');
const readline = require('readline');
const questions = require('./setupQuestions.js');

class ConfigurationHelper {
    constructor () {
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
        const { overwrite } = self.answers;
        const shouldWriteFile = overwrite === 'yes' || overwrite === null;

        if (shouldWriteFile) {
            fs.writeFileSync(
                path.join(__dirname, '../../config.json'),
                JSON.stringify(self.setupConfig(), null, 4),
                'utf8'
            );
        }
    }

    parseQuestion (questionKey, questionMessage) {
        let message = this.prefix + questionMessage + this.suffix;

        if (questionKey === 'overwrite') {
            message += '\n[yes]\n[no]\n';
        }

        return message;
    }

    handleOverwrite (questionKey, data) {
        const self = this;

        if (questionKey === 'overwrite') {
            if (data !== 'yes') {
                self.askQuestions().then(() => {
                    self.createConfig();
                });
            }
        }
    }

    storeAnswer (questionKey, answer) {
        this.answers[questionKey] = answer;
    }

    askQuestion (questionKey) {
        const self = this;
        const { message, defaultValue } = self.questions[questionKey];
        const parsedQuestion = self.parseQuestion(questionKey, message);

        return new Promise((resolve) => {
            const rl = readline.createInterface(process.stdin, process.stdout);

            rl.question(parsedQuestion, (data) => {
                rl.close();
                self.handleOverwrite(rl, questionKey, data);
                self.storeAnswer(questionKey, data);
                resolve();
            });

            if (defaultValue) {
                rl.write(defaultValue.toString());
            }
        });
    }

    askQuestions () {
        const self = this;
        const configPath = path.join(__dirname, '../../config.json');
        const configExists = fs.existsSync(configPath);

        return (async () => {
            for (const questionKey in self.questions) {
                if (questionKey === 'overwrite') {
                    if (configExists) {
                        await self.askQuestion(questionKey);
                    } else {
                        self.answers.overwrite = null;
                    }
                } else if (self.answers.overwrite !== 'no') {
                    await self.askQuestion(questionKey);
                }
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
