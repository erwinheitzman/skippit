const path = require('path');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const promise = new Promise((resolve) => { resolve(); });
const callback = sinon.stub().returns(promise);

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
    './getConfig': config,
    'simple-git': sinon.stub().returns({
        cwd: sinon.stub(),
        clone: sinon.stub(),
        add: sinon.stub(),
        commit: sinon.stub(),
        push: sinon.stub()
    }),
    '../Tests': {
        disable: sinon.stub()
    },
};
const simpleGit = stub['simple-git']();
simpleGit.add.returns(simpleGit);
simpleGit.commit.returns(simpleGit);
simpleGit.push.yields(callback);

const { sourceControlHandler, gitHandler } = proxyquire.noCallThru().load('../../lib/utils/SourceControlHandler', stub);

describe('sourceControlHandler', () => {
    describe('pathToRepo', () => {
        it('should normalize path if path is absolute', () => {
            config.repoPath = 'C:/dev/temp_repo';
            stub.path.isAbsolute.returns(true);
    
            const actual = gitHandler.pathToRepo;
            const expected = stub.path.normalize('C:/dev/temp_repo');
    
            assert.equal(actual, expected);
            stub.path.isAbsolute.reset();
        });
    
        it('should resolve path with the process path if path is relative', () => {
            config.repoPath = './dev/temp_repo';
            stub.path.isAbsolute.returns(false);
    
            const actual = gitHandler.pathToRepo;
            const expected = stub.path.resolve(process.cwd(), './dev/temp_repo');
    
            assert.equal(actual, expected);
            stub.path.isAbsolute.reset();
        });
    });


    describe('remote', () => {
        assert.equal(sourceControlHandler.remote, stub['./getConfig'].remote);
    });

    describe('gitHandler', () => {
        describe('cloneRepoThenPushChanges', () => {
            it('should call it\'s callback function', () => {
                const cloneRepoThenPushChanges = sinon.stub(gitHandler, 'cloneRepoThenPushChanges');
                const logSuccessThenDisableTests = sinon.stub(gitHandler, 'logSuccessThenDisableTests');
    
                cloneRepoThenPushChanges(
                    gitHandler.remote,
                    gitHandler.pathToRepo,
                    logSuccessThenDisableTests(callback)
                );
    
                assert.equal(logSuccessThenDisableTests.called, true);
                assert.equal(callback.called, false);

                cloneRepoThenPushChanges.restore();
                logSuccessThenDisableTests.restore();
            });
        });

        describe('logSuccessThenDisableTests', () => {
            it('should call Tests.disable which should then call it\'s callback function', () => {
                stub['../Tests'].disable = sinon.stub();

                gitHandler.logSuccessThenDisableTests(callback);

                assert.equal(stub['../Tests'].disable.called, true);
                assert.equal(callback.called, false);
            });
        });

        describe('logSuccesThenProcessChanges', () => {
            it('should call Tests.disable which should then call it\'s callback function', () => {
                gitHandler.logSuccesThenProcessChanges(callback);

                assert.equal(simpleGit.add.called, true);
                assert.equal(simpleGit.commit.called, true);
                assert.equal(simpleGit.push.called, true);
                assert.equal(callback.called, true);
            });
        });

        // describe('Tests.disable', () => {
        //     it('should call logSuccesThenProcessChanges with callback as first param', () => {
        //         const logSuccesThenProcessChanges = sinon.stub(gitHandler, 'logSuccesThenProcessChanges');

        //         // gitHandler.logSuccessThenDisableTests(callback);
        //         stub['../Tests'].disable.calledWith(() => logSuccesThenProcessChanges(callback));

        //         assert.equal(logSuccesThenProcessChanges.called, true);
        //     });
        // });
    });
});
