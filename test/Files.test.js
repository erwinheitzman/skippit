const path = require('path')
const absolutePath = path.resolve(__dirname, '../results')
const expect = require('chai').expect
const Files = require('../lib/Files').Files
const files = new Files

describe('Files.get', () => {
    const xmlFiles = [
        'C:\\dev\\build-monitor\\results\\results_01.xml',
        'C:\\dev\\build-monitor\\results\\results_02.xml',
        'C:\\dev\\build-monitor\\results\\results_03.xml',
        'C:\\dev\\build-monitor\\results\\results_04.xml'
    ]
    const jsFiles = [
        'C:\\dev\\build-monitor\\results\\dummyTestFiles\\evenMoreTests\\example.js',
        'C:\\dev\\build-monitor\\results\\dummyTestFiles\\moreTests\\andMore\\tests.js',
        'C:\\dev\\build-monitor\\results\\dummyTestFiles\\moreTests\\andMore\\tests2.js',
    ]

    it('should return a array of all files from the given directory', () => {
        const actual = files.get(absolutePath)

        expect(actual).to.deep.equal(xmlFiles)
    })

    it('should return a array of all files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, [], true)

        expect(actual).to.deep.equal(jsFiles.concat(xmlFiles))
    })

    it('should return a array of all xml files from the given directory', () => {
        const actual = files.get(absolutePath, ['xml'])

        expect(actual).to.deep.equal(xmlFiles)
    })

    it('should return a array of all xml files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, ['xml'], true)

        expect(actual).to.deep.equal(xmlFiles)
    })

    it('should return a array of all xml and js files from the given directory', () => {
        const actual = files.get(absolutePath, ['xml', 'js'])

        expect(actual).to.deep.equal(xmlFiles)
    })

    it('should return a array of all xml and js files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, ['xml', 'js'], true)

        expect(actual).to.deep.equal(jsFiles.concat(xmlFiles))
    })

    it('should return a array of all js files from the given directory', () => {
        const actual = files.get(absolutePath, ['js'])

        expect(actual).to.deep.equal([])
    })

    it('should return a array of all js files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, ['js'], true)

        expect(actual).to.deep.equal(jsFiles)
    })
})