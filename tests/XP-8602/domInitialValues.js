
QUnit.module('XP-8602 initial DOM values', hooks => {

    QUnit.test('isValidBirthDate with empty value', assert => {
        let it = { IsValid: false };
        isValidBirthDate(null, it);
        assert.true(it.IsValid);

        it.Value = null;
        isValidBirthDate(null, it);
        assert.true(it.IsValid);

        it.Value = "";
        isValidBirthDate(null, it);
        assert.true(it.IsValid);

        it.Value = "  ";
        isValidBirthDate(null, it);
        assert.true(it.IsValid);

        it.Value = "\t ";
        isValidBirthDate(null, it);
        assert.true(it.IsValid);
    });

    QUnit.test('.birth-date should be hidden', assert => {
        setupDom();
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        assert.equal(ctl.length, 1);
        assert.equal(ctl.is(":visible"), false);
        assert.equal(fke.length, 1);
        assert.equal(fke.is(":visible"), true);

        assert.equal(fke.attr("maxlength"), "5");
    });

    QUnit.test('empty value is ok', assert => {
        setupDom();
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), "");
        assert.equal(fke.val(), "");

        assert.equal(validationResult.IsValid, true);
    });

    QUnit.test('invalid regex value is not ok', assert => {
        setupDom();
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");
        let invalidValue = "test";
        fke.val(invalidValue);
        triggerChange();

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `${invalidValue}/1904`);
        assert.equal(fke.val(), `${invalidValue}`);

        assert.equal(validationResult.IsValid, false);
    });

    QUnit.test('valid value is ok', assert => {
        setupDom('1/1/1904');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `01/01/1904`);
        assert.equal(fke.val(), `01/01`);

        assert.equal(validationResult.IsValid, true);
    });

    QUnit.test('valid value padding 0s is ok', assert => {
        setupDom('01/01/1904');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `01/01/1904`);
        assert.equal(fke.val(), `01/01`);

        assert.equal(validationResult.IsValid, true);
    });

    QUnit.test('not valid year is ok', assert => {
        setupDom('1/1/84');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `01/01/1904`);
        assert.equal(fke.val(), `01/01`);

        assert.equal(validationResult.IsValid, true);
    });

    QUnit.test('fixed value is ok', assert => {
        setupDom('1/1');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `01/01/1904`);
        assert.equal(fke.val(), `01/01`);

        assert.equal(validationResult.IsValid, true);
    });

    QUnit.test('not valid month is no ok', assert => {
        setupDom('13/1');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `13/1`);
        assert.equal(fke.val(), `13/1`);

        assert.equal(validationResult.IsValid, false);
    });

    QUnit.test('not valid day is no ok', assert => {
        setupDom('1/32');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), `1/32`);
        assert.equal(fke.val(), `1/32`);

        assert.equal(validationResult.IsValid, false);
    });
});
