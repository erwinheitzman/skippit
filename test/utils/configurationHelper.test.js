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
        existsSync: sinon.stub().returns(false),
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
            configurationHelper.askQuestion = sinon.stub().returns(new Promise((resolve) => resolve()));

            configurationHelper.askQuestions().then(() => {
                assert.equal(configurationHelper.askQuestion.callCount, Object.keys(setupQuestions).length);
            });
        });
    });

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
});
