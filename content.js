browser.storage.local.get("rxs").then(results => {
    var rxs = results["rxs"]

    var paragraphs = document.getElementsByTagName("p")
    for (var i = 0; i < paragraphs.length; i++) {
        var random_ind = Math.floor(Math.random() * rxs.length)
        var rx_str = '\\b' + rxs[random_ind].rx + '\\b'
        var regex = new RegExp(rx_str, 'igm')

        const paragraph = paragraphs[i]
        var node = paragraph.firstChild
        do {
            if (node.nodeType === Node.TEXT_NODE) {
                while ((match = regex.exec(node.textContent)) != null) {
                    node = node.splitText(match.index)
                    node.textContent = node.textContent.substring(match[1].length)
                    var blankNode = document.createElement("span")
                    blankNode.textContent = match[1]
                    blankNode.style.cssText = "background-color:" + rxs[random_ind].color + "; width:5em"
                    blankNode.className = "blank"
                    paragraph.insertBefore(blankNode, node)
                }
            }
        } while (node = node.nextSibling);
    }
})
