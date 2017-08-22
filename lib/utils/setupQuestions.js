const defaultConfig = require('./defaultConfig');
const questions = {
    'overwrite': {
        message: 'Config file already exists, '
            + 'are you sure you want to overwrite this? '
    },
    'results.path': {
        message: 'Where are your test results located? ',
        defaultValue: defaultConfig.results.path
    },
    'results.formats': {
        message: 'What are the formats of your test results? ',
        defaultValue: defaultConfig.results.formats
    },
    'remote': {
        message: 'What is the URL to your repository? ',
        defaultValue: defaultConfig.remote
    },
    'repoPath': {
        message: 'Where do you want to place the repository? ',
        defaultValue: defaultConfig.repoPath
    },
    'tests.path': {
        message: 'Where are your tests located? ',
        defaultValue: defaultConfig.tests.path
    },
    'tests.formats': {
        message: 'What are the formats of your test? ',
        defaultValue: defaultConfig.tests.formats
    },
    'maxFailures': {
        message: 'Starting from what amount of failures '
            + 'should the tests be disabled? ',
        defaultValue: defaultConfig.maxFailures
    }
};

module.exports = questions;
