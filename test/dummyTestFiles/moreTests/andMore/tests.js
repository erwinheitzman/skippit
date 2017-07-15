<testsuites>
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
