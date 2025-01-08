'use strict';

/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

/*__standard_only__*/
if (typeof window.browser === 'undefined') {
	if (typeof window.chrome !== 'undefined') {
		window.browser = window.chrome
	}
}
/*__standard_only__*/

//////////////////////////////////////////////////////////////////////////////// Env
var F1000Global = {}

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
F1000Global.ATConfig = {}
// Authorization
F1000Global.AuthorizationToken = null
// Client Info
const browserInfo = detectBrowser()
const userAgent = browserInfo.userAgent
F1000Global.annoratorInfoHeader = null
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

// Behaviour
var DA4pdf = 'false' !== 'false' // string false => boolean false, #javascript

// Chrome storage wrapper
let chromeStorageBackground = {
	set: async function (key, value) {
		const setObject = {}
		setObject[key] = value
		return new Promise((resolve, reject) => {
			chrome.storage.local.set(setObject, function () {
				resolve()
			})
		})

	},
	get: async function (key) {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(key, function (result) {
				resolve(result)
			});
		})
	}
}

async function storageTest() {
	await chromeStorageBackground.set('embeddedPluginOnlyPage', false)
	console.log("after set")
	const x = await chromeStorageBackground.get('embeddedPluginOnlyPage')
	console.log("storageTest result", x)
}

// storageTest()

F1000Global.embeddedPluginOnlyPage = false
F1000Global.gdocs = false
F1000Global.integratedUI = null
F1000Global.preventAnnotationsGET = false
F1000Global.pageNotAnnotable = false
F1000Global.userLocked = false

//////////////////////////////////////////////////////////////////////////////// Rescan Config
// ie only: this affects scan worker, selectionScan and helpers/selectText
// value [>1 for webpages, 1 for pdfs, 0 for off]
F1000Global.partialsFindThreshold = 3

//////////////////////////////////////////////////////////////////////////////// xPaths Caches Config
// THINK TWICE! WE FEAR FALSE POSITIVES ON SAME DOMAIN (see PDFViewer whitelister)
// this is used to invalidate paths cache when rescan engine advances <integer>
F1000Global.rescanSignature = 1
// this is used to invalidate caches when whitelisted is known to be changed <integer>
F1000Global.whitelistedSignature = null
// wheter to use pagesInfo, mostly for PDFs, if true provide a whitelistedPagesInfoCacheDomain and a whitelistedSignature
F1000Global.whitelistedPagesInfoCacheOn = false
F1000Global.whitelistedPagesInfoCacheDomain = null
// wheter to use cached paths, mostly for PDFs, if true provide a whitelistedPathsCacheDomain and a whitelistedSignature
F1000Global.whitelistedPathsCacheOn = false
F1000Global.whitelistedPathsCacheDomain = null

//////////////////////////////////////////////////////////////////////////////// Developmentals
if (F1000Global.isDevelopment === true) {
	if (F1000Global.browser === 'edge' && !false) {
		// edge development server cert issue, not on PDFViewer embedded
		F1000Global.ATConfig.baseURL = 'https://sciwheel.com/newapi'
		F1000Global.ATConfig.wbURL = 'https://sciwheel.com'
	}
}

//////////////////////////////////////////////////////////////////////////////// Safer JSON Stringify
// ie and mobile, we share context with the page so we use a safer stringify,
// except where we are not already sure JSON.stringify is safe eg. background.js
function stringifyOverrider() {
	// safeguarded stringify for page with libraries that override toJSON behaviour (eg. PrototypeJS 1.6),
	// eg. http://precedings.nature.com/documents/5821/version/1
	function overrideToJSONBehaviour(obj, behaviour) {
		if (obj && typeof obj === 'object') {
			if (obj.toJSON) Object.defineProperty(obj, 'toJSON', { writable: true })
			Object.keys(obj).forEach(function (k) { overrideToJSONBehaviour(obj[k], behaviour) })
		}
	}
	function overridedStringify(obj) {
		overrideToJSONBehaviour(obj, undefined)
		return JSON.stringify(obj)
	}
	return overridedStringify
}

var stringify = (false || detectBrowser().browser === 'ie') ? stringifyOverrider() : JSON.stringify


//////////////////////////////////////////////////////////////////////////////// HTTP Request
//
// Set authorization token
//
F1000Global.setAuthorizationToken = function (apiToken) {
	var token = apiToken ? apiToken.type + ' ' + apiToken.value : null
	F1000Global.AuthorizationToken = token
}
//
// Statistics Info Header
//
function getAnnotatorInfoHeader() {
	if (!F1000Global.annoratorInfoHeader) {
		F1000Global.annoratorInfoHeader = '{ "version": "' + '57.0.0' + '", "browser": "' + userAgent + '" }'
	}
	return F1000Global.annoratorInfoHeader
}
//
// URL encoded data simple helper
//
function urlencoded(obj) {
	var query = [];
	for (var key in obj) {
		var item = obj[key];
		if (Array.isArray(item)) for (var i = 0; i < item.length; i++) query.push(encodeURIComponent(key) + '=' + encodeURIComponent(item[i]))
		else query.push(encodeURIComponent(key) + '=' + encodeURIComponent(item))
	}
	return query.join('&')
}
//
// Keep it weired
//
function resolveEndpoint(endpoint) {
	let newEndpoint = endpoint
	// endpoints that don't use token auth api
	if (endpoint.indexOf('/newapi/annotator/login') !== -1) {
		newEndpoint = endpoint.replace('/newapi', '')
	}
	// ie no token auth api, since we rely on cookies due to background limitations
	if (detectBrowser().browser === 'ie') {
		newEndpoint = endpoint.replace('/newapi', '')
		// ie redirect token singout to old logout cookie invalidation
		if (endpoint.indexOf('/signout') !== -1) {
			newEndpoint = endpoint.replace('/signout', '/annotator/logout')
		}
	}
	return newEndpoint
}

//
// Execute API https requests on background process
//
var API_DOMAIN_REGEXP = /https:\/\/sciwheel\.com\/|https:\/\/.{0,6}\.sciwheel\.com\/|https:\/\/.{0,6}\.sciwheelinternal\.com\//i

function getPayload(originalPayload, as) {
	let payload = originalPayload
	if (as === 'json') payload = stringify(originalPayload)
	if (as === 'urlencoded') payload = urlencoded(originalPayload)
	return payload
}

// This request is declared in the background, set on the global object...so it can be called from the foreground...but then sends a message to the background
// because if its accessed from the foreground...god
const proxyToBackgroundRequest = function (method, endpoint, originalPayload, as, successCb, errorCb, progressCb) {
	const payload = getPayload(originalPayload, as)

	const headers = {}
	const url = resolveEndpoint(endpoint)

	if (as === 'json') headers["Content-Type"] = "application/json;charset=UTF-8"
	if (as === 'urlencoded') headers["Content-type"] = "application/x-www-form-urlencoded"
	if (F1000Global.AuthorizationToken) headers['Authorization'] = F1000Global.AuthorizationToken
	headers["X-F1000-AnnotatorInfo"] = getAnnotatorInfoHeader()
	headers["X-F1000-AnnotatorAPIVersion"] = '2'

	browser.runtime.sendMessage(
		{
			performHTTPRequestConfig: {
				credentials: "same-origin", // replaces req.withCredentials = true
				headers,
				method,
				url,
				payload
			}
		},
		function (response) {
			const status = response.status
			let responseResultFromBackground = response.responseResultFromBackground
			if (status >= 200 && status < 400) {
				if (responseResultFromBackground && as === 'json') responseResultFromBackground = JSON.parse(responseResultFromBackground)
				if (successCb) successCb(responseResultFromBackground)
			} else {
				if (errorCb) errorCb(status)
			}
		}
	)
}

F1000Global.request = proxyToBackgroundRequest