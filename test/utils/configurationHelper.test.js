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
    [configPath]: defaultConfig,
};

const configurationHelper = proxyquire('../../lib/utils/ConfigurationHelper', stub);

const config = configurationHelper.setupConfig();

describe('configurationHelper', () => {
    describe('setupConfig', () => {
        it('should match the default config settings if by default', () => {        
            assert.deepEqual(defaultConfig, config);
        });
    });

    describe('askQuestions', () => {
        it('should call askQuestion once for each question', () => {
            configurationHelper.askQuestions().then(() => {
                assert.equal(configurationHelper.askQuestion.callCount, Object.keys(setupQuestions).length);
            });
        });
    });

    // describe('askQuestion', () => {
    //     it('should not ask for an overwrite of the config file if none exists', () => {
    //         stub.fs.existsSync.returns(false);

    //         configurationHelper.askQuestion('overwrite');

    //         assert.equal(stub.readline.write.called, false);
    //         assert.equal(stub.readline.question.called, false);

    //         stub.fs.existsSync.reset();
    //     });

    //     it('should ask for an overwrite of the config file if one exists', () => {
    //         stub.fs.existsSync.returns(true);

    //         configurationHelper.askQuestion('overwrite');

    //         assert.equal(stub.readline.createInterface.write.called, true);
    //         assert.equal(stub.readline.createInterface.question.called, true);
    //     });
    // });

    describe('createConfig', () => {
        it('should not create a config if overwite is false', () => {
            configurationHelper.overwrite = false;
            configurationHelper.createConfig();
            
            assert.equal(stub.fs.writeFileSync.called, 0);
        });

        it('should not create a config if overwite is false', () => {
            const expectedArgs = ['C:/dev/build-monitor/config.json', configAsJSONString, 'utf8'];

            configurationHelper.overwrite = true;
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
