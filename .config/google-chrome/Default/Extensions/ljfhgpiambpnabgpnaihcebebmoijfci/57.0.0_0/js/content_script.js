'use strict';

/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

// Problematic alert replacement
// function healthCheckError() {
// 	clearInterval(healthCheck)
// 	F1000Global.getUIRoot().appendChild(jsonML2Dom(templates.reloadErrorMessage(), handlers))
// }

// const healthCheck = setInterval(() => {
// 	try {
// 		browser.runtime.sendMessage({ ping: true }).then(() => { }).catch((error) => {
// 			healthCheckError()
// 		})
// 	} catch (e) {
// 		healthCheckError()
// 	}
// }, 1000)

/*__standard_only__*/
if (browser && browser.runtime) {
	// Inbound
	browser.runtime.onMessage.addListener(function (request, sender) {
		content_script.invoke(null, request)
	})
	// Outbound
	window.background = {
		invoke: function (id, request) {
			browser.runtime.sendMessage(request)
		}
	}
}
/*__standard_only__*/

// Chrome storage wrapper
let chromeStorageContent = {
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
				resolve(result)
			});
		})
	}
}

//
// Content Script
//
var content_script = (function () {

	var module = {}

	function initiateUrlWatcher() {
		let oldLocation = 'initial'

		setInterval(() => {
			const newLocation = window.location.href

			if (oldLocation !== 'initial' && newLocation !== oldLocation) {
				// Here, we destroy the pageObjectIds so that the update 
				// falls through to the default which is a spinner
				state.pageObjectIds = undefined
				popup.update()
				setTimeout(() => {
					module.pageScan()
					module.boot()
					if (popup.active) popup.update()
					module.contentState()
				}, 2000)
			}

			oldLocation = newLocation
		}, 300)
	}

	initiateUrlWatcher()

	module.session = null

	module.hl = f1kat.hl
	module.highlighter = false
	module.highlighterEnabled = false

	module.invoke = function (id, request) {
		//console.log("message received from background: ", { request })
		Object.keys(request).forEach(function (key) { if (module[key]) { module[key](request[key]) } })
	}

	// Shims background proxy - only used in bookmarklet mode
	module.broadcast = function (request) { module.invoke(null, request) }

	//
	// browserAction
	//
	module.browserAction = function () {
		if (!module.session) return window.f1katBrowserAction = true
		popup.toggle()
	}

	//
	// Interface Hacks
	//
	module.collectionIdFixed_Editor = false
	module.collectionId = function () {
		if (f1kat.hl.ui && !module.collectionIdFixed_Editor) {
			if (pageObjectIds.libraryItemId) {
				// Editor .has-libraryItemId
				module.collectionIdFixed_Editor = true
				document.querySelector('#f1kat-editor-controls').classList.add('has-libraryItemId')
			} else {
				// Editor Trigger Change
				document.querySelector('#f1kat-editor-collectionSelect-trigger .f1kat-collectionIdLabel').textContent = module.session.collectionId.name
			}
		}
		// Popup Trigger Change
		if (popup.active) {
			var popupTrigger = document.querySelector('#f1000-at-popup-collectionSelect-trigger .f1kat-collectionIdLabel')
			if (popupTrigger) popupTrigger.textContent = module.session.collectionId.name
		}
		// set current collection as default
		module.setDefaultCollection()
	}

	module.setDefaultCollection = function (collection) {
		try {
			browser.runtime.sendMessage(null, { "collectionId": collection || module.session.collectionId })
		} catch (e) {
			console.log('F1000Annotator extension is disconnected from its background services, please reload the page for full features.')
		}
	}

	module.save2SelectPENDING = false
	module.save2Select = function (e, makePositionFixed) {
		// pending ui
		if (module.save2SelectPENDING) {
			return;
		}
		// collections available
		var hasValidCollectionsData = module.collections && !!module.collections.dataValidityCount
		if (hasValidCollectionsData) {
			module.collections.dataValidityCount--
			var el = e.target || e.srcElement
			return F1000Global.collectionSelect.open(el, module.collections, module.session.collectionId, makePositionFixed);
		}
		// fetch collections
		function getCollections() {
			F1000Global.request("GET", getBaseURL() + '/annotator/collections', null, 'json',
				function (d) {
					module.save2SelectPENDING = false
					var collections = {
						'PRIVATE': [],
						'SHARED': [],
						canCreate: canCreate,
						dataValidityCount: dataValidityCount
					}
					for (var i = 0; i < d.length; i++) {
						var item = d[i]
						collections[item.type].push(item)
						for (var j = 0; j < item.children.length; j++) collections[item.type].push(item.children[j])
					}
					module.collections = collections
					module.save2Select(e, makePositionFixed)
				},
				content_script.unauthorized
			)
		}

		module.save2SelectPENDING = true
		var user = content_script.session.user
		var isFreeUser = user.hasValidWorkbenchSubscription === false || user.hasTrialAccess === true
		var dataValidityCount = Infinity
		var canCreate = false
		if (isFreeUser) {
			dataValidityCount = 1
			F1000Global.request("GET", getBaseURL() + '/annotator/collections/can-create', null, 'json',
				function (d) {
					canCreate = d
					getCollections()
				},
				content_script.unauthorized
			)
		} else {
			canCreate = true
			getCollections()
		}
	}

	module.safeSelectionCollapse = function () {
		// we wrap this collapse only as ie throws when last click has moved the
		// caret to something not textual like a popup (logout) icon
		try {
			document.getSelection().collapse(document.body, 0)
		} catch (error) {
			//console.log(error)
		}
	}

	module.closeHighlighterEditor = function (e) {
		// This is used by PDFViewer custom find
		// XN we can remove this selection.collapse/caretBackup if we fix the interaction with the PDFviewer
		var activeElement;
		var caretPositionBackup;
		if (f1kat.caretBackupActive) {
			activeElement = document.activeElement
			caretPositionBackup = f1kat.hl.caretBackup(activeElement)
		}
		// this collapse prevents glitches (PDFViewer scrollbar mouseup)
		// XN it may become useless as well as the method
		module.safeSelectionCollapse()
		// Actual close of the editor
		if (module.highlighter) f1kat.hl.uiStateClosed()
		// Restore the focus and caret after the collapse if any
		if (caretPositionBackup) f1kat.hl.caretBackup(activeElement, caretPositionBackup)
	}

	//
	//  Init
	//
	module.init = function (forceStart) {
		if (false) forceStart = true
		// console.log('content_script.init', forceStart)
		if (F1000Global.blacklisted) return;
		// Restores the highlighter after a logout/logged back
		if (module.highlighter) return module.highlighterEnabled = true;
		if (pageObjectIds.dominant.type === "PageTitle" && !forceStart) {
			// isVisitedURL will invoke back with forceStart set to true or PREVENT_ANNOTATIONS_GET
			var uri = module.checkingURI()
			return browser.runtime.sendMessage(null, { isVisitedURL: uri });
		}
		// PREVENT_ANNOTATIONS_GET means we are starting due to visited domain mode invocation
		if (forceStart === "PREVENT_ANNOTATIONS_GET") {
			// this mode is ignored on the workbench
			if (state.workbenchMode) return;
			// this will actually block the fetch
			F1000Global.preventAnnotationsGET = true
			// this mode is forced to off on references pages, except wikipedia
			if (pageObjectIds.list.length > 0) {
				if (F1000Global.whitelisted !== 'wikipedia') {
					return;
				}
			}
		}
		// mobile overrides page infos with passed app data, uri is always special
		if (false) pageObjectIds.enforced()
		// useRelativeURI, used by the PDFViewer, chechingURI should be the one used by visitedURLs methods
		pageObjectIds.dominant.uri = F1000Global.useRelativeURI ? document.location.pathname : module.checkingURI()
		// Init Prime Module
		module.primeContributorInit()
		// Init Highlighter
		module.hl.init(pageObjectIds.dominant)
		module.highlighter = true
		// Color based on highlighterPreferenceColor
		var preferenceColor = module.session.highlighterPreferenceColor
		if (preferenceColor) state.highlighter.color = preferenceColor
		// State based on highlighterPreference
		if (module.session.highlighterPreference === false) return;
		module.highlighterState(true)
	}

	module.highlighterState = function (on) {
		if (on && module.highlighterEnabled === false) {
			module.highlighterEnabled = true
			state.highlighter.on = true
			module.contentState()
		}
	}

	module.primeContributorInit = function () {
		// console.log('contentscript.primeContributorInit')
		// NOTE: uncomment to mock contributor
		// state.primeContribution = {
		// 	info: {
		// 		articleId: null,
		// 		recommendationStatus: 'NONE',
		// 		numberOfDrafts: 3
		// 	},
		// 	encodedDominant: F1000Global.encodeDominantAsQS()
		// }
		// return
		state.primeContribution = null
		// var isPrimeContributor = state.session &&
		// 	state.session.user &&
		// 	state.session.user.primeContributor
		// NTOE: removed support in 44.4.3 due to design issues
		var isPrimeContributor = false
		if (isPrimeContributor) {
			var isArticle = state &&
				state.pageObjectIds &&
				state.pageObjectIds.pageType === 'ARTICLE' &&
				state.pageObjectIds.dominant &&
				state.pageObjectIds.dominant.type !== 'PageTitle'
			if (isArticle) {
				// we don't see this run yet
				var payload = state.pageObjectIds.dominant
				F1000Global.request('POST', F1000Global.ATConfig.baseURL + '/annotator/contributor-info', payload, 'json',
					function (d) {
						// console.log('F1000Annotator: /contributor-info', d)
						var encodedDominant = F1000Global.encodeDominantAsQS()
						state.primeContribution = {
							info: d,
							encodedDominant: encodedDominant
						}
						if (popup.active) popup.update()
					},
					content_script.unauthorized
				)
			}
		}
	}

	//
	// Boot
	// NOTE: when F1000Global.whitelist is defined setupAnnotations won't run unless
	// F1000Global.whitelistedReady == true, that's why not all whitelisters register them self as F1000Global.whitelisted
	// XN please refactor me, there's no need for the asyn to come in the middle
	//
	module.boot = async function () {

		//console.log('content_script.boot', F1000Global.locationGuess)
		F1000Global.embeddedPluginOnlyPage = false;

		var withArgs
		var body = document.body
		var head = document.head
		var host = window.location.host
		var href = window.location.href
		var pathname = window.location.pathname
		//
		// (exit) Blacklisted
		//
		if (F1000Global.blacklisted) return F1000Global.pageNotAnnotable = true;
		//
		// (exit run whitelist code without flaging domain) Workbench, override behaviour
		//
		if (F1000Global.locationGuess === "workbench") return F1000Global.whitelistHandlers.workbench();
		//
		// PDFs
		//
		// (side effect without whitelisting) webkit native plugin
		var bodyFirstChild = body.children[0]
		if (bodyFirstChild &&
			(bodyFirstChild.name === "plugin" || bodyFirstChild.nodeName.match(/embed/i)) &&
			bodyFirstChild.type === "application/pdf") {
			F1000Global.embeddedPluginOnlyPage = true
			popup.showWelcomeBalloon('browserPDF')
			popup.toggleHook = function () {
				// XN: FCORE-13989 fix user interaction since chrome 69
				bodyFirstChild.style.transition = 'transform .2s'
				bodyFirstChild.style.transform = popup.display ? 'translateX(-500px)' : 'initial'
			}
		}
		// (side effect without whitelisting) mozilla pdf.js
		var mozillaPDFViewerHeadBaseTag = head ? head.querySelector('base') : null
		if (mozillaPDFViewerHeadBaseTag &&
			mozillaPDFViewerHeadBaseTag.href &&
			mozillaPDFViewerHeadBaseTag.href.indexOf('pdf.js') !== -1) {
			F1000Global.embeddedPluginOnlyPage = true
			popup.showWelcomeBalloon('browserPDF')
		}
		// (sync) frameset with PDF url
		if (F1000Global.framesetPage) {
			// any pdf hint as we cannot anntoate frameset html?
			var headPDFHint = top.document.head.querySelector('[name*="pdf"]')
			if (headPDFHint) {
				F1000Global.embeddedPluginOnlyPage = true
				F1000Global.whitelisted = 'framesetPDF'
			}
		}
		// (sync) wiley /[e]pdf
		if (host.indexOf('.wiley.') !== -1) {
			if ((pathname.indexOf('/epdf') !== -1 && document.querySelector('meta[name="PDF_URL"]')) ||
				(pathname.indexOf('/epdf') !== -1 && document.getElementById('epub-reader-container')) ||
				(pathname.indexOf('/epdf') !== -1 && document.querySelector('#viewer.pdfViewer')) ||
				(pathname.indexOf('/pdf') !== -1 && document.getElementById('pdfDocument')) ||
				(pathname.indexOf('/pdf') !== -1 && document.getElementById('pdf-iframe')) ||
				(pathname.indexOf('.pdf') !== -1 && document.getElementsByTagName('embed').length > 0)) {
				F1000Global.embeddedPluginOnlyPage = true
				F1000Global.whitelisted = 'wileyPDF'
			}
		}
		var elsevierReader = host.indexOf('reader.elsevier.') !== -1
		if (elsevierReader) {
			F1000Global.embeddedPluginOnlyPage = true
			F1000Global.whitelisted = 'elsevierReader'
		}

		// >>> (exit without highlighter) F1000Global.embeddedPluginOnlyPage: any former PDF found, get cache infos and exit
		if (F1000Global.embeddedPluginOnlyPage) {
			module.pageInfosCacheGet()
			if (F1000Global.whitelisted) F1000Global.whitelistHandlers[F1000Global.whitelisted]()
			return
		}
		// (sync) ember Preprint, many domains, eg. https://osf.io/h53r2/
		var emberPreprint = document.querySelector('meta[name="preprint-service/config/environment"]')
		if (emberPreprint) {
			F1000Global.whitelisted = 'emberPreprint'
		}
		//
		// (sync) F1000 PDF Viewer
		//
		var pdf = head && head.querySelector('meta[name="F1000-PDF-Viewer"]')
		if (pdf) {
			var isLegacy = !!head.querySelector('meta[name="F1000-PDF-Viewer-legacy"]')
			withArgs = [+pdf.content]
			F1000Global.whitelisted = isLegacy ? 'F1000_PDF_Viewer_Legacy' : 'F1000_PDF_Viewer_Latest'
		}
		//
		// Sync whitelisters discovery
		//
		if (F1000Global.wellKnownWebPage) F1000Global.whitelisted = 'wellKnownWebPage'
		var pubmed = host.match(/\.ncbi\.nlm\.nih\./i)
		if (pubmed) {
			if (document.querySelector('main.search-page')) F1000Global.whitelisted = 'pubmed2017Search'
		}
		var europepmc = host.match(/europepmc\.org$/i)
		if (europepmc) {
			if (href.match(/\/article\//i)) F1000Global.whitelisted = 'europe_pmc'
		}
		var gScholar = host.indexOf('scholar.google') === 0
		if (gScholar) F1000Global.whitelisted = "gScholar"
		var cell = host.match(/\.cell\.com$/i)
		if (cell) F1000Global.whitelisted = 'cell_com'
		var embopress = host.match(/\.embopress\./i)
		if (embopress) F1000Global.whitelisted = 'embopress'
		var sciencedirect = host.match(/\.sciencedirect\.com$/i)
		if (sciencedirect) {
			var sciencedirectSearch = href.indexOf('/search?') !== -1 || href.indexOf('/search/') !== -1
			F1000Global.whitelisted = sciencedirectSearch ? 'sciencedirect2017Search' : 'sciencedirect_com'
		}
		var lens = host.match(/\.pnas\./i) || host.match(/\.elifesciences\./i)
		if (lens && href.match(/\/lens/i)) F1000Global.whitelisted = 'lens'
		var wiley = host.match(/\.wiley\./i)
		if (wiley) F1000Global.whitelisted = 'wiley'
		var wikipedia = host.indexOf('.wikipedia.') !== -1
		if (wikipedia) F1000Global.whitelisted = 'wikipedia'
		var retractionwatch = host.indexOf('retractionwatch.') !== -1
		if (retractionwatch) F1000Global.whitelisted = 'retractionwatch'
		var theconversation = host.indexOf('theconversation.') !== -1
		if (theconversation) F1000Global.whitelisted = 'theconversation'
		// NOTE: primoBeta and primoExplore have very similar scrapers but are not the same
		var primoBeta = host.indexOf('beta.nli.org.il') !== -1
		if (primoBeta) {
			F1000Global.whitelisted = 'primoBeta'
		}
		var primoExplore = href.indexOf('/primo-explore/') !== -1
		if (primoExplore) {
			// maybe too broad, but we gain a lot of domains: FCORE-11592
			if (location.pathname.indexOf('/primo-explore/') === 0) F1000Global.whitelisted = "primoExplore"
		}
		var exlibris = host.indexOf('.exlibrisgroup.') !== -1
		if (exlibris) {
			if (href.indexOf('/discovery/') !== -1) F1000Global.whitelisted = "primoExplore"
		}
		var ucDavis = host.indexOf('search.library.ucdavis.edu') !== -1
		if (ucDavis) {
			if (href.indexOf('/discovery/') !== -1) F1000Global.whitelisted = "primoExplore"
		}
		var cardiff = host.indexOf('librarysearch.cardiff.ac.uk') !== -1
		if (cardiff) {
			if (href.indexOf('/discovery/') !== -1) F1000Global.whitelisted = "primoExplore"
		}
		var academicMicrosoft2018 = href.indexOf('academic.microsoft.') !== -1
		if (academicMicrosoft2018) F1000Global.whitelisted = 'academicMicrosoft2018'
		var plosSearch = host.indexOf('plos.org') !== -1 && href.indexOf('/search') !== -1
		if (plosSearch) F1000Global.whitelisted = 'plos2017Search'
		var researchGateSearch = href.indexOf('researchgate.net/search') !== -1
		if (researchGateSearch) F1000Global.whitelisted = 'researchGateSearch'
		var webOfScience2021 = href.indexOf('webofscience.com/') !== -1
		if (webOfScience2021) F1000Global.whitelisted = 'webOfScience2021'
		var resoluteAiSearch = host.indexOf('resolute.ai') !== -1
		if (resoluteAiSearch) F1000Global.whitelisted = 'resoluteAi'
		var apaOrg = host.indexOf('.apa.org') !== -1
		if (apaOrg) F1000Global.whitelisted = 'apaOrg2021'
		var sciencemagSearch = host.indexOf('search.sciencemag') !== -1
		if (sciencemagSearch) F1000Global.whitelisted = 'sciencemagSearch'
		var cochranelibrary = host.indexOf('cochranelibrary.') !== -1
		if (cochranelibrary) {
			if (href.indexOf('search') !== -1) {
				F1000Global.whitelisted = 'cochraneLibrarySearch'
			}
		}
		var nature = host.indexOf('.nature.') !== -1
		if (nature) {
			if (href.indexOf('search') !== -1) {
				F1000Global.whitelisted = 'natureSearch'
			}
		}
		var ncbi_nlm_nih_gov = host.indexOf('ncbi.nlm.nih.gov' !== -1)
		if (ncbi_nlm_nih_gov) {
			if (href.indexOf('myncbi/collections') !== -1) {
				F1000Global.whitelisted = 'myncbiCollections'
			}
		}
		var hdasNice = host.indexOf('hdas.nice.') !== -1
		if (hdasNice) F1000Global.whitelisted = 'hdasNice'
		var ovid = host.indexOf('ovidsp.') === 0 || host.indexOf('ovidsp-') === 0
		if (ovid) F1000Global.whitelisted = 'ovid'
		var acl = host.indexOf('dl.acm.') === 0
		if (acl) F1000Global.whitelisted = 'acl'
		if (host.indexOf('agricola.') === 0) {
			if (location.pathname.indexOf('/search') !== -1) F1000Global.whitelisted = 'agricolaSearch'
		}
		if (href.indexOf('f1000.com/prime') !== -1 ||
			href.indexOf('f1000internal.com/prime') !== -1 ||
			href.indexOf('sciwheel.com/prime') !== -1 ||
			href.indexOf('sciwheelinternal.com/prime') !== -1 ||
			href.indexOf('facultyopinions.com/prime') !== -1 ||
			href.indexOf('facultyinternal.com/prime') !== -1) {
			F1000Global.whitelisted = 'f1000PrimeSearch'
		}
		if (host.indexOf('hud.summon.') === 0) {
			F1000Global.whitelisted = 'hudSummon'
		}
		/*var ieeexploreSearch = host.indexOf('ieeexplore.') !== -1
		if (ieeexploreSearch && href.indexOf('/search') !== -1) F1000Global.whitelisted = 'ieeexploreSearch'*/
		/*var gPlayStore = host.indexOf('play.google.') === 0
		if (gPlayStore) F1000Global.whitelisted = 'gPlayStore'*/
		//
		// Async whitelisters discovery and execution > exits init flow here without defining any whitelisted global flag
		//
		var gbooks = host.match(/books.google\./i)
		if (gbooks) {
			return F1000Global.whitelistHandlers.gbooks()
		}
		var scopus = host.match(/\.scopus\.|-scopus-/i)
		if (scopus && href.match(/\/record\//i)) {
			return F1000Global.whitelistHandlers.scopus_article()
		}
		//
		// Sync Whitelisters execution > boots the flaged handler > continue init flow
		//
		if (F1000Global.whitelisted) F1000Global.whitelistHandlers[F1000Global.whitelisted].apply(null, withArgs)
		//
		// Finally > follow init flow > init highlighter > set cache infos
		//
		module.init()
		module.pageInfosCacheSet()
	}
	// End boot

	//
	// Session
	//
	module.unauthorized = function (status) {
		popup.hasPendingUpdate = false
		if (status === 401) {
			// NOTE: not in use
			// // check cookies are on
			// if (typeof F1000Global.loginTimestamp !== undefined &&
			// 	(Date.now() - F1000Global.loginTimestamp < 400)) F1000Global.noCookies = true
			// Session
			browser.runtime.sendMessage(null, { user: null })
			browser.runtime.sendMessage(null, { userLoginStatus: { loggedOut: true } })
			// Interface
			F1000Global.collectionSelect.close()
			// ux
			if (!popup.display) popup.toggle()
		}
	}

	module.logged = function (data) {
		if (!data) return;
		if (typeof data === "string") data = JSON.parse(data)
		// Beta Program
		if (data.id && typeof data.workbenchBeta !== "undefined" && data.workbenchBeta !== true) {
			data.id = null
			data.betaRestriction = true
			state.login.betaRestriction = true
		}
		// End of Beta Program code
		if (data.id) {
			// popup UI
			state.login.tainted = false
			state.session.user = data
		}
		// // check cookies are on
		// F1000Global.loginTimestamp = Date.now()
		// finally
		// Setting the user to being logged in for every case 
		// except where data is {}, because that means they are logged out
		// yes, this function logs the in AND out and doesn't specify which
		if (Object.keys(data).length !== 0) {
			browser.runtime.sendMessage(null, { userLoginStatus: { loggedOut: data.apiToken === null } })
		}
		browser.runtime.sendMessage(null, { user: data })
	}

	module.isSignedIn = function (apiToken) {
		if (apiToken !== undefined) {
			// token check at boot
			if (F1000Global.setAuthorizationToken) {
				F1000Global.setAuthorizationToken(apiToken)
			} else {
				F1000Global.AuthorizationToken = apiToken
			}
			F1000Global.request('get', getBaseURL() + '/annotator/signed_in', null, 'json',
				function (d) {
					if (typeof d === 'object' && !d.apiToken) {
						// when signedIn succed our current token is valid
						d.apiToken = apiToken
					}
					module.logged(d)
				},
				function () {
					// this will handle all !200
					module.logged({})
				}
			)
		} else {
			// cookies check to sync on F1000 - not a newapi
			var apiEntryPoint = getBaseURL().replace('/newapi', '')
			F1000Global.request('get', apiEntryPoint + '/annotator/signed_in', null, 'json',
				module.logged,
				function () {
					// this will handle all !200
					module.logged({})
				}
			)
		}
	}

	module.anyAnnotations = function (flag) {
		module.session.user.hasAnyAnnotations = flag
		browser.runtime.sendMessage(null, { anyAnnotations: { flag: flag } })
	}

	module.syncVisitedURLs = function (user) {
		// This can be called before a user is received via the broadcast
		if (user && user.apiToken) {
			F1000Global.setAuthorizationToken(user.apiToken)
		}
		F1000Global.request('get', getBaseURL() + '/annotator/urls', null, 'json',
			function (d) { browser.runtime.sendMessage(null, { syncVisitedURLs: { data: d, callerURI: document.location.href } }) },
			function (d) {
				// leave wrapped or we get undefined when invoking syncVisitedURLs first time after an installation
				content_script.unauthorized(d)
			}
		)
	}

	module.checkingURI = function () {
		var uri = pageObjectIds.dominant.uri || document.location.href
		return uri
	}

	module.addVisitedURL = function () {
		var addDomain = (module.highlighter && module.highlighterEnabled) ? true : false
		var uri = module.checkingURI()
		browser.runtime.sendMessage(null, { addVisitedURL: { url: uri, addDomain: addDomain } })
	}

	// commenting this out did not reset referer to the correct value
	module.setDemoMode = function (d) {
		if (d && d.type) {
			if (d.type === 'referencesImport') {
				d.referrer = location.href.replace(location.hash, '')
				if (d.collectionId) module.setDefaultCollection(d.collectionId)
				browser.runtime.sendMessage(null, { setDemoMode: d })
			}
		} else {
			browser.runtime.sendMessage(null, { setDemoMode: null })
		}
	}

	module.runDemoMode = function (demoMode) {
		// if any referrer it should match
		if (!demoMode.referrer || demoMode.referrer === document.referrer) {
			// ta dan!
			if (demoMode.type === 'referencesImport') {
				if (location.href.indexOf('/pubmed/?') !== -1 ||
					location.href.indexOf('/scholar?') !== -1) {
					// not consumed demoMode is propagated with new referrer to allow navigation
					state.demoMode = demoMode
					module.setDemoMode(null)
					window.addEventListener('unload', function () {
						if (state.demoMode) content_script.setDemoMode(state.demoMode)
					})
					// adding references will clear the state demoMode
					popup.toggleHook = function () {
						var selectAll = document.querySelector('#f1000-at-popup input#all')
						if (selectAll) selectAll.click()
						popup.toggleHook = null
					}
					return { messageQueue: { message: 'browserAction' } }
				}
			}
		}
		return false
	}

	module.sessionHandler = function (payload) {
		// console.log('sessionHandler', payload)
		var session = payload.backgroundSession
		var demoMode = payload.demoMode
		var messageQueue = payload.messageQueue
		// Start in Demo mode, will inherit collectionId and automate some behaviour
		if (demoMode) {
			var demoEffects = module.runDemoMode(demoMode)
			if (demoEffects && demoEffects.messageQueue) messageQueue = demoEffects.messageQueue
		}
		// Propagates session
		module.session = session
		state.session = session
		module.session.inheritedCollectionId = session.collectionId
		// Beta Program
		if (session.betaRestriction) state.login.betaRestriction = true
		// End of Beta Program code
		if (module.session.user) {
			//console.log('sessionHandler @counter:', window.counter)
			//console.log('sessionHandler - module.session.user')
			// Authorization
			F1000Global.setAuthorizationToken(module.session.user.apiToken)

			if (window.location.host.match(/europepmc\.org$/i)) {
				popup.update()
				setTimeout(() => {
					module.pageScan()
					module.boot()
					if (popup.active) popup.update()
				}, 5000)
			} else {
				module.pageScan()
				module.boot()
				if (popup.active) popup.update()
			}
		} else {
			//console.log('sessionHandler - no user')
			// Authorization
			F1000Global.setAuthorizationToken(null)
			// Interface
			F1000Global.collectionSelect.close()
			// this activeElement backup wouldn't be needed if we remove the selection.collapse from closeHighlighterEditor
			var activeElement = document.activeElement
			if (activeElement && activeElement.blur) activeElement.blur()
			module.closeHighlighterEditor()
			if (activeElement && activeElement.focus) activeElement.focus()
			// reset user session
			pageObjectIds.libraryItemId = null
			pageObjectIds.articleId = null
			module.highlighter = false
			module.highlighterEnabled = false
			module.collections = false
			// remove all (any) annotations
			f1kat.hl.annotations.all.forEach(function (a) { f1kat.hl.annotations.remove(a) })
			// reset highlighter session
			f1kat.hl.annotations.all = []
			// reset state
			if (state.references && state.references.showCitedArticles) {
				state.references.showCitedArticles = false
			}
			state.tags = {
				filter: '',
				item: [],
				private: []
			}
			state.filterNotes = {
				id: 'all'
			}
			state.primeContribution = null

			// XN: this will happen twice if /find gets called, but we need it for user switching
			if (popup.active) popup.update()
		}
		// Update status feedback
		module.contentState()

		// no browserAction queue on some domain, like gdocs
		if (!F1000Global.preventBrowserActionQueue) {
			// this means the user clicked the browserAction before the page was bootstrapped
			if (messageQueue && messageQueue.message === "browserAction") module.browserAction()
			// a local flag used when the exstension is comunicating but there was no session yet
			// in ie this is used in the command button to shim the above browserAction queue - see F1000Annotator.html
			if (window.f1katBrowserAction) {
				window.f1katBrowserAction = false
				module.browserAction()
			}
		}
		// Sync session to F1000
		if (!module.signedInSyncTainted) {
			module.signedInSyncTainted = true
			var origin = F1000Global.getOrigin(window)
			var wbURL = getwbURL().replace(/https?:\/\//i, '')
			var isWorkspace = origin.indexOf(wbURL) !== -1
			if (isWorkspace) {
				if (document.body.dataset.signedIn) {
					if (!module.session.user) module.isSignedIn()
				} else {
					if (module.session.user) module.isSignedIn()
				}
			} else {
				var isWorkspaceMarketing =
					origin.indexOf('undefined') !== -1 ||
					origin.indexOf('undefined') !== -1
				if (isWorkspaceMarketing) {
					var isSigningOut = window.location.href.indexOf('?lg') !== -1
					if (isSigningOut) {
						if (module.session.user) module.isSignedIn()
					}
				}
			}
		}
	}

	module.contentState = function () {
		// A2 testing
		// function getDominantFingerprint (dominant) {
		// 	var type = dominant.type
		// 	// TODO REFERENCES
		// 	// https://pubmed.ncbi.nlm.nih.gov/?term=stem%20&page=2 changes "page" on scroll
		// 	// perhaps when PageTitle && REFERENCES don't fire dominant change? see plosone as well
		// 	// as REFERENCES are merged and pageTitle won't call /find it can be even left this way
		// 	if (type === 'PageTitle') {
		// 	return type + ' ' + dominant.uri
		// 	} else {
		// 	return type + ' ' + dominant.id
		// 	}
		// }
		// if (dominant) {
		// 	console.log('%cA1 dfp', 'background: grey; color: white;', getDominantFingerprint(pageObjectIds.dominant))
		// }
		// A2 tensting end

		var contentState = {
			blacklisted: F1000Global.blacklisted,
			highlighter: module.highlighter && module.highlighterEnabled,
			hasUser: !!(state.session && state.session.user),
			referencesNumber: !pageObjectIds.ignoreListCount && pageObjectIds.list.length,
			pageNotAnnotable: F1000Global.pageNotAnnotable,
			redMood: F1000Global.redMood
		}
		// affect browser UI
		browser.runtime.sendMessage(null, { contentState: contentState })
		// affect any integrated UI
		if (F1000Global.integratedUI) F1000Global.integratedUI()
	}

	module.highlighterPreference = function (on) {
		module.session.highlighterPreference = on
		browser.runtime.sendMessage(null, { highlighterPreference: on })
	}

	module.highlighterPreferenceColor = function (color) {
		state.highlighter.color = color
		module.session.highlighterPreferenceColor = color
		browser.runtime.sendMessage(null, { highlighterPreferenceColor: color })
	}

	module.setPreferences = function (preferecesObj) {
		// normal code
		browser.runtime.sendMessage(null, { setPreferences: preferecesObj })
		// ie only workaround to have the preference on the PDF
		if (detectBrowser().browser === 'ie' && (
			window.location.host.indexOf('f1000') !== -1 ||
			window.location.host.indexOf('sciwheel') !== -1 ||
			window.location.host.indexOf('facultyopinions') !== -1 ||
			window.location.host.indexOf('facultyinternal') !== -1
		)) {
			if (localStorage) {
				var ieLocalPref = localStorage.preferences ? JSON.parse(localStorage.preferences) : {}
				Object.keys(preferecesObj).forEach(function (k) {
					if (k.indexOf('welcomeBalloon') !== -1) ieLocalPref[k] = preferecesObj[k]
				})
				localStorage.preferences = stringify(ieLocalPref)
			}
		}
	}

	//
	// Metadata Cache
	//
	module.pageInfosCacheSet = function () {
		// FCORE-10328 1/3: check for any meta pdf uri, for user session dependent PDFs
		// NOTE: if others domains other dl.acm. are reported as failing just remove the outer if
		if (location.host.indexOf('dl.acm.') !== -1) {
			var suggestedPdfUri = document.querySelector('meta[name=citation_pdf_url]')
			if (suggestedPdfUri &&
				typeof suggestedPdfUri.content === 'string' &&
				suggestedPdfUri.content.length > 0) {
				pageObjectIds.dominant.suggestedPdfUri = suggestedPdfUri.content
			}
		}
		browser.runtime.sendMessage(null, { 'pageInfosCacheSet': pageObjectIds.dominant })
	}

	module.pageInfosCacheGet = function () {
		browser.runtime.sendMessage(null, { 'pageInfosCacheGet': pageObjectIds.dominant })
		// no PDF upload on IE
		if (detectBrowser().browser === "ie") return;
		// expiring documents are locally prefetched
		var expiring = document.location.search && document.location.search.indexOf('acdnat=') !== -1
		if (expiring) {
			F1000Global.PDFPrefetchTimeout = setTimeout(function () {
				// this flag is used by all PDF supporting browsers with and without prefetching
				F1000Global.PDFPrefetchData = 'PENDING'
				// DA no local prefetch
				if (DA4pdf) return;
				var pdfHandler = new F1000Global.PDFHandler()
				pdfHandler.get(window.location.href,
					function (base64) {
						if (F1000Global.PDFPrefetchData === 'SAVING') popup.references.pdfPOST(base64, popup.references.pdfQueryString)
						else F1000Global.PDFPrefetchData = base64
					},
					popup.references.pdfError
				)
			}, 120000)
		}
	}

	module.pageInfosCacheUse = function (payload) {
		//console.log('pageInfosCacheUse', payload)
		if (!payload) return;
		// Exporting
		pageObjectIds.dominant.id = payload.id
		pageObjectIds.dominant.pageTitle = payload.pageTitle
		pageObjectIds.dominant.type = payload.type
		// Metadata
		pageObjectIds.dominant.journal = payload.journal
		pageObjectIds.dominant.authors = payload.authors
		pageObjectIds.dominant.publisher = payload.publisher
		pageObjectIds.dominant.date = payload.date
		pageObjectIds.dominant.isbn = payload.isbn
		// FCORE-10328 2/3: used by FF DA export only
		pageObjectIds.dominant.suggestedPdfUri = payload.suggestedPdfUri
	}

	//
	// PageObjectIds initialization
	//
	module.pageScan = function () {
		// PDFViewer pagesInfos will be hardcoded by whitelister
		if (F1000Global.whitelisted &&
			typeof F1000Global.whitelisted === 'string' &&
			F1000Global.whitelisted.indexOf('F1000_PDF_Viewer') !== -1) {
			state.pageObjectIds = pageObjectIds
			return
		}
		// Normal flow
		var reset = false
		var alreadyRunned = pageObjectIds.alreadyRunned
		// Reset, this external reset is used for domain scrapers
		if (alreadyRunned) {
			pageObjectIds.pageType = null
			pageObjectIds.dominant = null
			pageObjectIds.list = []
			// this reset flag will reset the genericIdsScanner
			reset = true
		}
		// console.time('pageObjectIds')
		pageObjectIds.scan(reset)
		// console.timeEnd('pageObjectIds')
		// console.log('a1/dominant', pageObjectIds.pageType, pageObjectIds.dominant.type, pageObjectIds.dominant.id)
		// Set the flag, genericIdsScanner will already set it
		pageObjectIds.alreadyRunned = true
		// State
		state.pageObjectIds = pageObjectIds
		// Recommendations
		recommendations.boot()
	}

	return module
})();
