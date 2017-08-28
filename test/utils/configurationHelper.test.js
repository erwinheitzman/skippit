const path = require('path');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const setupQuestions = require('../../lib/utils/setupQuestions.js');
const configPath = path.join(__dirname, '../../config.json');
const defaultConfig = require('../../lib/utils/defaultConfig.js');
const configAsJSONString = '{\n'
+ '    "tests": {\n'
+ '        "path": "./tests",\n'
+ '        "formats": [\n'
+ '            "js"\n'
+ '        ]\n'
+ '    },\n'
+ '    "results": {\n'
+ '        "path": "C:/dev/temp_repo/results",\n'
+ '        "formats": [\n'
+ '            "xml"\n'
+ '        ]\n'
+ '    },\n'
+ '    "remote": "https://github.com/host/repository.git",\n'
+ '    "repoPath": "C:/dev/temp_repo",\n'
+ '    "maxFailures": 3\n'
+ '}'
const stub = {
    fs: {
        existsSync: sinon.stub(),
        writeFileSync: sinon.stub()
    },
    path: {
        join: sinon.stub().returns('C:/dev/build-monitor/config.json')
    },
    readline: {
        createInterface: sinon.stub().returns({
            question: sinon.stub(),
            write: sinon.stub()
        })
    },
    [configPath]: defaultConfig,
};
const answers = {
    'tests.path': './tests',
    'tests.formats': 'py',
    'results.path': 'C:/path/to/results',
    'results.formats': 'json',
    'remote': 'https://github.com/some/repo.git',
    'repoPath': 'C:/repo/path',
    'maxFailures': '10'
};
const configBasedOnAnswers = {
    'tests': {
        'path': './tests',
        'formats': [
            'py'
        ]
    },
    'results': {
        'path': 'C:/path/to/results',
        'formats': [
            'json'
        ]
    },
    'remote': 'https://github.com/some/repo.git',
    'repoPath': 'C:/repo/path',
    'maxFailures': 10
}

const configurationHelper = proxyquire('../../lib/utils/ConfigurationHelper', stub);

const config = configurationHelper.setupConfig();

describe('configurationHelper', () => {
    describe('setupConfig', () => {
        it('should match the default config settings if by default', () => {
            assert.deepEqual(defaultConfig, config);
        });

        it('should match the answers given during the setup', () => {
            configurationHelper.answers = answers;
            const customConfig = configurationHelper.setupConfig();

            assert.deepEqual(configBasedOnAnswers, customConfig);

            configurationHelper.answers = {}
        })
    });

    describe('askQuestions', () => {
        it('should call askQuestion once for each question', () => {
            const askQuestionStub = sinon.stub(configurationHelper, 'askQuestion');

            configurationHelper.askQuestions().then(() => {
                assert.equal(configurationHelper.askQuestion.callCount, Object.keys(setupQuestions).length);
            });

            askQuestionStub.restore();
        });
    });

    describe('parseQuestion', () => {
        it('should wrap the question messages in color tags', () => {
            const prefix = '\u001b[1;36m';
            const suffix = '\u001b[0m';

            const actual = configurationHelper.parseQuestion('', '');
            const expected = prefix + suffix;

            assert.equal(expected, actual);
        });

        it('should wrap the question messages in color tags and extend the question with '
            + 'multiple answers to choose from if the questionKey equals "overwrite"', () => {
            const prefix = '\u001b[1;36m';
            const suffix = '\u001b[0m';
            const choices = '\n[yes]\n[no]\n';

            const actual = configurationHelper.parseQuestion('overwrite', '');
            const expected = prefix + suffix + choices;

            assert.equal(expected, actual);
        });
    });

    describe('handleOverwrite', () => {
        it('should restart the question process if the answer does not equal "yes"', () => {
            const askQuestions = sinon.stub(configurationHelper, 'askQuestions');
            const promise = new Promise((resolve) => { resolve(); });
            askQuestions.returns(promise);
            configurationHelper.handleOverwrite('overwrite', '');

            assert.equal(askQuestions.called, true);

            askQuestions.restore();
        });

        it('should do nothing if the answer equals "yes"', () => {
            const askQuestions = sinon.stub(configurationHelper, 'askQuestions');
            const promise = new Promise((resolve) => { resolve(); });
            askQuestions.returns(promise);
            configurationHelper.handleOverwrite('overwrite', 'yes');

            assert.equal(askQuestions.called, false);

            askQuestions.restore();
        });
    });

    describe('askQuestion', () => {
        it('should not ask for an overwrite of the config file if none exists', () => {
            stub.fs.existsSync.returns(false);
            const askQuestionStub = sinon.stub(configurationHelper, 'askQuestion');
            configurationHelper.askQuestions().then(() => {
                assert.equal(configurationHelper.askQuestion.callCount, configurationHelper.questions.length - 1);
            });

            stub.fs.existsSync.reset();
            askQuestionStub.restore();
        });

        it('should ask for an overwrite of the config file if one exists', () => {
            stub.fs.existsSync.returns(true);
            const askQuestionStub = sinon.stub(configurationHelper, 'askQuestion');
            configurationHelper.askQuestions().then(() => {
                assert.equal(configurationHelper.askQuestion.callCount, configurationHelper.questions.length);
            });

            stub.fs.existsSync.reset();
            askQuestionStub.restore();
        });

        it('should not overwrite the current config if the data param equals "no"', () => {
            stub.fs.writeFileSync.reset();
            configurationHelper.answers.overwrite = 'no';
            configurationHelper.createConfig();

            assert.equal(stub.fs.writeFileSync.called, false);
        });
    });

    describe('storeAnswer', () => {
        it('should store the answer in the answers object with the questionKey as object key', () => {
            configurationHelper.answers = {};
            configurationHelper.storeAnswer('dummy key', 'dummy data');

            assert.deepEqual({ 'dummy key': 'dummy data' }, configurationHelper.answers);
        });
    });

    describe('createConfig', () => {
        it('should not create a config if answers.overwite is "no"', () => {
            configurationHelper.answers.overwrite = 'no';
            configurationHelper.createConfig();
            
            assert.equal(stub.fs.writeFileSync.called, false);
        });

        it('should create a config if answers.overwite is "yes"', () => {
            const expectedArgs = ['C:/dev/build-monitor/config.json', configAsJSONString, 'utf8'];

            configurationHelper.answers.overwrite = 'yes';
            configurationHelper.createConfig();

            assert.deepEqual(stub.fs.writeFileSync.getCall(0).args, expectedArgs);
        });
    });

    describe('init', () => {
        process.argv = [
            'C:\\Program Files\\nodejs\\node.exe',
            'C:\\dev\\build-monitor\\skippit.js',
        ];

        it('should not start the process of creating a config file if the config param is missing', () => {
            configurationHelper.askQuestions = sinon.stub().returns(new Promise((resolve) => resolve()));

            configurationHelper.init();
            assert.equal(configurationHelper.askQuestions.called, false);
        });

        it('should start the process of creating a config file if the config param is given', () => {
            configurationHelper.askQuestions = sinon.stub().returns(new Promise((resolve) => resolve()));
            process.argv.push('config');

            configurationHelper.init();
            assert.equal(configurationHelper.askQuestions.called, true);
        });
    });
});