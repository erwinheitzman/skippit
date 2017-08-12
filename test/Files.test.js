const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const path = require('path');
const resultsPath = 'C:/dev/temp_repo/results';
const filesStub = [
    'results_01.xml',
    'results_02.xml',
    'results_01.json',
    'results_02.json'
];
const subFilesStub = [
    'results_03.xml',
    'results_03.xml',
    'results_04.json',
    'results_04.json'
];
const FilesStub = {
    path: {
        isAbsolute: sinon.stub().returns(true)
    },
    fs: {
        existsSync: sinon.stub(),
        readdirSync: sinon.stub(),
        statSync: sinon.stub()
    }
}

const Files = proxyquire('../lib/Files', FilesStub);

describe('Files.get', () => {
    it('should return files (empty array) if the directory does not exist', () => {
        FilesStub.fs.existsSync.returns(false);

        assert.deepEqual(Files.get(resultsPath), []);
    });

    describe('no filter', () => {
        it('should return a array of all files from the given directory', () => {
            FilesStub.fs.existsSync.returns(true);
            FilesStub.fs.readdirSync.returns(filesStub);
            FilesStub.fs.statSync.returns({ isDirectory: sinon.stub().returns(false) });

            const actual = Files.get(resultsPath);
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/results_01.json',
                'C:/dev/temp_repo/results/results_02.json'
            ].map(result => path.normalize(result));

            assert.deepEqual(actual, expected);
        });

        it('should return a array of all files from the given directory and all sub directories', () => {
            const normalizedPath = path.normalize('C:/dev/temp_repo/results/sub_directory');

            FilesStub.fs.existsSync.returns(true);
            FilesStub.fs.readdirSync.returns(filesStub.concat(['sub_directory']));
            FilesStub.fs.readdirSync.withArgs(normalizedPath).returns(subFilesStub);
            FilesStub.fs.statSync.returns({ isDirectory: sinon.stub().returns(false) });
            FilesStub.fs.statSync.withArgs(normalizedPath).returns({ isDirectory: sinon.stub().returns(true) });

            const actual = Files.get(resultsPath, [], true);
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/results_01.json',
                'C:/dev/temp_repo/results/results_02.json',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml',
                'C:/dev/temp_repo/results/sub_directory/results_04.json',
                'C:/dev/temp_repo/results/sub_directory/results_04.json'
            ].map(result => path.normalize(result));

            assert.deepEqual(actual, expected);
        });
    });

    describe('one extention', () => {
        it('should return a array of all xml files from the given directory', () => {
            FilesStub.fs.existsSync.returns(true);
            FilesStub.fs.readdirSync.returns(filesStub);
            FilesStub.fs.statSync.returns({ isDirectory: () => false });

            const actual = Files.get(resultsPath, ['xml']);
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml'
            ].map(result => path.normalize(result));

            assert.deepEqual(actual, expected);
        });

        it('should return a array of all xml files from the given directory and all sub directories', () => {
            const normalizedPath = path.normalize('C:/dev/temp_repo/results/sub_directory');

            FilesStub.fs.existsSync.returns(true);
            FilesStub.fs.readdirSync.returns(filesStub.concat(['sub_directory']));
            FilesStub.fs.readdirSync.withArgs(normalizedPath).returns(subFilesStub);
            FilesStub.fs.statSync.returns({ isDirectory: sinon.stub().returns(false) });
            FilesStub.fs.statSync.withArgs(normalizedPath).returns({ isDirectory: sinon.stub().returns(true) });

            const actual = Files.get(resultsPath, ['xml'], true);
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml'
            ].map(result => path.normalize(result));

            assert.deepEqual(actual, expected);
        });
    });

    describe('two extentions', () => {
        it('should return a array of all xml and json files from the given directory', () => {
            FilesStub.fs.existsSync.returns(true);
            FilesStub.fs.readdirSync.returns(filesStub.concat([
                'results_01.test.js',
                'results_01.test.js'
            ]));
            FilesStub.fs.statSync.returns({ isDirectory: sinon.stub().returns(false) });

            const actual = Files.get(resultsPath, ['xml', 'json']);
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/results_01.json',
                'C:/dev/temp_repo/results/results_02.json'
            ].map(result => path.normalize(result));

            assert.deepEqual(actual, expected);
        });

        it('should return a array of all xml and json files from the given directory and all sub directories', () => {
            const normalizedPath = path.normalize('C:/dev/temp_repo/results/sub_directory');

            FilesStub.fs.existsSync.returns(true);
            FilesStub.fs.readdirSync.returns(filesStub.concat([
                'results_01.test.js',
                'results_01.test.js'
            ], ['sub_directory']));
            FilesStub.fs.readdirSync.withArgs(normalizedPath).returns(subFilesStub);
            FilesStub.fs.statSync.returns({ isDirectory: sinon.stub().returns(false) });
            FilesStub.fs.statSync.withArgs(normalizedPath).returns({ isDirectory: sinon.stub().returns(true) });

            const actual = Files.get(resultsPath, ['xml', 'json'], true);
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/results_01.json',
                'C:/dev/temp_repo/results/results_02.json',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml',
                'C:/dev/temp_repo/results/sub_directory/results_04.json',
                'C:/dev/temp_repo/results/sub_directory/results_04.json'
            ].map(result => path.normalize(result));

            assert.deepEqual(actual, expected);
        });
    });
});
