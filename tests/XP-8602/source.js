// string validation utilities
var Str = {
    space: /^\s*$/,
    isNullOrEmpty: val => (val === undefined || val === null || val === ""),
    isNullOrWhitespace: val => (Str.isNullOrEmpty(val) || Str.space.test(val))
};

var YrUtils = YrUtils || (function () {
    function YearUtils() {
        this.lockYear = 1908;
        this.value = 1904;
        this.lockedYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])(\/1908)$/;
        this.fullYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])(\/1904)$/;
        this.anyYear = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])[\/.]([0-9]+)$/;
        this.monthDay = /^(0?[1-9]|1[012])[\/.](0?[1-9]|[12][0-9]|3[01])$/;
    }


    YearUtils.prototype.testLockedYear = function (val) {
        var self = this;
        return self.lockedYear.test(val)
    }
    YearUtils.prototype.testFullYear = function (val) {
        var self = this;
        return self.fullYear.test(val)
    }
    YearUtils.prototype.testAnyYear = function (val) {
        var self = this;
        return self.anyYear.test(val)
    }
    YearUtils.prototype.testMonthDay = function (val) {
        var self = this;
        return self.monthDay.test(val)
    }

    YearUtils.prototype.isValidTrimmedYear = function (val) {
        var self = this;
        if (self.testMonthDay(val) === false) return false;
        var parts = val.match(self.monthDay);

        // not enought info
        if (parts.length !== 3) return false;

        let month = parseInt(parts[1]);
        let day = parseInt(parts[2]);

        return self.isValidDate(month, day, self.value);
    }

    YearUtils.prototype.padDate = function (val) {
        var self = this;
        var parts = val.match(self.monthDay);
        let padOne = n => n.length === 1 ? `0${n}` : n;
        let month = padOne(parts[1]);
        let day = padOne(parts[2]);

        return `${month}/${day}`;
    }

    YearUtils.prototype.trimYear = function (val) {
        var self = this;
        // already trimmed
        if (self.isValidTrimmedYear(val)) return val;
        let isValidDate = self.testAnyYear(val);

        if (isValidDate) {
            let end = val.lastIndexOf("/");
            let monthDay = val.substring(0, end);

            if (self.isValidTrimmedYear(monthDay)) {
                return monthDay;
            }
        }

        return null;
    }

    YearUtils.prototype.isValidDate = function (month, day, year) {
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

    YearUtils.prototype.isValidAnyYear = function (val) {
        var self = this;

        // not right format
        if (self.testAnyYear(val) === false) return false;

        var parts = val.match(self.anyYear);

        // not enought info
        if (parts.length !== 4) return false;

        let month = parseInt(parts[1]);
        let day = parseInt(parts[2]);
        let year = parseInt(parts[3]);

        return self.isValidDate(month, day, year);
    }

    YearUtils.prototype.isValidEditableYear = function (val) {
        var self = this;
        if (self.isValidAnyYear(val) === false) return false;
        return self.testFullYear(val);
    }

    YearUtils.prototype.isValidLockedYear = function (val) {
        var self = this;
        if (self.isValidAnyYear(val) === false) return false;
        return self.testLockedYear(val);
    }

    return new YearUtils();
})();


// Birthday should be mm/dd only. 
// Year would be defaulted to 1904 on back-end as per XP-8402
var isValidBirthDate = (source, obj) => {

    if (Str.isNullOrWhitespace(obj.Value)) {
        obj.IsValid = true;
        return;
    }

    obj.IsValid = YrUtils.isValidAnyYear(obj.Value);
};

var setupBirthDate = () => {
    let txtBirthDate = $(".birth-date:first");
    if (txtBirthDate.length === 0) return;

    // check if already initialized
    var initialized = $("#birth-date").length > 0;

    let initialValue = txtBirthDate.val();
    let fakeTxt = initialized ? $("#birth-date") : $(`<input id="birth-date" type='text' maxlength='5' placeholder='MM/DD'>`);
    fakeTxt.val(initialValue);

    if (Str.isNullOrWhitespace(initialValue) === false) {
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
    }

    if (initialized === false) {
        fakeTxt.on('change', () => {
            let changedDate = fakeTxt.val();
            txtBirthDate.val(
                Str.isNullOrWhitespace(changedDate) ?
                    changedDate :
                    `${changedDate}/${YrUtils.value}`
            );
        });
        fakeTxt.insertAfter(txtBirthDate);
    }

    txtBirthDate.hide();
};