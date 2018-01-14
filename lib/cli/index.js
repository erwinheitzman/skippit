const program = require('commander');
const { prompt } = require('inquirer');
const simpleGit = require('simple-git')();
const fs = require('fs');
const path = require('path');
const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const sourceControlHandler = require('../utils/SourceControlHandler');
const configExists = existsSync(join(__dirname, '../../config.json'));
const config = existsSync('../config') ? require('../config') : null;
const configQuestions = [
    {
        type: 'input',
        name: 'resultPath',
        message: 'Where are your test results located?',
        // default: './reports/**/*'
        default: 'C:/dev/temp_repo/results'
    },
    {
        type: 'checkbox',
        name: 'resultFormats',
        message: 'Which reporter formats do you want to use?',
        choices: ['json', 'xml'],
        default: 'xml'
    },
    {
        type: 'input',
        name: 'testPath',
        message: 'Where are your tests located?',
        // default: './test/specs/**/*'
        default: './tests'
    },
    {
        type: 'checkbox',
        name: 'testFormats',
        message: 'Which test formats do you want to use?',
        choices: ['e2e-spec.js', 'spec.js', 'js'],
        default: 'e2e-spec.js'
    },
    {
        type: 'input',
        name: 'remotePath',
        message: 'Where is your remote repository located?',
        // default: 'https://github.com/host/repository.git'
        default: 'https://github.com/erwinheitzman/tmp.git'
    },
    {
        type: 'input',
        name: 'repoPath',
        message: 'remove me?',
        default: 'C:/dev/BLAAT4321'
    },
    {
        type: 'input',
        name: 'maxFailures',
        message: 'Max failures treshhold',
        default: '3',
        validate: answer => Number.isInteger(parseInt(answer, 10))
    }
];

const parseAnswers = answers => ({
    tests: {
        path: answers.testPath,
        formats: answers.testFormats
    },
    results: {
        path: answers.resultPath,
        formats: answers.resultFormats
    },
    remote: answers.remotePath,
    repoPath: answers.repoPath,
    maxFailures: parseInt(answers.maxFailures, 10)
});

let disableTestsAnswer = false;

function configCommand () {
    return new Promise((resolve, reject) => {
        const createConfig = answers => {
            writeFileSync('./sdasdasd.json',
                JSON.stringify(parseAnswers(answers), null, 4), 'utf8');

            resolve();
        };

        const proptQuestions = () => prompt(configQuestions)
            .then(answers => createConfig(answers));

        if (configExists) {
            prompt({
                type: 'confirm',
                name: 'overwriteConfig',
                message: 'Config file already exists are '
                        + 'you sure you want to overwrite this?',
                default: false
            }).then((answer) => {
                if (answer.overwriteConfig) {
                    proptQuestions();
                }

                reject();
            });
        } else {
            proptQuestions();
        }

        if (disableTestsAnswer) {
            // eslint-disable-next-line
            disableCommand();
        }
    }).catch((e) => {
        if (e) {
            throw new Error(e);
        }
    });
}

function disableCommand () {
    return new Promise((resolve, reject) => {
        function proptShouldDisableTests (answers) {
            return prompt({
                type: 'confirm',
                name: 'shouldDisableTests',
                message: 'Are you sure you want to disable all tests '
                        + 'that exceed the set treshhold?'
            }).then(({ shouldDisableTests }) => {
                if (shouldDisableTests) {
                    disableTestsAnswer = true;
                    sourceControlHandler
                        .gitHandler
                        // eslint-disable-next-line
                        .cloneRepoThenPushChanges(() => {}, answers);
                    // Tests.disable(() => {
                    //     console.info('> Tests have been processed, '
                    //         + 'please check changed made');
                    // }, answers);
                }

                reject();
            });
        }

        if (!configExists) {
            prompt(configQuestions).then(answers => {
                proptShouldDisableTests(parseAnswers(answers));
            });
        } else {
            proptShouldDisableTests();
        }
    }).catch((e) => {
        if (e) {
            throw new Error(e);
        }
    });
}

function statusCommand () {
    function formatDate (date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    function formatTime (date) {
        return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    }

    function createLogFile (data) {
        const d = new Date();
        const dateFormatted = `${formatDate(d)} ${formatTime(d)}`;
        const fileName = `disabled ${dateFormatted}`;

        fs.writeFile('./' + fileName, data, 'utf8', (e) => {
            if (e) {
                throw e;
            }
        });
    }

    return new Promise((resolve) => {
        const logStatus = (settings = config) => {
            const parsePath = opts => path.isAbsolute(opts.repoPath)
                ? path.normalize(opts.repoPath)
                : path.resolve(process.cwd(), opts.repoPath);
            const pardsedRepoPath = parsePath(settings);

            simpleGit
                .cwd(pardsedRepoPath)
                .diffSummary((err, status) => {
                    if (err) {
                        throw new Error(err);
                    }
                    console.info('Disabled ' + status.insertions + ' tests');
                })
                .diff((err, status) => {
                    if (err) {
                        throw err;
                    }

                    console.info(status);
                    createLogFile(status);
                });
        };

        if (!configExists) {
            prompt([
                {
                    type: 'input',
                    name: 'repoPath',
                    message: 'remove me?',
                    default: 'C:/dev/BLAAT4321'
                }
            ]).then(answers => {
                logStatus(answers);
            });
        } else {
            logStatus(config);
        }

        resolve();
    });
}

program
    .version('1.0.0')
    .description('Client Management System');

program
    .command('disable')
    .alias('d')
    .alias('--disable')
    .description('Disable tests')
    .action(disableCommand);

program
    .command('config')
    .alias('c')
    .description('Create config')
    .action(configCommand);

program
    .command('status')
    .alias('s')
    .description('Get status')
    .action(statusCommand);

program
    .command('help')
    .alias('h')
    .description('Get status')
    .action(statusCommand);

program.parse(process.argv);
