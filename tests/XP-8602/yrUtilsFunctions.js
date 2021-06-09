

QUnit.module('XP-8602 YrUtils', hooks => {
    QUnit.test('isValidTrimmedYear', assert => {
        assert.true(YrUtils.isValidTrimmedYear("08/24"));
        assert.true(YrUtils.isValidTrimmedYear("8/24"));
        assert.false(YrUtils.isValidTrimmedYear("24/08/1984"));
        assert.false(YrUtils.isValidTrimmedYear("not a date"));
        assert.equal(YrUtils.trimYear(""), null);
    });

    QUnit.test('trimYear', assert => {
        assert.equal(YrUtils.trimYear("08/24/1984"), "08/24");
        assert.equal(YrUtils.trimYear("8/24/1984"), "8/24");
        assert.equal(YrUtils.trimYear("8/24/-1984"), null);
        assert.equal(YrUtils.trimYear("not a date"), null);
        assert.equal(YrUtils.trimYear("24/08/1984"), null);
    });

    QUnit.test('isValidDate', assert => {
        assert.true(YrUtils.isValidDate(2, 29, 1904));
        assert.true(YrUtils.isValidDate(12, 12, 1904));
        assert.true(YrUtils.isValidDate(1, 1, 0));
        assert.false(YrUtils.isValidDate(1, 32, 0));
        assert.false(YrUtils.isValidDate(0, 12, 1904));
        assert.false(YrUtils.isValidDate(12, 0, 1904));
        assert.false(YrUtils.isValidDate(13, 1, 1904));
        assert.false(YrUtils.isValidDate(2, 30, 1904));
    });

    QUnit.test('isValidAnyYear', assert => {
        assert.true(YrUtils.isValidAnyYear("1/1/1970"));
        assert.false(YrUtils.isValidAnyYear("13/32/-1"));
        assert.false(YrUtils.isValidAnyYear("08/24"));
    });

    QUnit.test('isValidEditableYear', assert => {
        assert.true(YrUtils.isValidEditableYear("01/01/1904"));
        assert.false(YrUtils.isValidEditableYear("01/1/2001"));
        assert.false(YrUtils.isValidEditableYear("08/24"));
    });

    QUnit.test('padDate', assert => {
        assert.equal(YrUtils.padDate("01/1"), "01/01");
        assert.equal(YrUtils.padDate("1/01"), "01/01");
        assert.equal(YrUtils.padDate("01/01"), "01/01");
        assert.equal(YrUtils.padDate("1/1"), "01/01");

        assert.equal(YrUtils.padDate("9/9"), "09/09");
        assert.equal(YrUtils.padDate("10/10"), "10/10");
        assert.equal(YrUtils.padDate("11/11"), "11/11");
    });
});

