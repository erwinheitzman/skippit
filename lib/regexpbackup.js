let resta = new RegExp('it(\\\([\'|\"]' + test + '[\'|\"],\\\s?function\\\s?\\\(\\\)\\\s?{)');
undefined
resta
/it(\(['|"]21598 - AFailingTest as an example['|"],\s?function\s?\(\)\s?{)/
`<testsuites>
  <testsuite tests="3">
    <testcase classname="foo1" name="ASuccessfulTest"/>
    <testcase classname="foo2" name="AnotherSuccessfulTest"/>
    <testcase classname="foo3" name="AFailingTest">
      <failure type="NotEnoughFoo"> details about failure </failure>
    </testcase>
    <testcase classname="foo3" name="AFailingTest">
      <failure type="NotEnoughFoo"> details about failure </failure>
    </testcase>
    <testcase classname="foo89" name="21598 - AFailingTest">
      <failure type="NotEnoughFoozst"> details about failure </failure>
    </testcase>
  </testsuite>
</testsuites>
describe('13849 - SDFSDFSDF', function () {
	it('21598 - AFailingTest as an example', function () {
		sdfuhsdfkhsf();
		21598 - AFailingTest as an example();
		'21598 - AFailingTest as an example'
	});
});
<testcase classname="foo89" name="21598 - 4545435434"/>
"DATE:20091201T220000\r\nSUMMARY:Dad's birthday"
DATE:20091201T220000\r\nSUMMARY:Dad's birthday`.replace(resta, 'it.skip$1')
"<testsuites>
  <testsuite tests="3">
    <testcase classname="foo1" name="ASuccessfulTest"/>
    <testcase classname="foo2" name="AnotherSuccessfulTest"/>
    <testcase classname="foo3" name="AFailingTest">
      <failure type="NotEnoughFoo"> details about failure </failure>
    </testcase>
    <testcase classname="foo3" name="AFailingTest">
      <failure type="NotEnoughFoo"> details about failure </failure>
    </testcase>
    <testcase classname="foo89" name="21598 - AFailingTest">
      <failure type="NotEnoughFoozst"> details about failure </failure>
    </testcase>
  </testsuite>
</testsuites>
describe('13849 - SDFSDFSDF', function () {
	it.skip('21598 - AFailingTest as an example', function () {
		sdfuhsdfkhsf();
		21598 - AFailingTest as an example();
		'21598 - AFailingTest as an example'
	});
});
<testcase classname="foo89" name="21598 - 4545435434"/>
"DATE:20091201T220000
SUMMARY:Dad's birthday"
DATE:20091201T220000
SUMMARY:Dad's birthday"
