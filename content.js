var rxs = ['(d[ei][rmnse])', '(ein[e]*[nsmr]*)', '(beim?|a[nm]|auf|i[nm]|vo[nm]|über|zu[mr]?|nach|aus|durch|um)']
var types = ['bestimmt', 'unbestimmt', 'preposition']

var paragraphs = document.getElementsByTagName("p")
for (var i = 0, l = paragraphs.length; i < l; i++) {
    var random_ind = Math.floor(Math.random() * rxs.length)
    var rx_str = '\\b' + rxs[random_ind] + '\\b'
    var rx = new RegExp(rx_str, 'igm')
    paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(rx, "<span class='" + types[random_ind] + " blank'>$1</span>")
}
