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
describe('13849 - SDFSDFSDF', function () {
    const testDecleration = () => '21598 - AFailingTest as an example'

    it.skip('AFailingTest', testDecleration);

    it.skip('21598 - AFailingTest', function () {
        sdfuhsdfkhsf();
        example();
        '21598 - AFailingTest as an example'
    });
  
    it.skip('AFailingTest', function () {
        sdfuhsdfkhsf();
        example();
        '21598 - AFailingTest as an example'
    });

    it.skip('AFailingTest', function (param) {
        sdfuhsdfkhsf(param);
        example();
        '21598 - AFailingTest as an example'
    });

    it.skip('AFailingTest', (param) => {
        sdfuhsdfkhsf();
        example();
        '21598 - AFailingTest as an example'
    });

    it.skip('AFailingTest', () => {
        sdfuhsdfkhsf();
        example();
        '21598 - AFailingTest as an example'
    });

    it.skip('AFailingTest', () => example());
    it.skip('AFailingTest', param => example());

    it('AFailingTest 21598 - ', () => {
        sdfuhsdfkhsf();
        example();
        '21598 - AFailingTest as an example'
    });

    suite('example', () => {
        test.skip('21598 - AFailingTest', function () {
            sdfuhsdfkhsf()
            example()
            '21598 - AFailingTest as an example'
        })

        test.skip('AFailingTest', function () {
            sdfuhsdfkhsf()
            example()
            '21598 - AFailingTest as an example'
        })

        test.skip('AFailingTest', function (param) {
            sdfuhsdfkhsf(param)
            example()
            '21598 - AFailingTest as an example'
        })

        test.skip('AFailingTest', (param) => {
            sdfuhsdfkhsf()
            example()
            '21598 - AFailingTest as an example'
        })

        test.skip('AFailingTest', () => {
            sdfuhsdfkhsf()
            example()
            '21598 - AFailingTest as an example'
        })

        test.skip('AFailingTest', () => example())
        test.skip('AFailingTest', param => example())

        test('AFailingTest 21598 - ', () => {
            sdfuhsdfkhsf()
            example()
            '21598 - AFailingTest as an example'
        })
    })
});
<testcase classname="foo89" name="21598 - 4545435434"/>
"DATE:20091201T220000\r\nSUMMARY:Dad's birthday"
'DATE:20091201T220000\r\nSUMMARY:Dad\'s birthday'
'DATE:20091201T220000\r\nSUMMARY:Dad\'s birthday'
'DATE:20091201T220000\r\nSUMMARY:Dad\'s birthday'
'DATE:20091201T220000\r\nSUMMARY:Dad\'s birthday'
'DATE:20091201T220000\r\nSUMMARY:Dad\'s birthday'
'DATE:20091201T220000\r\nSUMMARY:Dad\'s birthday'
