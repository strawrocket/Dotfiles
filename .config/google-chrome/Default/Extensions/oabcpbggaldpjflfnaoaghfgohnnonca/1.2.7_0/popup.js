const introsAndRecapsTrigger = document.querySelector('#IntrosAndRecaps')
const nextEpisodeTrigger = document.querySelector('#NextEpisode')
const continueWatchingTrigger = document.querySelector('#ContinueWatching')
const skipAdsTrigger = document.querySelector('#SkipAds')

let options

window.addEventListener('DOMContentLoaded', async() => {
    options = await loadOptionsOrSetDefaults()
    setCheckbox(options)
})

introsAndRecapsTrigger.addEventListener('change', () => {
    setOptions()
})

nextEpisodeTrigger.addEventListener('change', () => {
    setOptions()
})

continueWatchingTrigger.addEventListener('change', () => {
    setOptions()
})

skipAdsTrigger.addEventListener('change', () => {
    setOptions()
})

function setOptions() {
    options.skipTitleSequence = introsAndRecapsTrigger.checked
    options.autoPlayNext = nextEpisodeTrigger.checked
    options.skipStillHere = continueWatchingTrigger.checked
    options.skipAds = skipAdsTrigger.checked
    saveOptions(options)
}

function setCheckbox(options) {
    introsAndRecapsTrigger.checked = options.skipTitleSequence
    nextEpisodeTrigger.checked = options.autoPlayNext
    continueWatchingTrigger.checked = options.skipStillHere
    skipAdsTrigger.checked = options.skipAds
}

function saveOptions(options) {
    chrome.storage.sync.set({
        'options': options
    })
}