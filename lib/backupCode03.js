// files.forEach(file => {
//   fs.readFile(path + file, 'utf8', (err, data) => {
//     if (err) throw err;
//     const xml = new xmldoc.XmlDocument(data)
//     const testsuites = xml.children;
//     const testcases = testsuites.children;
//
//     testsuites.forEach(testsuite => {
//       testsuite.children.forEach(testcase => {
//         if (testcase.firstChild && testcase.firstChild.name === 'failure') {
//           failedTests.push(testcase)
//         }
//       })
//     })
//   })
// })
// setTimeout(() => {
//   for (let i = 0; i < failedTests.length; i++) {
//     if (!failedTestsCount[failedTests[i].attr.name]) {
//       failedTestsCount[failedTests[i].attr.name] = 1;
//     } else {
//       failedTestsCount[failedTests[i].attr.name]++
//     }
//   }
//   for (var amount in failedTestsCount) {
//     console.log(amount, failedTestsCount[amount]);
//   }
// }, 800)

// function test1(callback) {
//   files.forEach((file, index) => {
//     const data = fs.readFileSync(path + file, 'utf8')
//     const xml = new xmldoc.XmlDocument(data)
//     const testsuites = xml.children;
//     const testcases = testsuites.children;
//
//     testsuites.forEach(testsuite => {
//       testsuite.children.forEach(testcase => {
//         if (testcase.firstChild && testcase.firstChild.name === 'failure') {
//           failedTests.push(testcase)
//         }
//       })
//     })
//   })
//   callback()
// }
//
// function test2(callback) {
//   for (let i = 0; i < failedTests.length; i++) {
//     if (!failedTestsCount[failedTests[i].attr.name]) {
//       failedTestsCount[failedTests[i].attr.name] = 1;
//     } else {
//       failedTestsCount[failedTests[i].attr.name]++
//     }
//   }
//   callback()
// }
//
// function test3() {
//   for (var amount in failedTestsCount) {
//     console.log(amount, failedTestsCount[amount]);
//   }
// }

// function test4() {
//   test1(function () {
//     test2(function () {
//       test3();
//     });
//   });
// }
//
// test4();
