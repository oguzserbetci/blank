function addRow(isActive, regex, color) {
    var table = document.getElementById("table");
    var row = createRow(isActive, regex, color);
    var removeButton = document.createElement("button");
    removeButton.innerText = "REMOVE";
    removeButton.type = "button"
    removeButton.className = "btn btn-danger"
    removeButton.addEventListener("click", function() {
        this.parentNode.parentNode.remove();
    })
    var col = document.createElement("td");
    col.appendChild(removeButton)
    row.appendChild(col);
    table.appendChild(row);

    saveOptions()
}

function createRow(isActive, regex, color) {
    var row = document.createElement("tr");
    row.className = "browser-style"
    row.innerHTML = "<td><input type=\"checkbox\" checked=\"" + isActive + "\"></td><td><input type=\"text\" class=\"form-control\" value=\"" + regex + "\"></td><td><input type=\"text\" class=\"form-control\" value=\"" + color + "\"></td>"
    return row
}

var newButton = document.getElementById("new-button");
newButton.addEventListener("click", function() {
    addRow(true, "", "")
});

var defaultButton = document.getElementById("defaults-button");
defaultButton.addEventListener("click", function() {
    addRow(true, '(d[ei][rmnse])', "#ffa502")
    addRow(true, '(ein[e]*[nsmr]*)', "#eccc68")
    addRow(true, '(beim?|a[nm]|auf|i[nm]|vo[nm]|über|zu[mr]?|nach|aus|durch|um)', "#ff7f50")
});

function saveOptions() {
    var options = []

    var rows = document.querySelectorAll("table > tr");
    for (var i = 0, l = rows.length; i < l; i++) {
        var inputs = rows[i].querySelectorAll("td > input")
        if (inputs[0].getAttribute("checked")) {
            option = {
                "isActive": inputs[0].checked,
                "rx": inputs[1].value,
                "color": inputs[2].value
            }
            options.push(option)
        }
    }
    browser.storage.local.set({
        "rxs": options,
    });
}

var saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", saveOptions);

function restoreOptions() {
    browser.storage.local.get("rxs").then(res => {
        for (var i = 0, l = res["rxs"].length; i < l; i++) {
            addRow(res["rxs"][i].isActive,
                res["rxs"][i].rx,
                res["rxs"][i].color)
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
