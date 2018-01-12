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
        const Results = proxyquire('../lib/Results', { './Files': { get: sinon.stub().returns(files) } });
        const configStub = {
            results: {
                path: '',
                formats: []
            }
        };


        assert.deepEqual(Results.get(configStub), files);
    });
});
