
QUnit.module('XP-8725 locked year DOM values', hooks => {

    QUnit.test('isLockedYear', assert => {
        let initialValue = '08/24/1908';
        setupDom(initialValue);

        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        assert.equal(fke.length, 1, "fake field not created");
        assert.equal(fke.attr("disabled"), "disabled", "control disabled");

        assert.equal(ctl.val(), initialValue, "control disabled");
    });

    QUnit.test('isNotLockedYear', assert => {
        let initialValue = '08/24/1904';
        setupDom(initialValue);

        let ctl = $(".birth-date");
        let fke = $("input[placeholder='MM/DD']");

        assert.equal(fke.length, 1, "fake field not created");
        assert.equal(fke[0].hasAttribute("disabled"), false, "control disabled");

        assert.equal(ctl.val(), initialValue, "control disabled");
    });
});
