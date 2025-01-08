chrome.runtime.onInstalled.addListener((reason) => {
    if (reason.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: 'https://dogooodapp.com/thank-you/?custom_text_title=Netflix%20Skipper'
        })
        reloadTabs()
    }
})

function reloadTabs() {
    chrome.tabs.query({url: "*://*.netflix.com/*"}, function(tabs) {
        if (tabs.length > 0) {
            tabs.forEach(tab => {
               chrome.tabs.reload(tab.id) 
            })
        }
    })
}