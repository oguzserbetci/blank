function addRow(isActive, rxstr, substr, color, score) {
    var table = document.getElementById("regexTable");
    var row = createRow(isActive, rxstr, substr, color, score);
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

function createRow(isActive, rxstr, substr, color, score) {
    var row = document.createElement("tr");
    row.innerHTML = `<td class=\"blank-checkbox-cell\"><input type=\"checkbox\" class=\"blank-form-check\" ${ isActive ? 'checked' : '' }></td>
                     <td><input size=50 type=\"text\" class=\"form-control\" value=\"${rxstr}\"></td>
                     <td><input size=3 type=\"text\" class=\"form-control\" value=\"${substr}\"></td>
                     <td><input size=15 type=\"text\" class=\"form-control\" value=\"${color}\"></td>
                     <td><p>${score}</p></td>`
    return row
}

var newButton = document.getElementById("newButton");
newButton.addEventListener("click", function() {
    addRow(true, "", "", "", "", 0)
});

var germanButton = document.getElementById("germanButton");
germanButton.addEventListener("click", function() {
    addRow(true, '(de[rnms]|die|das)', 'A', "#ffa502")
    addRow(true, '(ein[e]*[nsmr]*)', 'D', "#eccc68")
    addRow(true, '(beim?|a[nm]|auf|i[nm]|vo[nm]|über|zu[mr]?|nach|aus|durch|um)', 'P', "#ff7f50")
});

function saveOptions() {
    var options = []

    var rows = document.querySelectorAll("table > tr");
    for (var i = 0, l = rows.length; i < l; i++) {
        var inputs = rows[i].querySelectorAll("td > input")
        option = {
            "isActive": inputs[0].checked,
            "rxstr": inputs[1].value,
            "rx": new RegExp('\\b' + inputs[1].value + '(?=\\s|$)', 'igm'),
            "substr": inputs[2].value,
            "color": inputs[3].value,
            "score": 0
        }
        options.push(option)
    }
    browser.storage.local.set({
        "regexes": options,
    });
}

var saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", saveOptions);

function restoreOptions() {
    var rows = document.querySelectorAll("table > tr");
    rows.forEach(row => {
        if (row.className != 'blank-header') {
            row.parent.removeChild(row)
        }
    })
    browser.storage.local.get("regexes").then(res => {
        for (var i = 0, l = res["regexes"].length; i < l; i++) {
            addRow(res["regexes"][i].isActive,
                   res["regexes"][i].rxstr,
                   res["regexes"][i].substr,
                   res["regexes"][i].color,
                   res["regexes"][i].score)
        }
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);

var resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function(){browser.storage.local.set({"scores": {}})});
