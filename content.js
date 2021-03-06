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

    const scoreKey = elem.children[1].className.match("blank-substr=(.*?)(?=\\s|$)")[1]

    var edit = 0
    if (elem.className.includes("blank-correct")) {
        elem.className = elem.className.replace(' blank-correct', '')
        elem.className += " blank-wrong blank-answered"
        edit = -1
    } else {
        elem.className = elem.className.replace(' blank-wrong', '')
        elem.className += " blank-correct blank-answered"
        edit = 1
    }
    editScore(scoreKey, edit)
}

function updateScoreBoard() {
    var scoreBoard = document.getElementById("blankScoreBoard")
    if (scoreBoard != null) {
        scoreBoard.parentNode.removeChild(scoreBoard)
    }

    scoreBoard = document.createElement("div")
    scoreBoard.id = "blankScoreBoard"
    document.body.appendChild(scoreBoard)

    browser.storage.local.get("regexes").then(results => {
        results["regexes"].forEach(regex => {
            const container = document.createElement("p")
            const blank = buildBlank(regex, regex.score)
            blank.className += " blank-correct blank-answered"
            container.appendChild(blank)
            scoreBoard.appendChild(container)
        })

        const clearButton = document.createElement("button")
        clearButton.textContent = "close"
        clearButton.id = "blankCloseButton"
        clearButton.addEventListener("click", removeBlank)
        scoreBoard.appendChild(clearButton)
    })
}
browser.storage.onChanged.addListener(updateScoreBoard)

function buildBlank(regex, text) {
    const container = document.createElement("span")
    container.className = "blank-container"

    const subNode = document.createElement("span")
    subNode.textContent = regex.substr
    subNode.className = "blank-sub"
    subNode.style.cssText = "background-color:" + regex.color + ";"
    container.appendChild(subNode)

    const blankNode = document.createElement("span")
    blankNode.className = `blank-blank blank-substr=${regex.substr}`
    blankNode.textContent = text
    container.appendChild(blankNode)
    return container
}

function blankizePage() {
    updateScoreBoard()

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

function removeBlank() {
    let existingBlanks = document.querySelectorAll(".blank-container");
    for (let blank of existingBlanks) {
        blank.parentNode.replaceChild(document.createTextNode(blank.querySelector(".blank-blank").textContent), blank);
    }
    const score = document.querySelector("#blankScoreBoard")
    score.parentNode.removeChild(score)
}

blankizePage()
