const path = require('path');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const configPath = path.join(__dirname, '../../config.json');
const getConfigStub = {
    fs: { existsSync: sinon.stub() },
    [configPath]: {
        tests: {
            path: './path/to/tests',
            formats: [
                'js'
            ]
        },
        results: {
            path: './path/to/results',
            formats: [
                'xml'
            ]
        }
    }
};

const defaultConfig = require('../../lib/utils/defaultConfig.js');
const mergedConfig = {
    tests: getConfigStub[configPath].tests,
    results: getConfigStub[configPath].results,
    remote: defaultConfig.remote,
    repoPath: defaultConfig.repoPath,
    maxFailures: defaultConfig.maxFailures
};

describe('getConfig', () => {

    it('should return default config if no config file exists', () => {
        getConfigStub.fs.existsSync.returns(false);    
        const config = proxyquire.noCallThru().load('../../lib/utils/getConfig', getConfigStub)

        assert.deepEqual(config, defaultConfig);
    });

    it('should return a merge of default config and config.json', () => {
        getConfigStub.fs.existsSync.returns(true);
        const config = proxyquire.noCallThru().load('../../lib/utils/getConfig', getConfigStub)
        
        assert.deepEqual(config, mergedConfig);
    });
});
