browser.runtime.onMessage.addListener(blankizePage);

function storeCorrect(event) {
    const elem = event.target
    
    elem.className += " correct"
    elem.parentElement.children[0].className += " correct"
    
    console.log('clicked')
    browser.storage.local.get("scores").then(res => {
        if (res['scores']) {
            var scores = res['scores']
            score = scores[elem.parentElement.children[0].textContent] ? scores[elem.parentElement.children[0].textContent] : 0;
            score += 1
            scores[elem.parentElement.children[0].textContent] = score
            browser.storage.local.set({scores});
            console.log(res['scores'])
        } else {
            var scores = {}
            scores[elem.parentElement.children[0].textContent] = 1
            browser.storage.local.set({scores});
        }
    })
}

browser.storage.onChanged.addListener( function () {
    updateScoreHeader()
})

function updateScoreHeader() {
    console.log('update')
    const node = document.getElementById("blank_scoreHeader")
    browser.storage.local.get("scores").then(results => {
        var output = ''
        for (var property in results["scores"]) {
            console.log(property)
            console.log(results["scores"][property])
            output += property + ': ' + results["scores"][property]+'    ';
        }
        node.innerHTML = output + "🎉"
    })
}

function insertScoreHeader() {
    console.log('insert')
    const node = document.createElement("div")
    node.className = "score sticky"
    node.id = "blank_scoreHeader"
    document.body.appendChild(node)
}

function blankizePage() {
    const node = document.getElementById("blank_scoreHeader")
    console.log(node)
    if (node == null) {
        insertScoreHeader()
    }
    updateScoreHeader()

    browser.storage.local.get("regexes").then(results => {
        const regexes = results["regexes"].filter(regex => regex.isActive)
        
        var paragraphs = document.getElementsByTagName("p")
        for (var i = 0; i < paragraphs.length; i++) {
            const random_ind = Math.floor(Math.random() * regexes.length)
            const regex = regexes[random_ind]

            const paragraph = paragraphs[i]
            var node = paragraph.firstChild
            do {
                if (node.nodeType === Node.TEXT_NODE) {
                    while ((match = regex.rx.exec(node.textContent)) != null) {
                        node = node.splitText(match.index)
                        node.textContent = node.textContent.substring(match[1].length)

                        const container = document.createElement("span")
                        container.className = "blank-container"
                        paragraph.insertBefore(container, node)

                        const subNode = document.createElement("span")
                        subNode.textContent = regex.substr
                        subNode.className = "sub"
                        subNode.style.cssText = "background-color:" + regex.color + ";"
                        container.appendChild(subNode)

                        const blankNode = document.createElement("span")
                        blankNode.textContent = match[1]
                        blankNode.className = "blank"
                        blankNode.addEventListener("click", storeCorrect)

                        container.appendChild(blankNode)
                    }
                }
            } while (node = node.nextSibling);
        }
    })
}
