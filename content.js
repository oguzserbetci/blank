browser.runtime.onMessage.addListener(blankizePage);

function blankizePage() {
    browser.storage.local.get("regexes").then(results => {
        const regexes = results["regexes"]
        
        var paragraphs = document.getElementsByTagName("p")
        for (var i = 0; i < paragraphs.length; i++) {
            const random_ind = Math.floor(Math.random() * regexes.length)
            const regex = regexes[random_ind].rx

            const paragraph = paragraphs[i]
            var node = paragraph.firstChild
            do {
                if (node.nodeType === Node.TEXT_NODE) {
                    while ((match = regex.exec(node.textContent)) != null) {
                        node = node.splitText(match.index)
                        node.textContent = node.textContent.substring(match[1].length)
                        const container = document.createElement("span")
                        container.className = "blank-container"
                        container.style.cssText = "background-color:" + regexes[random_ind].color + ";"
                        paragraph.insertBefore(container, node)
                        const blankNode = document.createElement("span")
                        blankNode.textContent = match[1]
                        blankNode.className = "blank"
                        container.appendChild(blankNode)
                        const subNode = document.createElement("span")
                        subNode.textContent = regexes[random_ind].substr
                        subNode.className = "sub"
                        container.appendChild(subNode)
                    }
                }
            } while (node = node.nextSibling);
        }
    })
}