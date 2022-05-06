chrome.action.onClicked.addListener(setOptions);

function setOptions(tab) {
    chrome.tabs.create({
        url: chrome.runtime.getURL('options/index.html'),
        index: tab.index + 1
    });
    chrome.runtime.openOptionsPage();
}