const fs = require('fs');
const path = require('path');
const readline = require('readline');
const questions = require('./setupQuestions.json');
const answers = {};

class ConfigurationHelper {
    constructor () {
        this.overwrite = false;
        this.prefix = '\u001b[1;36m';
        this.suffix = '\u001b[0m';
        this.setupConfig = () => ({
            tests: {
                path: answers['tests.path'],
                formats: answers['tests.formats'].split(', ')
            },
            results: {
                path: answers['results.path'],
                formats: answers['results.formats'].split(', ')
            },
            remote: answers.remote,
            repoPath: answers.repoPath,
            maxFailures: parseInt(answers.maxFailures, 10)
        });
    }

    writeFile () {
        fs.writeFile(
            path.join(__dirname, '../../config.json'),
            JSON.stringify(this.setupConfig(), null, 4),
            'utf8'
        );
    }

    askQuestions (i, callback) {
        const self = this;
        const rl = readline.createInterface(process.stdin, process.stdout);

        rl.on('close', function () {
            if (self.overwrite === true) {
                self.writeFile();
            }
        });

        const question = this.prefix + questions[i].message + this.suffix;

        rl.question(question, (data) => {
            answers[questions[i].property] = data;

            if (i !== questions.length - 1) {
                self.askQuestions(i + 1);
            } else {
                rl.close();
            }
        });

        rl.write(questions[i].default);
        callback();
    }

    askForOverwrite (message, callback) {
        const self = this;
        const rl = readline.createInterface(process.stdin, process.stdout);

        rl.on('close', function () {
            if (self.overwrite === true) {
                self.writeFile();
            }
        });

        const question = message + '[yes]\n[no]\n';

        rl.question(question, (answer) => {
            switch (answer) {
            case 'yes':
                self.overwrite = true;
                self.askQuestions();

                return false;
            case 'no':
                self.overwrite = false;
                rl.close();

                return callback();
            default:
                self.overwrite = false;
                self.askForOverwrite(
                    'Choice not recognised, please answer yes or no.\n'
                );

                return false;
            }
        });
    }

    init (callback) {
        const self = this;
        const argv = process.argv.slice(2);

        if (argv[0] === 'config') {
            if (fs.existsSync(path.join(__dirname, '../../config.json'))) {
                const question = this.prefix
                    + 'Config file already exists, '
                    + 'are you sure you want to overwrite this?\n'
                    + this.suffix;

                self.askForOverwrite(question, callback);
            } else {
                self.askQuestions(0, callback);
            }
        } else {
            return callback();
        }

        return false;
    }
}

module.exports = new ConfigurationHelper();
