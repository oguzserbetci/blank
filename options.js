function addRow(isActive, rxstr, substr, color) {
    var table = document.getElementById("table");
    var row = createRow(isActive, rxstr, substr, color);
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

function createRow(isActive, rxstr, substr, color) {
    var row = document.createElement("tr");
    row.innerHTML = "<td class=\"checkbox-cell\"><input type=\"checkbox\" class=\"form-check\" checked=\"" + isActive + "\"></td> \
                     <td><input type=\"text\" class=\"form-control\" value=\"" + rxstr + "\"></td> \
                     <td><input type=\"text\" class=\"form-control\" value=\"" + substr + "\"></td> \
                     <td><input type=\"text\" class=\"form-control\" value=\"" + color + "\"></td>" 
    return row
}

var newButton = document.getElementById("new-button");
newButton.addEventListener("click", function() {
    addRow(true, "", "", "")
});

var defaultButton = document.getElementById("defaults-button");
defaultButton.addEventListener("click", function() {
    addRow(true, '(d[ei][rmnse])', 'A', "#ffa502")
    addRow(true, '(ein[e]*[nsmr]*)', 'D', "#eccc68")
    addRow(true, '(beim?|a[nm]|auf|i[nm]|vo[nm]|über|zu[mr]?|nach|aus|durch|um)', 'P', "#ff7f50")
});

function saveOptions() {
    var options = []

    var rows = document.querySelectorAll("table > tr");
    for (var i = 0, l = rows.length; i < l; i++) {
        var inputs = rows[i].querySelectorAll("td > input")
        if (inputs[0].getAttribute("checked")) {
            option = {
                "isActive": inputs[0].checked,
                "rxstr": inputs[1].value,
                "rx": new RegExp('\\b' + inputs[1].value + '(?=\\s|$)', 'igm'),
                "substr": inputs[2].value,
                "color": inputs[3].value
            }
            options.push(option)
        }
    }
    browser.storage.local.set({
        "regexes": options,
    });
}

var saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", saveOptions);

function restoreOptions() {
    browser.storage.local.get("regexes").then(res => {
        for (var i = 0, l = res["regexes"].length; i < l; i++) {
            addRow(res["regexes"][i].isActive,
                   res["regexes"][i].rxstr,
                   res["regexes"][i].substr,
                   res["regexes"][i].color)
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
