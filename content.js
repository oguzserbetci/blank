function editScore(scores, key, edit=1) {
    score = typeof scores[key] != 'undefined' ? scores[key] : 0
    scores[key] = score + edit
    return scores
}

function storeCorrect(event) {
    const elem = event.target.parentElement

    const scoreKey = elem.children[1].className.match("substr=(.*?)(?=\\s|$)")[1]
    browser.storage.local.get("scores").then(res => {
        var scores = res["scores"]
        if (res['scores'] == undefined) {
            scores = {}
        }

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

        var newScores = editScore(scores, scoreKey, edit)
        browser.storage.local.set({"scores": newScores});
    })
}

function updateScoreHeader() {
    var scoreHeader = document.getElementById("blank_scoreHeader")
    if (scoreHeader == null) {
        scoreHeader = document.createElement("div")
        scoreHeader.className = "score sticky"
        scoreHeader.id = "blank_scoreHeader"
        document.body.appendChild(scoreHeader)
    }

    browser.storage.local.get("scores").then(results => {
        scoreHeader.innerHTML = ""
        for (var property in results["scores"]) {
            const blank = buildBlank({'substr': property, 'color': 'red'}, results["scores"][property])
            blank.className += " correct answered"
            scoreHeader.appendChild(blank)
        }
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
