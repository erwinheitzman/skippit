const path = require('path');
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('sourceControlHandler', () => {
    let config, stub, proxyFile, simpleGit, promise, callback;

    beforeEach(() => {
        config = {
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
        stub = {
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
        promise = new Promise((resolve) => { resolve(); });
        callback = sinon.stub().returns(promise);
        proxyFile = proxyquire.noCallThru().load('../../lib/utils/SourceControlHandler', stub);
        simpleGit = stub['simple-git']()
        simpleGit.add.returns(simpleGit);
        simpleGit.commit.returns(simpleGit);
        simpleGit.push.yields(callback);
    });

    describe('pathToRepo', () => {
        it('should normalize path if path is absolute', () => {
            config.repoPath = 'C:/dev/temp_repo';
            stub.path.isAbsolute.returns(true);
    
            const actual = proxyFile.gitHandler.pathToRepo;
            const expected = stub.path.normalize('C:/dev/temp_repo');
    
            assert.equal(actual, expected);
        })
    
        it('should resolve path with the process path if path is relative', () => {
            config.repoPath = './dev/temp_repo';
            stub.path.isAbsolute.returns(false);
    
            const actual = proxyFile.gitHandler.pathToRepo;
            const expected = stub.path.resolve(process.cwd(), './dev/temp_repo');
    
            assert.equal(actual, expected);
        });
    });


    describe('remote', () => {
        it('should match the remote property of the default config', () => {
            assert.equal(proxyFile.sourceControlHandler.remote, stub['./getConfig'].remote);
        });
    });

    describe('gitHandler', () => {
        describe('cloneRepoThenPushChanges', () => {
            it('should call it\'s callback function', () => {
                const cloneRepoThenPushChanges = sinon.stub(proxyFile.gitHandler, 'cloneRepoThenPushChanges');
                const logSuccessThenDisableTests = sinon.stub(proxyFile.gitHandler, 'logSuccessThenDisableTests');
    
                cloneRepoThenPushChanges(
                    proxyFile.gitHandler.remote,
                    proxyFile.gitHandler.pathToRepo,
                    logSuccessThenDisableTests(callback)
                );
    
                assert.equal(logSuccessThenDisableTests.called, true);
                assert.equal(callback.called, false);
            });
        });

        describe('logSuccessThenDisableTests', () => {
            it('should call Tests.disable which should then call it\'s callback function', () => {
                proxyFile.gitHandler.logSuccessThenDisableTests(callback);

                assert.equal(stub['../Tests'].disable.called, true);
                assert.equal(callback.called, false);
            });
        });

        describe('logSuccesThenProcessChanges', () => {
            it('should call simple-git which should then call it\'s callback function', () => {
                proxyFile.gitHandler.logSuccesThenProcessChanges(callback);

                assert.equal(simpleGit.add.called, true);
                assert.equal(simpleGit.commit.called, true);
                assert.equal(simpleGit.push.called, true);
                assert.equal(callback.called, true);
            });
        });
    });
});
