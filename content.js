var determiners = ['(d[ei][rmnse])', '(ein[e]*[nsmr]*)']
var types = ['bestimmt', 'unbestimmt']

var paragraphs = document.getElementsByTagName("p")
for (var i = 0, l = paragraphs.length; i < l; i++) {
    var random_ind = Math.floor(Math.random() * determiners.length)
    var reg_str = '\\b' + determiners[random_ind] + '\\b'
    var myExp = new RegExp(reg_str, 'im')
    paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(myExp, "<span class='" + types[random_ind] + " blank'>$1</span>")
}
