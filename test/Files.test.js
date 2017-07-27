const path = require('path')
const absolutePath = path.resolve(__dirname, 'dummyFiles')
const expect = require('chai').expect
const { Files } = require('../lib/Files')
const files = new Files

describe('Files.get', () => {
    const xmlFile = [ path.join(__dirname, 'dummyFiles\\results\\results_01.xml') ]
    const jsonFile = [ path.join(__dirname, 'dummyFiles\\results\\subFolder\\results_01.json') ]
    const jsFile = [ path.join(__dirname, 'dummyFiles\\tests\\tests_01.js') ]
    const testJsFile = [ path.join(__dirname, 'dummyFiles\\tests\\subFolder\\tests_01.test.js') ]

    it('should return a array of all files from the given directory', () => {
        const actual = files.get(absolutePath)

        expect(actual).to.deep.equal([])
    })

    it('should return a array of all files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, [], true)

        expect(actual).to.deep.equal([].concat(
            xmlFile,
            jsonFile,
            testJsFile,
            jsFile
        ))
    })

    it('should return a array of all xml files from the given directory', () => {
        const actual = files.get(path.join(absolutePath, 'results'), ['xml'])

        expect(actual).to.deep.equal(xmlFile)
    })

    it('should return a array of all xml files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, ['xml'], true)

        expect(actual).to.deep.equal(xmlFile)
    })

    it('should return a array of all xml and js files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, ['xml', 'js'], true)

        expect(actual).to.deep.equal([].concat(xmlFile, testJsFile, jsFile))
    })

    it('should return a array of all js files from the given directory', () => {
        const actual = files.get(absolutePath, ['js'])

        expect(actual).to.deep.equal([])
    })

    it('should return a array of all js files from the given directory and all sub directories', () => {
        const actual = files.get(absolutePath, ['json'], true)

        expect(actual).to.deep.equal(jsonFile)
    })
})