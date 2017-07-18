const path = require('path')
const absolutePath = path.resolve(__dirname, '../results')
const expect = require('chai').expect
const { Files } = require('../lib/Files')
const files = new Files

describe('Files.get', () => {
    const xmlFiles = [
        path.join(__dirname, '..', 'results\\results_01.xml'),
        path.join(__dirname, '..', 'results\\results_02.xml'),
        path.join(__dirname, '..', 'results\\results_03.xml'),
        path.join(__dirname, '..', 'results\\results_04.xml'),
    ]
    const jsonFiles = [
        path.join(__dirname, '..', 'results\\results_01.json'),
        path.join(__dirname, '..', 'results\\results_02.json'),
        path.join(__dirname, '..', 'results\\results_03.json'),
        path.join(__dirname, '..', 'results\\results_04.json'),
    ]
    const jsFiles = [
        path.join(__dirname, '..', 'results\\dummyTestFiles\\evenMoreTests\\example.js'),
        path.join(__dirname, '..', 'results\\dummyTestFiles\\moreTests\\andMore\\tests.js'),
        path.join(__dirname, '..', 'results\\dummyTestFiles\\moreTests\\andMore\\tests2.js'),
    ]
    const allFilesInRootFolder = [
        path.join(__dirname, '..', 'results\\results_01.json'),
        path.join(__dirname, '..', 'results\\results_01.xml'),
        path.join(__dirname, '..', 'results\\results_02.json'),    
        path.join(__dirname, '..', 'results\\results_02.xml'),
        path.join(__dirname, '..', 'results\\results_03.json'),
        path.join(__dirname, '..', 'results\\results_03.xml'),
        path.join(__dirname, '..', 'results\\results_04.json'),
        path.join(__dirname, '..', 'results\\results_04.xml'),
    ]

    it('should return a array of all files from the given directory', () => {
        const actual = files.get(absolutePath)

        expect(actual).to.deep.equal(allFilesInRootFolder)
    })

    it('should return a array of all files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, [], true)

        expect(actual).to.deep.equal(jsFiles.concat(allFilesInRootFolder))
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