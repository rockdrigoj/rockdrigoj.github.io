
class Str {
    static space = /^\s*$/;
    static isNullOrEmpty = val => (val === undefined || val === null || val === "");
    static isNullOrWhitespace = val => (Str.isNullOrEmpty(val) || Str.space.test(val));
}

class YrUtils {
    static lockYear = 1908;
    static value = 1904;
    static lockedYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])(\/1908)$/;
    static fullYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])(\/1904)$/;
    static anyYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])[\/.]([0-9]+)$/;
    static monthDay = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])$/;

    static testLockedYear = val => YrUtils.lockedYear.test(val);
    static testFullYear = val => YrUtils.fullYear.test(val);
    static testAnyYear = val => YrUtils.anyYear.test(val);
    static testMonthDay = val => YrUtils.monthDay.test(val);

    static isValidTrimmedYear(val) {
        if (this.testMonthDay(val) === false) return false;
        var parts = val.match(YrUtils.monthDay);
        // not enought info
        if (parts.length !== 3) return false;

        let month = parseInt(parts[1]);
        let day = parseInt(parts[2]);

        return YrUtils.isValidDate(month, day, YrUtils.value);
    }

    static padDate = (val) => {
        var parts = val.match(YrUtils.monthDay);
        let padOne = n => n.length === 1 ? `0${n}` : n;
        let month = padOne(parts[1]);
        let day = padOne(parts[2]);

        return `${month}/${day}`;
    }

    static trimYear(val) {
        // already trimmed
        if (YrUtils.isValidTrimmedYear(val)) return val;
        let isValidDate = YrUtils.testAnyYear(val);

        if (isValidDate) {
            let end = val.lastIndexOf("/");
            let monthDay = val.substring(0, end);

            if (YrUtils.isValidTrimmedYear(monthDay)) {
                return monthDay;
            }
        }

        return null;
    }

    static isValidDate(month, day, year) {

        // not numbers
        if (isNaN(month)) return false;
        if (isNaN(day)) return false;
        if (isNaN(year)) return false;

        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        if (year < 0) return false;

        let monthsHaving31days = [1, 3, 5, 7, 8, 10, 12];
        let monthsHaving30days = [4, 6, 9, 11];
        let februaryCase = [2];

        let maxDay = 28;
        if (monthsHaving31days.indexOf(month) !== -1) maxDay = 31;
        if (monthsHaving30days.indexOf(month) !== -1) maxDay = 30;
        if (februaryCase.indexOf(month) !== -1) maxDay = 29;

        // validate day part
        return day <= maxDay;
    }

    static isValidAnyYear(val) {
        // not right format
        if (YrUtils.testAnyYear(val) === false) return false;

        var parts = val.match(YrUtils.anyYear);

        // not enought info
        if (parts.length !== 4) return false;

        let month = parseInt(parts[1]);
        let day = parseInt(parts[2]);
        let year = parseInt(parts[3]);

        return YrUtils.isValidDate(month, day, year);
    }

    static isValidEditableYear(val) {
        if (YrUtils.isValidAnyYear(val) === false) return false;
        return YrUtils.testFullYear(val);
    }

    static isValidLockedYear(val) {
        if (YrUtils.isValidAnyYear(val) === false) return false;
        return YrUtils.testLockedYear(val);
    }
}


// Birthday should be mm/dd only. 
// Year would be defaulted to 1904 on back-end as per XP-8402
let isValidBirthDate = (source, obj) => {

    if (Str.isNullOrWhitespace(obj.Value)) {
        obj.IsValid = true;
        return;
    }

    obj.IsValid = YrUtils.isValidAnyYear(obj.Value);
}

let setupBirthDate = () => {
    let txtBirthDate = $(".birth-date:first");
    if (txtBirthDate.length === 0) return;

    let initialValue = txtBirthDate.val();
    let fakeTxt = $(`<input type='text' maxlength='5' placeholder='MM/DD' value='${initialValue}'>`);
    let trimmedValue = YrUtils.trimYear(initialValue);
    if (Str.isNullOrWhitespace(trimmedValue) === false) {
        let formatted = YrUtils.padDate(trimmedValue);
        fakeTxt.val(formatted);

        if (YrUtils.isValidLockedYear(initialValue)) {
            // user is not allowed to change its birthday anymore
            fakeTxt.attr("disabled", "disabled");
        } else {
            txtBirthDate.val(`${formatted}/${YrUtils.value}`);
        }
    }

    fakeTxt.on('change', () => {
        let changedDate = fakeTxt.val();
        txtBirthDate.val(
            Str.isNullOrWhitespace(changedDate) ?
                changedDate :
                `${changedDate}/${YrUtils.value}`
        );
    });

    fakeTxt.insertAfter(txtBirthDate);
    txtBirthDate.hide();
};
