const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const path = require('path');

describe('Files.get', () => {
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

    it('should return files (empty array) if the directory does not exist', () => {
        const { Files } = proxyquire('../lib/Files',
            { fs: { existsSync: sinon.stub().returns(false) } });

        const files = new Files();

        expect(files.get('C:/dev/temp_repo/results')).to.deep.equal([]);
    });

    describe('no filter', () => {
        it('should return a array of all files from the given directory', () => {
            let expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/results_01.json',
                'C:/dev/temp_repo/results/results_02.json'
            ];

            expected = expected.map(result => path.normalize(result));

            const { Files } = proxyquire('../lib/Files', {
                path: { isAbsolute: sinon.stub().returns(true) },
                fs: {
                    existsSync: () => true,
                    readdirSync: () => filesStub,
                    statSync: () => ({ isDirectory: () => false })
                }
            });
            const files = new Files();

            expect(files.get('C:/dev/temp_repo/results')).to.deep.equal(expected);
        });

        it('should return a array of all files from the given directory and all sub directories', () => {
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

            const normalizedPath = path.normalize('C:/dev/temp_repo/results/sub_directory');

            const { Files } = proxyquire('../lib/Files', {
                path: { isAbsolute: sinon.stub().returns(true) },
                fs: {
                    existsSync: () => true,
                    readdirSync: (dir) => dir !== normalizedPath
                        ? filesStub.concat(['sub_directory'])
                        : subFilesStub,
                    statSync: (dir) => dir === normalizedPath
                        ? ({ isDirectory: () => true })
                        : ({ isDirectory: () => false })
                }
            });
            const files = new Files();

            expect(files.get('C:/dev/temp_repo/results', [], true)).to.deep.equal(expected);
        });
    });

    describe('one extention', () => {
        it('should return a array of all xml files from the given directory', () => {
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml'
            ].map(result => path.normalize(result));

            const { Files } = proxyquire('../lib/Files', {
                path: { isAbsolute: sinon.stub().returns(true) },
                fs: {
                    existsSync: () => true,
                    readdirSync: () => filesStub,
                    statSync: () => ({ isDirectory: () => false })
                }
            });
            const files = new Files();

            expect(files.get('C:/dev/temp_repo/results', ['xml'])).to.deep.equal(expected);
        });

        it('should return a array of all xml files from the given directory and all sub directories', () => {
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml',
                'C:/dev/temp_repo/results/sub_directory/results_03.xml'
            ].map(result => path.normalize(result));

            const normalizedPath = path.normalize('C:/dev/temp_repo/results/sub_directory');

            const { Files } = proxyquire('../lib/Files', {
                path: { isAbsolute: sinon.stub().returns(true) },
                fs: {
                    existsSync: () => true,
                    readdirSync: (dir) => dir !== normalizedPath
                        ? filesStub.concat(['sub_directory'])
                        : subFilesStub,
                    statSync: (dir) => dir === normalizedPath
                        ? ({ isDirectory: () => true })
                        : ({ isDirectory: () => false })
                }
            });
            const files = new Files();

            expect(files.get('C:/dev/temp_repo/results', ['xml'], true)).to.deep.equal(expected);
        });
    });

    describe('two extentions', () => {
        it('should return a array of all xml and json files from the given directory', () => {
            const expected = [
                'C:/dev/temp_repo/results/results_01.xml',
                'C:/dev/temp_repo/results/results_02.xml',
                'C:/dev/temp_repo/results/results_01.json',
                'C:/dev/temp_repo/results/results_02.json'
            ].map(result => path.normalize(result));

            const { Files } = proxyquire('../lib/Files', {
                path: { isAbsolute: sinon.stub().returns(true) },
                fs: {
                    existsSync: () => true,
                    readdirSync: () => filesStub.concat([
                        'results_01.test.js',
                        'results_01.test.js'
                    ]),
                    statSync: () => ({ isDirectory: () => false })
                }
            });
            const files = new Files();

            expect(files.get('C:/dev/temp_repo/results', ['xml', 'json'])).to.deep.equal(expected);
        });

        it('should return a array of all xml and json files from the given directory and all sub directories', () => {
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

            const normalizedPath = path.normalize('C:/dev/temp_repo/results/sub_directory');

            const { Files } = proxyquire('../lib/Files', {
                path: { isAbsolute: sinon.stub().returns(true) },
                fs: {
                    existsSync: () => true,
                    readdirSync: (dir) => dir !== normalizedPath
                        ? filesStub.concat(
                            ['results_01.test.js', 'results_01.test.js'],
                            ['sub_directory']
                        )
                        : subFilesStub,
                    statSync: (dir) => dir === normalizedPath
                        ? ({ isDirectory: () => true })
                        : ({ isDirectory: () => false })
                }
            });
            const files = new Files();

            expect(files.get('C:/dev/temp_repo/results', ['xml', 'json'], true)).to.deep.equal(expected);
        });
    });
});
