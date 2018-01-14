const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const files = [
    'C:/dev/temp_repo/tests/tests_01.js',
    'C:/dev/temp_repo/tests/tests_02.js',
    'C:/dev/temp_repo/tests/tests_03.js',
    'C:/dev/temp_repo/tests/tests_04.js'
];
const file = `
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('Results.get', () => {
    const files = [
        'C:/dev/temp_repo/results/results_01.xml',
        'C:/dev/temp_repo/results/results_02.xml',
        'C:/dev/temp_repo/results/results_03.xml',
        'C:/dev/temp_repo/results/results_04.xml'
    ];

    it('should return the files it receives from Files.get', () => {
        const Results = proxyquire('../lib/Results', {
            './Files': { get: sinon.stub().returns(files) }
        });

        assert.deepEqual(Results.get(), files);
    });
});
`;
const fileProcessed = `
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('Results.get', () => {
    const files = [
        'C:/dev/temp_repo/results/results_01.xml',
        'C:/dev/temp_repo/results/results_02.xml',
        'C:/dev/temp_repo/results/results_03.xml',
        'C:/dev/temp_repo/results/results_04.xml'
    ];

    it.skip('should return the files it receives from Files.get', () => {
        const Results = proxyquire('../lib/Results', {
            './Files': { get: sinon.stub().returns(files) }
        });

        assert.deepEqual(Results.get(), files);
    });
});
`;
const failingTest = 'should return the files it receives from Files.get';

describe('Tests', () => {
    let testStub, tests, disableCallback;

    beforeEach(() => {
        testStub = {
            '../config': {
                tests: {
                    path: 'path/to/tests',
                    formats: ['js']
                },
                results: {
                    path: 'path/to/results',
                    formats: ['xml']
                },
                repoPath: 'path/to/repo',
                maxFailures: 3
            },
            'fs': {
                readFile: sinon.stub(),
                writeFile: sinon.stub(),
                existsSync: sinon.stub().returns(true)
            },
            './Files': { get: sinon.stub().returns(files) },
            './processors/XmlProcessor': { processFiles: sinon.stub() }
        };

        tests = proxyquire.noCallThru().load('../lib/Tests', testStub);
        disableCallback = sinon.stub();
    });

    describe('get', () => {
        it('should return the files it receives from Files.get', () => {
            assert.deepEqual(tests.get(), files);
        });
    });

    describe('disable', () => {
        it('should return name of the test to disable and the test file content', () => {
            testStub.fs.readFile.yields(null, file);
            testStub['./processors/XmlProcessor'].processFiles
                .returns({ [failingTest]: { failed: 4 } });

            tests.disable(disableCallback);
    
            assert.equal(testStub.fs.writeFile.getCall(3).args[0], files[3]);
            assert.equal(testStub.fs.writeFile.getCall(3).args[1], fileProcessed);
        });
    
        describe('when fs.writeFile returns an error', () => {
            it('should pass the error to the callback and throw the error', () => {
                testStub.fs.readFile.yields(null, file);
                testStub.fs.writeFile.yields('this is dummy error 1');
                testStub['./processors/XmlProcessor'].processFiles
                    .returns({ [failingTest]: { failed: 4 } });
    
                assert.throws(() => tests.disable(disableCallback), /this is dummy error 1/);
            });
        });
    
        describe('when fs.readFile returns an error', () => {
            it('should pass the error to the callback and throw the error', () => {
                testStub.fs.readFile.yields('this is dummy error 2');
                testStub['./processors/XmlProcessor'].processFiles
                    .returns({ [failingTest]: { failed: 4 } });
    
                assert.throws(() => tests.disable(disableCallback), /this is dummy error 2/);
                assert.equal(testStub.fs.writeFile.notCalled, true);
            });
        });
    });
});
