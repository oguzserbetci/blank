function editScore(scores, key, edit=1) {
    score = typeof scores[key] != 'undefined' ? scores[key] : 0
    scores[key] = score + edit
    console.log(scores)
    return scores
}

function storeCorrect(event) {
    const elem = event.target.parentElement

    const scoreKey = elem.children[0].textContent
    browser.storage.local.get("scores").then(res => {
        var scores = res["scores"]
        console.log(res)
        if (res['scores'] == undefined) {
            console.log('init')
            scores = {}
        }
        console.log(scores, scoreKey)

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
    const node = document.getElementById("blank_scoreHeader")
    browser.storage.local.get("scores").then(results => {
        var output = ''
        for (var property in results["scores"]) {
            output += property + ': ' + results["scores"][property]+'    ';
        }
        node.innerHTML = output + "🎉"
    })
}
browser.storage.onChanged.addListener(updateScoreHeader)

function blankizePage() {
    const scoreHeader = document.getElementById("blank_scoreHeader")
    if (scoreHeader == null) {
        const scoreHeader = document.createElement("div")
        scoreHeader.className = "score sticky"
        scoreHeader.id = "blank_scoreHeader"
        document.body.appendChild(scoreHeader)
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
                        container.addEventListener("click", storeCorrect)
                        paragraph.insertBefore(container, node)

                        const subNode = document.createElement("span")
                        subNode.textContent = regex.substr
                        subNode.className = "sub"
                        subNode.style.cssText = "background-color:" + regex.color + ";"
                        container.appendChild(subNode)

                        const blankNode = document.createElement("span")
                        blankNode.textContent = match[1]
                        blankNode.className = "blank"
                        container.appendChild(blankNode)
                    }
                }
            } while (node = node.nextSibling);
        }
    })
}
browser.runtime.onMessage.addListener(blankizePage);
