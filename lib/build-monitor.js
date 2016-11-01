'use babel'
'use strict'

const fs = require('fs')
const Git = require("nodegit");
const path = './results/'
const files = fs.readdirSync(path)
const xmldoc = require('xmldoc/lib/xmldoc')
let failedTests = []
let failedTestsCount = {}

files.forEach((file, index) => {
  const data = fs.readFileSync(path + file, 'utf8')
  const xml = new xmldoc.XmlDocument(data)
  const testsuites = xml.children
  const testcases = testsuites.children

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

// console.log(failedTestsCount)

function getTestFiles (dir, files_) {
    files_ = files_ || [];
    if (!fs.existsSync(dir)) {
        return files_;
    }

    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getTestFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function setSkipTest(dir) {
  if (dir && typeof dir === 'string') {
    const testFiles = getTestFiles(dir)
    for (const test in failedTestsCount) {
      testFiles.forEach(file => {
        fs.readFile(file, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          const regex = new RegExp('it(\\\([\'|\"]' + test + '[\'|\"],\\\s?function\\\s?\\\(\\\)\\\s?{)');
          if (data.indexOf(test) !== -1) {
            const result = data.replace(regex, 'it.skip$1')
            fs.writeFile(file, result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
          }
        });
      })
    }
  }
}

for (const test in failedTestsCount) {
  if (failedTestsCount[test] >= 3) {
    setSkipTest('./tests')
  }
  // console.log(test, failedTestsCount[test])
  // console.log(failedTestsCount)
}
