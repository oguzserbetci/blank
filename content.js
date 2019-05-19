var determiners = ['d[ei][rmnse]', 'ein[e]*[nsmr]*']

var paragraphs = document.getElementById('mw-content-text').getElementsByTagName("p")
for (var i = 0, l = paragraphs.length; i < l; i++) {
    var random_ind = Math.floor(Math.random() * determiners.length)
    var reg_str = '(\\s)(' + determiners[random_ind] + ')(\\s)'
    var myExp = new RegExp(reg_str, 'im')
    found = paragraphs[i].innerHTML.match(myExp)
    if (found != null) {
        paragraphs[i].innerHTML = paragraphs[i].innerHTML.replace(myExp, "\1<span class='blank'> " + found[2] + " </span>\3")
    }
}
