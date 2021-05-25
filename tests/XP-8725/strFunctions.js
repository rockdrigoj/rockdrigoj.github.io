

QUnit.module('XP-8725 Str', hooks => {
    QUnit.test('isNullOrEmpty', assert => {
        assert.true(Str.isNullOrEmpty());
        assert.true(Str.isNullOrEmpty(""));
        assert.true(Str.isNullOrEmpty(null));
        assert.true(Str.isNullOrEmpty(undefined));
        assert.false(Str.isNullOrEmpty(" "));
        assert.false(Str.isNullOrEmpty("\t"));
        assert.false(Str.isNullOrEmpty("Hello World!"));
    });

    QUnit.test('isNullOrWhitespace', assert => {
        assert.true(Str.isNullOrWhitespace());
        assert.true(Str.isNullOrWhitespace(""));
        assert.true(Str.isNullOrWhitespace(null));
        assert.true(Str.isNullOrWhitespace(undefined));
        assert.true(Str.isNullOrWhitespace(" "));
        assert.true(Str.isNullOrWhitespace("\t"));
        assert.false(Str.isNullOrWhitespace("Hello World!"));
    });
});

