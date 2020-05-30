function editScore(key, edit=1) {
    browser.storage.local.get("regexes").then(res => {
        var regexes = res['regexes'].map(regex => {
            if (regex.substr === key) {
                regex.score += edit
            }
            return regex
        })
        browser.storage.local.set({'regexes': regexes});
    })
}

function storeCorrect(event) {
    const elem = event.target.parentElement

    const scoreKey = elem.children[1].className.match("substr=(.*?)(?=\\s|$)")[1]

    var edit = 0
    if (elem.className.includes("correct")) {
        elem.className = elem.className.replace(' correct', '')
        elem.className += " wrong answered"
        edit = -1
    } else {
        elem.className = elem.className.replace(' wrong', '')
        elem.className += " correct answered"
        edit = 1
    }
    editScore(scoreKey, edit)
}

function updateScoreHeader() {
    var scoreHeader = document.getElementById("blank_scoreHeader")
    if (scoreHeader == null) {
        scoreHeader = document.createElement("div")
        scoreHeader.className = "score sticky"
        scoreHeader.id = "blank_scoreHeader"
        document.body.appendChild(scoreHeader)
    }

    scoreHeader.textContent = ""
    browser.storage.local.get("regexes").then(results => {
        results["regexes"].forEach(regex => {
            const blank = buildBlank(regex, regex.score)
            blank.className += " correct answered"
            scoreHeader.appendChild(blank)
        })
    })
}
browser.storage.onChanged.addListener(updateScoreHeader)

function buildBlank(regex, text) {
    const container = document.createElement("span")
    container.className = "blank-container"

    const subNode = document.createElement("span")
    subNode.textContent = regex.substr
    subNode.className = "sub"
    subNode.style.cssText = "background-color:" + regex.color + ";"
    container.appendChild(subNode)

    const blankNode = document.createElement("span")
    blankNode.className = `blank substr=${regex.substr}`
    blankNode.textContent = text
    container.appendChild(blankNode)
    return container
}

function blankizePage() {
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

                        blank = buildBlank(regex, match[1])
                        blank.addEventListener("click", storeCorrect)
                        paragraph.insertBefore(blank, node)
                    }
                }
            } while (node = node.nextSibling);
        }
    })
}
browser.runtime.onMessage.addListener(blankizePage);
