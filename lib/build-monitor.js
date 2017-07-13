'use strict'

const fs = require('fs')
const Git = require("nodegit")
const path = './results/'
const files = fs.readdirSync(path)
const xmldoc = require('xmldoc/lib/xmldoc')
const testPath = './tests'
let failedTests = []
let failedTestsCount = {}

files.forEach(file => {
  const data = fs.readFileSync(path + file, 'utf8')
  const xml = new xmldoc.XmlDocument(data)
  const testsuites = xml.children

  testsuites.forEach(testsuite => {
    testsuite.children.forEach(testcase => {
      if (testcase.firstChild && testcase.firstChild.name === 'failure') {
        failedTests.push(testcase)
      }
    })
  })
})

for (let i = 0; i < failedTests.length; i++) {
  if (!failedTestsCount[failedTests[i].attr.name]) {
    failedTestsCount[failedTests[i].attr.name] = 1
  } else {
    failedTestsCount[failedTests[i].attr.name]++
  }
}

function getTestFiles (dir, files_) {
  files_ = files_ || []

  if (!fs.existsSync(dir)) {
    return files_
  }

  const files = fs.readdirSync(dir)
  for (const file in files) {
    const name = dir + '/' + files[file]

    if (fs.statSync(name).isDirectory()) {
      getTestFiles(name, files_)
    } else {
      files_.push(name)
    }
  }
  return files_
}

function setSkipTest(testPath, testName) {
  const regex = new RegExp('it(\\([\'|"]' + testName + '[\'|"],\\s?function\\s?\\(\\)\\s?{)')

  getTestFiles(testPath).forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err
      if (data.match(regex)) {
        fs.writeFile(file, data.replace(regex, 'it.skip$1'), 'utf8', err => {
          if (err) throw err
        })
      }
    })
  })
}

for (const test in failedTestsCount) {
  if (failedTestsCount[test] >= 3) {
    setSkipTest(testPath, test)
  }
}
