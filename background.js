chrome.action.onClicked.addListener(setOptions);

function setOptions(tab) {
    chrome.tabs.create({
        url: chrome.runtime.getURL('options/index.html'),
        index: tab.index + 1
    });
    chrome.runtime.openOptionsPage();
}

async function img2Base64(url, cb) {
    try {
        const imgblob = await fetch(url).then(res => res.blob())
        const reader  = new FileReader();
        reader.readAsDataURL(imgblob)
        reader.addEventListener("load", function () {
            cb(reader.result)
        }, false);
    } catch (error) {
        cb("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj4gPHBhdGggZmlsbD0iIzRFNTA1NSIgZD0iTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptMTYwLTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45eiI+PC9wYXRoPiA8L3N2Zz4=");
    }
}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.cmd === 'img2Base64') {
        img2Base64(request.url, sendResponse);
        return true
    }
});