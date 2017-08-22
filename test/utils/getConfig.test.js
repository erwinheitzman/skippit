const path = require('path');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const getConfigPath = '../../lib/utils/getConfig';
const defaultConfig = require('../../lib/utils/defaultConfig.js');
const configPath = path.join(__dirname, '../../config.json');

const configStub = {
    fs: { existsSync: sinon.stub().returns(false) },
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

const mergedConfig = {
    tests: configStub[configPath].tests,
    results: configStub[configPath].results,
    remote: defaultConfig.remote,
    repoPath: defaultConfig.repoPath,
    maxFailures: defaultConfig.maxFailures
};

describe('getConfig', () => {
    it('should return default configurations by default', () => {
        const config = proxyquire(getConfigPath, configStub);

        assert.deepEqual(config, defaultConfig);
    });

    it('should return default config if no config file exists', () => {
        const config = proxyquire(getConfigPath, configStub);

        assert.deepEqual(config, defaultConfig);
    });

    it('should return a merge of default config and config.json', () => {
        configStub.fs.existsSync.returns(true);

        const config = proxyquire.noCallThru().load(getConfigPath, configStub);

        assert.deepEqual(config, mergedConfig);
    });
});
