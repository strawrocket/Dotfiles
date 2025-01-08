const MAX_TRIES_MONITOR_SKIP = 10
let isMonitorActive = null
let options
let isNexClicked = null

async function initContent() {
    options = await loadOptionsOrSetDefaults()
    startHelper(options)
}

initContent()

chrome.storage.onChanged.addListener(
    (changes, areaName) => {
        if (areaName === 'sync' && changes.options?.newValue) {
            options = changes.options.newValue
            startHelper(options)
        }
    }
)

function startMonitoringForSelectors(selectors, numTries) {
    numTries++
    const monitor = new MutationObserver(() => {
        let selector = selectors.join(', ')
        let elems = document.querySelectorAll(selector)
        for (const elem of elems) {
            const ariaLabel = elem.getAttribute("aria-label")
            const newDataUia = elem.getAttribute("data-uia")
            if (options.autoPlayNext && !isNexClicked && ((newDataUia && newDataUia.includes("next-episode-seamless-button")) || (ariaLabel && ariaLabel === "Next episode"))) {
                elem.click()
                isNexClicked = true
                setTimeout(() => {
                    isNexClicked = false
                },10000)
            } else if (options.skipTitleSequence && (ariaLabel === "Skip Intro" || (newDataUia && newDataUia.includes('player-skip-preplay')) || (newDataUia && newDataUia.includes('player-skip-recap')) || (newDataUia && newDataUia.includes('player-skip-intro')))) {
                elem.click()
            } else if (options.skipStillHere && (ariaLabel === "Continue Playing" || (newDataUia && newDataUia == "interrupt-autoplay-continue"))) {
                elem.click()
            }
        }
    })

    let reactEntry = document.getElementById("appMountPoint")
    if (!selectors.length) {
        return
    } else if (reactEntry) {
        if (!isMonitorActive) {
            monitor.observe(reactEntry, {
                attributes: false,
                childList: true,
                subtree: true
            })
            isMonitorActive = true
        }
    } else {
        if (numTries > MAX_TRIES_MONITOR_SKIP) { return }
        setTimeout(() => {
            startMonitoringForSelectors(selectors, numTries)
        }, 100 * numTries)
    }
}

function startHelper(options) {
    let selectors = []
    if (options.skipTitleSequence) { enableSkipTitleSequence(selectors) }
    if (options.autoPlayNext) { enableAutoPlayNext(selectors) }
    if (options.skipStillHere) { enableSkipStillHere(selectors) }
    startMonitoringForSelectors(selectors, 0)
    startInterval()
}

function enableSkipStillHere(selectors) {
    selectors.push('.interrupter-actions > .nf-icon-button:first-child')
    selectors.push('[aria-label^="Continue Playing"]')
    selectors.push('[aria-label="Continue Playing"]')
    selectors.push('[data-uia="interrupt-autoplay-continue"]')
}

function enableAutoPlayNext(selectors) {
    selectors.push(".WatchNext-autoplay")
    selectors.push('.WatchNext-still-hover-container')
    selectors.push('[aria-label^="Next episode"]')
    selectors.push('[aria-label="Next episode"]')
    selectors.push('[data-uia^="next-episode-seamless-button"]')
    selectors.push('[data-uia="next-episode-seamless-button"]') // -R
    selectors.push('.draining')
}

function enableSkipTitleSequence(selectors) {
    selectors.push('[aria-label="Skip Intro"]')
    selectors.push('[data-uia="player-skip-intro"]') // -R 
    selectors.push('[data-uia="player-skip-recap"]') // -R 
    selectors.push('[data-uia="player-skip-preplay"]') // -R
    selectors.push('.skip-credits > a')
    selectors.push('.watch-video--skip-content > button')
}

function startInterval() {
    setInterval(() => {
        const video = document.querySelector('video')
        const adElem = document.querySelector('.forward-anim')
        if (options.skipAds && video && adElem) {
            video.playbackRate = 16
            video.style.display = "none"
            video.muted = true
            if (video.paused) {
                video.play()
            }
        } else if (video && video.playbackRate == 16 && (!adElem || !options.skipAds)) {
            video.playbackRate = 1
            video.style.display = "block"
            video.muted = false
        }
    },500)
}