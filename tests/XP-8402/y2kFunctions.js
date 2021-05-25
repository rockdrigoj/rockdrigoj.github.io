

QUnit.module('XP-8402 Y2k', hooks => {
    QUnit.test('isValidTrimmedYear', assert => {
        assert.true(Y2k.isValidTrimmedYear("08/24"));
        assert.true(Y2k.isValidTrimmedYear("8/24"));
        assert.false(Y2k.isValidTrimmedYear("24/08/1984"));
        assert.false(Y2k.isValidTrimmedYear("not a date"));
        assert.equal(Y2k.trimYear(""), null);
    });

    QUnit.test('trimYear', assert => {
        assert.equal(Y2k.trimYear("08/24/1984"), "08/24");
        assert.equal(Y2k.trimYear("8/24/1984"), "8/24");
        assert.equal(Y2k.trimYear("8/24/-1984"), null);
        assert.equal(Y2k.trimYear("not a date"), null);
        assert.equal(Y2k.trimYear("24/08/1984"), null);
    });

    QUnit.test('isValidDate', assert => {
        assert.true(Y2k.isValidDate(2, 29, 2000));
        assert.true(Y2k.isValidDate(12, 12, 2000));
        assert.true(Y2k.isValidDate(1, 1, 0));
        assert.false(Y2k.isValidDate(1, 32, 0));
        assert.false(Y2k.isValidDate(0, 12, 2000));
        assert.false(Y2k.isValidDate(12, 0, 2000));
        assert.false(Y2k.isValidDate(13, 1, 2000));
        assert.false(Y2k.isValidDate(2, 30, 2000));
    });

    QUnit.test('isValidAnyYear', assert => {
        assert.true(Y2k.isValidAnyYear("1/1/1970"));
        assert.false(Y2k.isValidAnyYear("13/32/-1"));
        assert.false(Y2k.isValidAnyYear("08/24"));
    });

    QUnit.test('isValid2kYear', assert => {
        assert.true(Y2k.isValid2kYear("01/01/2000"));
        assert.false(Y2k.isValid2kYear("01/1/2001"));
        assert.false(Y2k.isValid2kYear("08/24"));
    });

    QUnit.test('padDate', assert => {
        assert.equal(Y2k.padDate("01/1"), "01/01");
        assert.equal(Y2k.padDate("1/01"), "01/01");
        assert.equal(Y2k.padDate("01/01"), "01/01");
        assert.equal(Y2k.padDate("1/1"), "01/01");

        assert.equal(Y2k.padDate("9/9"), "09/09");
        assert.equal(Y2k.padDate("10/10"), "10/10");
        assert.equal(Y2k.padDate("11/11"), "11/11");
    });
});

