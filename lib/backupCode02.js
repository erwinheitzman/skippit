'use babel'
'use strict'

const fs = require('fs')
const path = './results/'
const files = fs.readdirSync(path)
const xmldoc = require('xmldoc/lib/xmldoc')
let failedTests = []
let failedTestsCount = {}

files.forEach(file => {
  fs.readFile(path + file, 'utf8', (err, data) => {
    if (err) throw err;
    const xml = new xmldoc.XmlDocument(data)
    const testsuites = xml.children;
    const testcases = testsuites.children;

    testsuites.forEach(testsuite => {
      testsuite.children.forEach(testcase => {
        if (testcase.firstChild && testcase.firstChild.name === 'failure') {
          failedTests.push(testcase)
        }
      })
    })
  })
})
setTimeout(() => {
  for (let i = 0; i < failedTests.length; i++) {
    if (!failedTestsCount[failedTests[i].attr.name]) {
      failedTestsCount[failedTests[i].attr.name] = 1;
    } else {
      failedTestsCount[failedTests[i].attr.name]++
    }
  }
  for (var amount in failedTestsCount) {
    console.log(amount, failedTestsCount[amount]);
  }
}, 800)
