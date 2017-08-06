const path = require('path');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const configPath = path.join(__dirname, '../config');
const configStub = {
    fs: { existsSync: sinon.stub().returns(false) },
    [configPath]: {
        tests: {
            path: './tests',
            formats: [
                'js'
            ]
        },
        results: {
            path: 'C:/dev/temp_repo/results',
            formats: [
                'xml'
            ]
        }
    }
};

describe('getConfig', () => {
    const defaultConfig = {
        tests: {
            path: [],
            formats: []
        },
        results: {
            path: [],
            formats: []
        },
        remote: [],
        repoPath: [],
        maxFailures: []
    };

    const mergedConfig = {
        tests: {
            path: './tests',
            formats: [
                'js'
            ]
        },
        results: {
            path: 'C:/dev/temp_repo/results',
            formats: [
                'xml'
            ]
        },
        remote: [],
        repoPath: [],
        maxFailures: []
    };

    it('should return default configurations by default', () => {
        const config = proxyquire('../lib/utils/getConfig', configStub);

        expect(config).to.deep.equal(defaultConfig);
    });

    it('should return default config if no config file exists', () => {
        const config = proxyquire('../lib/utils/getConfig', configStub);

        expect(config).to.deep.equal(defaultConfig);
    });

    it('should return a merge of default config and config.json', () => {
        configStub.fs.existsSync.returns(true);

        const config = proxyquire.noCallThru()
            .load('../lib/utils/getConfig', configStub);

        expect(config).to.deep.equal(mergedConfig);
    });
});
