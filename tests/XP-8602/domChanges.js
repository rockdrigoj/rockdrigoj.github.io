

QUnit.module('XP-8602 DOM changes', hooks => {
    QUnit.test('to clear value is ok', assert => {
        setupDom('08/24/1984');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        fke.val("");
        triggerChange();

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), "");
        assert.equal(fke.val(), "");

        assert.equal(validationResult.IsValid, true);
    });

    QUnit.test('to fix invalid value is ok', assert => {
        setupDom('day-month-year');
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        fke.val("08/08");
        triggerChange();

        let validationResult = {
            IsValid: false,
            Value: ctl.val()
        };

        isValidBirthDate(null, validationResult);

        assert.equal(ctl.val(), "08/08/1904");
        assert.equal(fke.val(), "08/08");

        assert.equal(validationResult.IsValid, true);
    });


    QUnit.test('test ranges', assert => {
        let padding = (n) => {
            let chars = n.toString();
            return chars.length === 1 ? `0${n}` : `${n}`;
        };
        let monthsHaving31days = [1, 3, 5, 7, 8, 10, 12];
        let monthsHaving30days = [4, 6, 9, 11];
        let februaryCase = [2];
        setupDom();
        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        for (let i = -5; i < 15; i++) {
            let month = i + 1;

            let maxDay = 31;
            if (monthsHaving31days.indexOf(month) !== -1) maxDay = 31;
            if (monthsHaving30days.indexOf(month) !== -1) maxDay = 30;
            if (februaryCase.indexOf(month) !== -1) maxDay = 29;

            for (let j = -5; j < 35; j++) {
                let day = j + 1;

                let shouldBeValid = month >= 1 && day >= 1 && day <= maxDay && month <= 12;

                fke.val(`${padding(month)}/${padding(day)}`);
                triggerChange();

                let validationResult = {
                    IsValid: false,
                    Value: ctl.val()
                };

                isValidBirthDate(null, validationResult);

                assert.equal(validationResult.IsValid, shouldBeValid);

                if (validationResult.IsValid !== shouldBeValid)
                    console.log(`${ctl.val()} should be ${shouldBeValid} but it is ${validationResult.IsValid}`);
            }
        }
    });

});

