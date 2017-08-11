const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const logStub = {
    fs: { writeFile: sinon.stub() },
    disabledTests: sinon.stub(),
    formatDate: sinon.stub(),
    formatTime: sinon.stub()
};

const logger = proxyquire.noCallThru().load('../lib/Logger', logStub);

const date = new Date(86, 2, 18, 13, 49, 33);
const expectedLogOutput = `[
    {
        "file": "1st file",
        "test": "1st test"
    },
    {
        "file": "2nd file",
        "test": "2nd test"
    }
]`;

describe('Logger', () => {
    describe('disabledTests', () => {
        it('should return an empty array by default', () => {
            assert.deepEqual(logger.disabledTests, []);
        });

        it('should return an array containing objects referring to the disabled test + in which file it originates', () => {
            const firstEntry = { file: '1st file', test: '1st test' };
            const secondEntry = { file: '2nd file', test: '2nd test' };

            logger.disabledTests = firstEntry;
            logger.disabledTests = secondEntry;

            assert.deepEqual(logger.disabledTests, [firstEntry, secondEntry]);
        });
    });

    describe('formatDate', () => {
        it('should return a string formatted as "FullYear-Month-Day"', () => {
            assert.equal(logger.formatDate(date), '1986-3-18');
        });
    });

    describe('formatTime', () => {
        it('should return a string formatted as "Hours-Minutes-Seconds"', () => {
            assert.equal(logger.formatTime(date), '13-49-33');
        });
    });

    describe('createLogFile', () => {
        it('should be called with "./disabled FullYear-Month-Day Hours-Minutes-Seconds.json" as first argument', () => {
            const d = sinon.stub(global, 'Date').returns(date);

            logger.createLogFile();

            const actual = logStub.fs.writeFile.getCall(0).args[0];

            assert.equal(actual, './disabled 1986-3-18 13-49-33.json');

            d.restore();
        });

        it('should be called with the data to write as second argument', () => {
            const firstEntry = { file: '1st file', test: '1st test' };
            const secondEntry = { file: '2nd file', test: '2nd test' };

            logger.disabledTests = firstEntry;
            logger.disabledTests = secondEntry;

            logger.createLogFile();

            const actual = logStub.fs.writeFile.getCall(0).args[1];

            assert.deepEqual(actual, expectedLogOutput);
        });

        it('should throw an error when fs.writeFile returns an error', () => {
            logStub.fs.writeFile.yields('this is dummy error 1')

            assert.throws(() => logger.createLogFile(), /this is dummy error 1/);
        });
    });
});
