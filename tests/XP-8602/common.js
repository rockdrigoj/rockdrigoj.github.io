
let setupDom = (initialValue) => {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = `<input type="text" class="birth-date" value="${initialValue || ''}" />`;
    setupBirthDate();
};

let triggerChange = () => {
    let fke = $("input[placeholder='MM/DD']");
    let event = new Event("change", { bubbles: true });
    fke.get(0).dispatchEvent(event);
};
