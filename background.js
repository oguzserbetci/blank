browser.browserAction.onClicked.addListener(() => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(sendMessageToTabs);
});

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.executeScript(
      {file: 'content.js'}
    );
    browser.tabs.insertCSS({file: "styles.css"});
  }
}
