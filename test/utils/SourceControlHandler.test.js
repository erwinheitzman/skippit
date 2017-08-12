const path = require('path');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const config = {
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
    remote: 'https://github.com/host/repo.git',
    repoPath: null,
    maxFailures: 3
};

const stub = {
    path: {
        isAbsolute: sinon.stub(),
        normalize: sinon.stub(),
        resolve: sinon.stub()
    },
    fs: {
        existsSync: sinon.stub(),
        mkdirSync: sinon.stub()
    },
    '../Tests': sinon.stub(),
    './getConfig': config,
    'simple-git': () => ({
        cwd: sinon.stub(),
        clone: sinon.stub()
    }),
    disableTestsAndPushChanges: sinon.stub()
};

const { sourceControlHandler, gitHandler } = proxyquire.noCallThru().load('../../lib/utils/SourceControlHandler', stub);

describe('sourceControlHandler', () => {
    describe('gitHandler', () => {
        afterEach(() => stub.fs.existsSync.reset());

        it('should normalize path if path is absolute', () => {
            config.repoPath = 'C:/dev/temp_repo';
            stub.path.isAbsolute.returns(true);

            gitHandler.disableTestsAndPushChanges(() => {});

            const actual = stub.fs.existsSync.getCall(0).args[0];
            const expected = stub.path.normalize('C:/dev/temp_repo');

            assert.equal(actual, expected);
        });

        it('should resolve path with the process path if path is relative', () => {
            config.repoPath = './dev/temp_repo';

            gitHandler.disableTestsAndPushChanges(() => {});

            const actual = stub.fs.existsSync.getCall(0).args[0];
            const expected = stub.path.resolve(process.cwd(), './dev/temp_repo');

            assert.equal(actual, expected);
        });
    });
});
