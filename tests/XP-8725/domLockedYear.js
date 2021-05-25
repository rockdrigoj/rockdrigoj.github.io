
QUnit.module('XP-8725 locked year DOM values', hooks => {

    QUnit.test('isLockedYear', assert => {
        setupDom('08/24/1908');

        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        assert.equal(fke.length, 0, "fake field not created");
        assert.equal(ctl.attr("disabled"), "disabled", "control disabled");
    });
});
