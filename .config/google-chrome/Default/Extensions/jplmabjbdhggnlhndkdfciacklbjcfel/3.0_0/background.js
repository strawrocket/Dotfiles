chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.cmd == "download"){
    const { url } = request; 
    chrome.downloads.download({
      url
    });
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE && details.previousVersion === '2.4') {
    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL('donate.html')
    });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL('donate.html')
  });
});
