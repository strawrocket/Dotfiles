'use strict';

/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

/*__standard_only__*/
const browser = chrome

const browserStorageContent = {
	set: async function (key, value) {
		const setObject = {}
		setObject[key] = value
		return new Promise((resolve, reject) => {
			chrome.storage.local.set(setObject, function () {
				resolve(value)
			})
		})

	},
	get: async function (key) {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(key, function (result) {
				console.log('key', key, 'result', result.userLoggedOut)
				resolve(result)
			});
		})
	}
}

//////////////////////////////////////////////////////////////////////////////// Env

function detectBrowser() {
	var ua = (navigator && navigator.userAgent || "").toLowerCase()
	var userAgent
	var browserEngine
	if (ua.indexOf('trident') !== -1) {
		// legacy embedded only
		userAgent = 'ie'
		browserEngine = 'ie'
	} else if (ua.indexOf('edge') !== -1) {
		// legacy embedded only
		userAgent = 'edge'
		browserEngine = 'edge'
	} else if (ua.indexOf('firefox') !== -1) {
		userAgent = 'firefox'
		browserEngine = 'firefox'
	} else if (ua.indexOf('opr') !== -1) {
		userAgent = 'opera'
		browserEngine = 'chromium'
	} else if (ua.indexOf('edg') !== -1) {
		userAgent = 'edge'
		browserEngine = 'chromium'
	} else if (ua.indexOf('chrom') !== -1) {
		userAgent = 'chrome'
		browserEngine = 'chromium'
	} else if (ua.indexOf('safari') !== -1) {
		userAgent = 'safari'
		browserEngine = 'safari'
	} else {
		userAgent = 'chromium'
		browserEngine = 'chromium'
	}
	// console.log('F1000Annotator/browser userAgent browserEngine', userAgent, browserEngine)
	return {
		userAgent: userAgent,
		browserEngine: browserEngine
	}
}

//////////////////////////////////////////////////////////////////////////////// Config

// API entrypoint
function getBaseURL() {
	if ('false' === true) {
		if (detectBrowser().browser === 'edge' && !false) {
			// edge development server cert issue, not on PDFViewer embedded
			return 'https://sciwheel.com/newapi'
		}
	}
	return 'https://sciwheel.com/newapi'
}

function getwbURL() {
	if ('false' === true) {
		if (detectBrowser().browser === 'edge' && !false) {
			// edge development server cert issue, not on PDFViewer embedded
			return 'https://sciwheel.com'
		}
	}
	return 'https://sciwheel.com'
}

/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

function safeAlert(msg) {
	console.log("alert is deprecated in background, msg was", msg)
}

// Limits effective proxing domains: https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
var ALLOWED_REQUEST_DOMAINS_REGEXP = /https:\/\/sciwheel\.com\/|https:\/\/.{0,6}\.sciwheel\.com\/|https:\/\/.{0,6}\.sciwheelinternal\.com\//i

function setF1000ActionButton(tabId, iconState) { browser.action.setIcon({ path: "../images/icon-38" + iconState + ".png", tabId: tabId }) }
function setF1000ActionButtonBadge(tabId, badgeText) { browser.action.setBadgeText({ text: badgeText, tabId: tabId }) }

function performFetchRequestInTheBackground(sendResponse, config) {

	if (!config.url.match(ALLOWED_REQUEST_DOMAINS_REGEXP)) {
		onError()
		return
	}

	const modConfig = config

	modConfig.credentials = "same-origin"

	const payload = config.payload
	if (payload && payload.length > 30) {
		modConfig.body = payload
	}

	const url = config.url

	fetch(url, modConfig)
		.then((response) => {
			// console.log("url at this point is", url)
			try {
				return response.json()
			} catch (e) {
				console.log("fetch couldn't json, response was ", { response })
			}
		})
		.then((data) => {
			if (url === 'https://stage.sciwheel.com/newapi/annotator/find' && data[0] && data[0].my) {
				console.log("annotator/find returned with the result of /newapi/annotator/urls, so aborting sending the response. I have no idea how the hell this happens")
			} else {
				sendResponse({ status: 200, responseResultFromBackground: JSON.stringify(data) })
			}
		})
		.catch(() => sendResponse({ status: 0, responseResultFromBackground: null }))
}

// Outbound
const send_to_tab = {
	invoke: function (id, request) {
		if (id) return browser.tabs.sendMessage(id, request)
	},
	broadcast: function (request) {
		browser.tabs.query({}, function (tabs) {
			for (var i = 0; i < tabs.length; ++i) browser.tabs.sendMessage(tabs[i].id, request)
		})
	}
}

/*__standard_only__*/

// Third Party Cookies Exception, we are now using tokens and a different endpoint
// NOTE: disabled in v49 - needs manifest permission "contentSettings"
// if (browser.contentSettings && browser.contentSettings.cookies) {
// 	var cookiesBaseURL = getBaseURL().replace('/newapi', '')
// 	browser.contentSettings.cookies.set({ 'primaryPattern': cookiesBaseURL + '/*', 'setting': 'allow', 'scope': 'regular' });
// }
// Inbound
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.ping) {
		sendResponse("alive")
		return true
	}
	if (request.userLoginStatus) {
		browserStorageContent.set('userLoggedOut', request.userLoginStatus.loggedOut)
		return true;
	}
	if (request.performHTTPRequestConfig) {
		performFetchRequestInTheBackground(sendResponse, request.performHTTPRequestConfig)
		return true
	}
	var id = (sender.tab && sender.tab.id) || null;
	background.invoke(id, request)
})

console.log(browser)

// browserAction
browser.action.onClicked.addListener(function (tab) {
	if (tab.url.indexOf('about:') === 0 ||
		tab.url.indexOf('chrome:') === 0 ||
		tab.url.indexOf('opera:') === 0) return;
	//console.log("sending message from background")
	browser.tabs.sendMessage(tab.id, { browserAction: null }, function (response) {
		//console.log("send message response")
		// TODO remove once fixed in chrome workaround: https://bugs.chromium.org/p/chromium/issues/detail?id=586155
		if (browser.runtime && browser.runtime.lastError && browser.runtime.lastError.message) {
			//console.log(browser.runtime.lastError.message)
			if (browser.runtime.lastError.message.indexOf('port closed') !== -1) return;
		}
		if (tab && tab.id && tab.status === 'loading') {
			// add message to tabs queue, it will ship and flush once send_to_tab requsts session
			background.tabsMessageQueue[tab.id] = { message: 'browserAction' }
			return;
		}
		if (typeof response === 'undefined') {
			console.log("response undefined trigger")
			// // Nothing to do throw an alert
			// if (tab.url) {
			// 	if (tab.url.indexOf("file:") === 0) {
			// 		safeAlert(tab.id, 'To use the Sciwheel extension on this page please follow these simple steps:\n\n1. Navigate to chrome://extensions/\n\n2. Check "Allow access to file URLs" for the Sciwheel Extension.\n\n3. Reload this page.')
			// 	}
			// 	if (tab.url.indexOf("chrome.google.com/webstore") !== -1 ||
			// 		tab.url.indexOf("addons.opera.") !== -1 ||
			// 		tab.url.indexOf("addons.mozilla.") !== -1) {
			// 		safeAlert(tab.id, 'We are sorry but the extension will not work on this store page.\n\nPlease visit a different webpage and try again.')
			// 	}
			// }
			// safeAlert(tab.id, 'The extension has been updated.\n\nPlease reload this page to use the Sciwheel extension.')
		}
	})
})
browser.action.setBadgeBackgroundColor({ color: "#000000" })
// contentState
browser.tabs.onActivated.addListener(function (active) {
	browser.tabs.sendMessage(active.tabId, { contentState: null })
})
// on install open confirmation page
browser.runtime.onInstalled.addListener(function listener(details) {
	if (details.reason === 'install') {
		browser.runtime.onInstalled.removeListener(listener)
		browser.tabs.query({}, function (tabs) {
			tabs.forEach(function (tab) {
				var isWorkspace = tab && tab.url && (
					tab.url.match(/f1000\S*?\.com\/work\//i) ||
					tab.url.match(/sciwheel\S*?\.com\/work\//i) ||
					tab.url.match(/faculty\S*?\.com\/work\//i)
				)
				if (isWorkspace) {
					browser.tabs.reload(tab.id)
				}
			})
			var confirmationPageURL = getwbURL() + '/work/browser-extension-confirmation'
			browser.tabs.create({ url: confirmationPageURL }) // Will need to be disabled for automated tests
		})
	}
})

/*__standard_only__*/

//
// Background
//
var background = (function () {
	var module = {}

	module.session = {
		apiToken: null,
		user: 'boot',
		collectionId: { id: null, name: 'Unsorted' },
		highlighterPreference: true,
		highlighterPreferenceColor: 'e',
		preferences: { // this must be shallow object
			autoImportAlternatePDF: false,
			showRecommendations: true,
			welcomeBalloon_browserPDF: true,
			welcomeBalloon_f1000PDF: true,
			welcomeBalloon_guideCollect: true
		}
	}

	module.pageInfosCache = {}

	module.visitedURLs = [];
	module.visitedDomains = [];
	module.visitedURLsTimestamp = null

	module.tabsMessageQueue = {}
	module.demoMode = null

	// NOTE: runs at boot
	// NOTE: for crossbrowser sake: only use .dot notation assignent and force string for key/value
	// if (typeof localStorage !== 'undefined') {
	// After debugging, it appears that everything set here is populated before this code runs

	// 	// HighlighterPreference
	// 	if (localStorage.highlighterPreference === 'false') module.session.highlighterPreference = false
	// 	// HighlighterPreferenceColor
	// 	var highlighterPreferenceColor = localStorage.highlighterPreferenceColor
	// 	if (!~['a', 'b', 'c', 'd', 'e', 'f'].indexOf(highlighterPreferenceColor)) {
	// 		highlighterPreferenceColor = 'e'
	// 	}
	// 	module.session.highlighterPreferenceColor = highlighterPreferenceColor
	// 	// All user flags
	// 	if (localStorage.preferences) {
	// 		// merges .preferences from localStorage
	// 		var localPreferences = JSON.parse(localStorage.preferences)
	// 		Object.keys(localPreferences).forEach(function (k) {
	// 			module.session.preferences[k] = localPreferences[k];
	// 		})
	// 	}
	// 	// Last seen token
	// 	if (typeof localStorage.apiToken === 'string') {
	// 		module.session.apiToken = JSON.parse(localStorage.apiToken)
	// 	}
	// } else {
	// 	// shim localStorage, this has no use except for ie not crashing
	//  // now causes chrome to crash, because localStorage not defined in service worker context
	// 	localStorage = {}
	// }

	module.invoke = function (id, request) {
		Object.keys(request).forEach(function (key) { if (module[key]) { module[key](id, request[key]) } })
	}

	module.setDemoMode = function (id, d) {
		module.demoMode = d
	}

	module.getTabMessageQueue = function (id) {
		var mq = module.tabsMessageQueue[id]
		if (mq) {
			delete module.tabsMessageQueue[id]
			return mq
		} else {
			return null
		}
	}

	module.storeSessionObject = function(session) {
		const setObject = {}
		setObject['session'] = session

		chrome.storage.local.set(setObject, function () {
			return true;
		})
	}

	module.recoverSessionObject = function () {
		chrome.storage.local.get('session', function (sessionResult) {
			chrome.storage.local.get('userLoggedOut', function (userLoggedOutResult) {
				if (sessionResult?.session?.apiToken && userLoggedOutResult?.userLoggedOut === false) {
					send_to_tab.broadcast({
						sessionHandler: {
							backgroundSession: sessionResult.session,
						}
					})
				}
			});
		});
	}

	module.sessionHandler = function (id, mantain, broadcast) {
		if (module.session.user === 'boot') {
			return send_to_tab.invoke(id, { isSignedIn: module.session.apiToken })
		}
		var session = {
			backgroundSession: module.session,
			demoMode: module.demoMode,
			messageQueue: module.getTabMessageQueue(id)
		}

		if (module?.session?.apiToken?.value) {
			module.storeSessionObject(module.session);
		} else {
			module.recoverSessionObject();
		}

		if (broadcast) {
			send_to_tab.broadcast({ sessionHandler: session })
		} else {
			send_to_tab.invoke(id, { sessionHandler: session })
		}
	}

	module.user = function (id, u) {
		// Beta Program
		module.session.betaRestriction = u ? u.betaRestriction : null
		// End of Beta Program code
		if (u && !u.id) u = null
		if (u != module.session.user) {
			module.session.user = u
			module.session.collectionId = { id: null, name: 'Unsorted' }
			module.demoMode = null
			module.visitedURLs = []
			module.visitedDomains = []
			module.visitedURLsTimestamp = null
			// store the token for boot user signedin check
			var token = u && typeof u.apiToken === 'object' ? u.apiToken : null
			module.session.apiToken = token
			// localStorage.apiToken = JSON.stringify(token)
		}
		module.sessionHandler(id, false, true)
		if (u) send_to_tab.invoke(id, { syncVisitedURLs: u })
	}

	module.anyAnnotations = function (id, payload) {
		module.session.user.hasAnyAnnotations = payload.flag
	}

	module.collectionId = function (id, payload) {
		module.session.collectionId = payload
	}

	module.syncVisitedURLs = function (id, payload) {
		module.visitedURLsTimestamp = Date.now()
		module.makeVisitedURLsList(payload.data)
		module.makeVisitedDomainsList(payload.data)
		module.isVisitedURL(id, payload.callerURI)
	}

	module.makeVisitedURLsList = function (d) {
		var list = []
		for (var i = 0; i < d.length; i++) {
			if (d[i] &&
				d[i].url &&
				typeof d[i].url === 'string') {
				list.push(d[i].url.toLowerCase())
			}
		}
		module.visitedURLs = list
	}

	module.makeVisitedDomainsList = function (d) {
		module.visitedDomains = []
		for (var i = 0; i < d.length; i++) {
			if (d[i] &&
				d[i].my &&
				d[i].url &&
				typeof d[i].url === 'string') {
				module.addVisitedDomain(d[i].url.toLowerCase())
			}
		}
	}

	module.isVisitedURL = function (id, url) {
		var now = Date.now()
		if (module.visitedURLsTimestamp === null) return;
		if ((now - module.visitedURLsTimestamp) > parseInt('14400000'))
			return send_to_tab.invoke(id, { syncVisitedURLs: null });
		if (module.visitedURLs.length === 0) return;
		if (typeof url !== 'string') return;
		if (module.visitedURLs.indexOf(url.toLowerCase()) !== -1)
			return send_to_tab.invoke(id, { init: true });
		module.isVisitedDomain(id, url)
	}

	module.isVisitedDomain = function (id, url) {
		if (typeof url !== 'string') return;
		var domain = url.toLowerCase().split('/')[2];
		if (module.visitedDomains.indexOf(domain) !== -1)
			return send_to_tab.invoke(id, { init: 'PREVENT_ANNOTATIONS_GET' });
	}

	module.addVisitedURL = function (id, payload) {
		if (typeof payload !== 'object') return
		if (typeof payload.url !== 'string') return
		var url = payload.url.toLowerCase()
		module.visitedURLs.push(url)
		if (payload.addDomain) module.addVisitedDomain(url)
	}

	module.addVisitedDomain = function (url) {
		if (typeof url !== 'string') return;
		var domain = url.toLocaleLowerCase().split('/')[2];
		if (domain && module.visitedDomains.indexOf(domain) === -1) module.visitedDomains.push(domain)
	}

	module.highlighterPreference = function (id, on) {
		module.session.highlighterPreference = on
		//  .highlighterPreference = '' + on
	}

	module.highlighterPreferenceColor = function (id, color) {
		module.session.highlighterPreferenceColor = color
		// localStorage.highlighterPreferenceColor = '' + color
	}

	module.setPreferences = function (id, preferecesObj) {
		console.log("background setPreferences", { preferecesObj })
		Object.keys(preferecesObj).forEach(function (k) {
			module.session.preferences[k] = preferecesObj[k]
			// localStorage.preferences = JSON.stringify(module.session.preferences)
		})
	}

	module.contentState = function (id, payload) {
		// Icon
		var iconState = ''
		if (!payload.highlighter) iconState = '-off'
		if (payload.pageNotAnnotable) iconState = '-blacklisted'
		if (payload.blacklisted) iconState = '-blacklisted'
		if (!module.session.user) iconState = '-out'
		// red mood wins
		if (payload.redMood) iconState = ''
		// apply
		setF1000ActionButton(id, iconState)
		// References Counter
		var badgeText = ''
		if (payload.referencesNumber && !payload.blacklisted) badgeText += payload.referencesNumber
		setF1000ActionButtonBadge(id, badgeText)
	}

	module.pageInfosCacheSet = function (id, payload) {
		module.pageInfosCache[payload.uri] = payload
	}

	module.pageInfosCacheGet = function (id, payload) {
		// XN refactor to plausible code once we have enough rules
		var pageInfos = module.pageInfosCache[payload.referrer]
		var straightMatch = false
		var complexMatch = false
		var validMatch = !!pageInfos
		//console.log(pageInfos, payload)
		if (validMatch) {
			// STRAIGHT
			if (typeof pageInfos.id !== undefined &&
				typeof payload.id !== undefined) {
				straightMatch = pageInfos.id == payload.id // same id
			}
			if (typeof pageInfos.id !== undefined) {
				if (payload.uri.indexOf(pageInfos.id) !== -1) straightMatch = true // id in uri
			}
			// COMPLEX
			if (payload.uri.indexOf('arxiv') !== -1 && payload.uri.indexOf('abs') !== -1) {
				var arxivParts = payload.uri.split('/')
				var arxivId = arxivParts[arxivParts.length - 1].match(/[\d|\.]+/)
				if (arxivId && pageInfos.uri.indexOf(arxivId[0]) !== -1) complexMatch = true // arxiv.org
			}
			var plosPayloadURI = decodeURIComponent(payload.uri)
			var plosSplit = plosPayloadURI.split('doi/')
			if (plosSplit[1] && decodeURIComponent(pageInfos.uri).indexOf(plosSplit[1].split('&')[0]) !== -1) complexMatch = true // PLOSOne
			var springerLinkId = pageInfos.uri.match(/article\/(.*)?\/?/i)
			if (springerLinkId && springerLinkId.length && springerLinkId[1]) {
				springerLinkId = springerLinkId[1]
				complexMatch = payload.uri.indexOf(springerLinkId) !== -1 ? true : false // SpringerLink
			}
			var filenameMatch = payload.uri.match(/([^\/]*)\.pdf$/)
			if (filenameMatch && filenameMatch[1] && filenameMatch[1].length > 8) {
				if (pageInfos.uri.indexOf(filenameMatch[1]) !== -1) complexMatch = true // naturejobs, at lest
			}
			var full2pdfURI = pageInfos.uri.replace('full', 'pdf')
			if (full2pdfURI == payload.uri) complexMatch = true // nature, at least
			var wordOnlyURI_payload = payload.uri.replace('pdf', '').replace(/[^\w]/g, '')
			var wordOnlyURI_pageInfos = pageInfos.uri.replace('pdf', '').replace(/[^\w]/g, '')
			if (wordOnlyURI_payload == wordOnlyURI_pageInfos) complexMatch = true // peerj, at least
			// NOTE: dl.acm only for now but the longEnoughNumericId may be made generic
			if (pageInfos.uri.indexOf('dl.acm.org/') !== -1) {
				// any more than 6 chars numeric sequence has a good chance of being an id
				var longEnoughNumericId = pageInfos.uri.match(/id=[0-9]+/)
				if (longEnoughNumericId &&
					longEnoughNumericId[0] &&
					longEnoughNumericId[0].length &&
					longEnoughNumericId[0].length >= 6) {
					if (payload.referrer.indexOf(longEnoughNumericId) !== -1) complexMatch = true
				}
			}
			// SIMPLE AND DEFAULT, overrides validMatch
			if (payload.uri.indexOf(pageInfos.uri.split('?')[0]) === 0) validMatch = true // pubmedcentral
			else if (payload.uri.split('/')[3] === pageInfos.uri.split('/')[6]) validMatch = true // sciencedirect
			else if (complexMatch) validMatch = true // any of the complex rules
			else if (straightMatch) validMatch = true // full id match
			else validMatch = false // default
		}
		//console.log(validMatch)
		// use cached pageInfos (if any) in send_to_tab, this func MUST always call back send_to_tab
		send_to_tab.invoke(id, { pageInfosCacheUse: validMatch ? pageInfos : null })
	}

	return module;
})();
