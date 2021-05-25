
class Str {
    static space = /^\s*$/;
    static isNullOrEmpty = val => (val === undefined || val === null || val === "");
    static isNullOrWhitespace = val => (Str.isNullOrEmpty(val) || Str.space.test(val));
}

class Y2k {
    static value = 2000;
    static fullYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])(\/2000)$/;
    static anyYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])[\/.]([0-9]+)$/;
    static monthDay = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])$/;

    static testFullYear = val => Y2k.fullYear.test(val);
    static testAnyYear = val => Y2k.anyYear.test(val);
    static testMonthDay = val => Y2k.monthDay.test(val);

    static isValidTrimmedYear(val) {
        if (this.testMonthDay(val) === false) return false;
        var parts = val.match(Y2k.monthDay);
        // not enought info
        if (parts.length !== 3) return false;

        let month = parseInt(parts[1]);
        let day = parseInt(parts[2]);

        return Y2k.isValidDate(month, day, Y2k.value);
    }

    static padDate = (val) => {
        var parts = val.match(Y2k.monthDay);
        let padOne = n => n.length === 1 ? `0${n}` : n;
        let month = padOne(parts[1]);
        let day = padOne(parts[2]);

        return `${month}/${day}`;
    }

    static trimYear(val) {
        // already trimmed
        if (Y2k.isValidTrimmedYear(val)) return val;
        let isValidDate = Y2k.testAnyYear(val);

        if (isValidDate) {
            let end = val.lastIndexOf("/");
            let monthDay = val.substring(0, end);

            if (Y2k.isValidTrimmedYear(monthDay)) {
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
        if (Y2k.testAnyYear(val) === false) return false;

        var parts = val.match(Y2k.anyYear);

        // not enought info
        if (parts.length !== 4) return false;

        let month = parseInt(parts[1]);
        let day = parseInt(parts[2]);
        let year = parseInt(parts[3]);

        return Y2k.isValidDate(month, day, year);
    }

    static isValid2kYear(val) {
        if (Y2k.isValidAnyYear(val) === false) return false;
        return Y2k.testFullYear(val);
    }
}


// Birthday should be mm/dd only. 
// Year would be defaulted to 2000 on back-end as per XP-8402
let isValidBirthDate = (source, arguments) => {

    if (Str.isNullOrWhitespace(arguments.Value)) {
        arguments.IsValid = true;
        return;
    }

    arguments.IsValid = Y2k.isValid2kYear(arguments.Value);
}

let setupBirthDate = () => {
    let txtBirthDate = $(".birth-date:first");
    if (txtBirthDate.length === 0) return;

    let initialValue = txtBirthDate.val();
    let fakeTxt = $(`<input type='text' maxlength='5' placeholder='MM/DD' value='${initialValue}'>`);
    let trimmedValue = Y2k.trimYear(initialValue);
    if (Str.isNullOrWhitespace(trimmedValue) === false) {
        let formatted = Y2k.padDate(trimmedValue);
        txtBirthDate.val(`${formatted}/${Y2k.value}`);
        fakeTxt.val(formatted);
    }

    fakeTxt.on('change', () => {
        let changedDate = fakeTxt.val();
        txtBirthDate.val(
            Str.isNullOrWhitespace(changedDate) ?
                changedDate :
                `${changedDate}/${Y2k.value}`
        );
    });

    fakeTxt.insertAfter(txtBirthDate);
    txtBirthDate.hide();
};
