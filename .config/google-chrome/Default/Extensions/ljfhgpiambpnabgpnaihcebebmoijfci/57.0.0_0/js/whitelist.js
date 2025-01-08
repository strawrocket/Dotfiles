'use strict';
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

//
// Whitelist Handlers
//
F1000Global.whitelistHandlers = F1000Global.whitelistHandlers || {}
//
// Just blacklist on unsupported browsers
//
F1000Global.whitelistHandlers.justBlacklist = function () {
	F1000Global.blacklisted = true
	F1000Global.whitelisted = undefined
	popup.update()
}
//
// Explicit Polyfills for whitelisted domains (F1000PDFViewer only in practice)
//
F1000Global.whitelistHandlers.polyfill_CustomEvent = function () {
	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	var shall = detectBrowser().browser === 'ie'
	if (shall) {
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}
}
//
// genericSinglePage - YouTube story
// NOTE:
// 	Evaluate if should always run or only on selected domains.
// 	Consider doing this with background event instead of mutation listener.
// 	At which point we can remove probably a lot of handlers:
// 	especially the genericSinglePageSearch dependent ones if we manage to merge
// 	the pageObjectIds merging code.
//
/*F1000Global.whitelistHandlers.singlePageApps = function () {
	// DOM changes
	// test resetup is needed with a hookable function: defaults to url change
	// clone state
	// scan
	// change in dominant > reset session
	// change in list > merge, taking care of save2 disabling logic
	// set contentState
	// popup.update

	function resetup () {
																				console.log('\nrouteready')
		//pageObjectIds.dominant.pageTitle = document.title
		pageObjectIds.scan(true)
		state.pageObjectIds = pageObjectIds
		// closes any pending highlighter ui
		content_script.closeHighlighterEditor()
		F1000Global.preventAnnotationsGET = false
		// clean highlighter state
		content_script.highlighter = false
		content_script.highlighterEnabled = false
		state.highlighter.on = false
		content_script.init()
		popup.update()
																				console.log('end of routeready\n')
	}

	function lastListener (mutations) {
																				console.log('lastListener', mutations, mutations.length)
		if (mutations.length < 10) return;
		if (watcher) clearTimeout(watcher)
		watcher = setTimeout(function () {
			if (window.lastURLState != window.location.href) {
				window.lastURLState = window.location.href
				watcher = null
																				console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
				resetup()
			}
		}, 1000)
	}

	window.lastURLState = window.location.href
	//F1000Global.whitelistedReady = true

	var watcher = null
	var observer = new MutationObserver(lastListener)
	var observerTarget = document.body
	var observerOptions = { childList: true, subtree: true }
	observer.observe(observerTarget, observerOptions)
																				console.log('F1000 Annotator: WHITELIST: Listening to DOM Mutations')
}*/
//
// genericSinglePageSearch
// NOTE: most html scrapers didn't support reset flag, add it when using them as genericSinglePageSearch
// HOW TO REGISTER:
// registered programmatically by whitelister:
//   f1000Prime
//   emberPreprint
//   apaOrg2021
//   webOfScience2021
// registered declaratively in boot as:
F1000Global.whitelistHandlers.hudSummon =
	F1000Global.whitelistHandlers.agricolaSearch =
	F1000Global.whitelistHandlers.sciencemagSearch =
	F1000Global.whitelistHandlers.natureSearch =
	F1000Global.whitelistHandlers.cochraneLibrarySearch =
	F1000Global.whitelistHandlers.myncbiCollections =
	F1000Global.whitelistHandlers.pubmed2017Search =
	F1000Global.whitelistHandlers.sciencedirect2017Search =
	F1000Global.whitelistHandlers.plos2017Search =
	F1000Global.whitelistHandlers.researchGateSearch =
	F1000Global.whitelistHandlers.genericSinglePageSearch = function (behaviourOptions) {
		var options = behaviourOptions || {}

		function resetup() {
			observer.disconnect()
			var cloneList = JSON.parse(stringify(pageObjectIds.list))
			pageObjectIds.scan(true)
			// console.log('pageObjectIds.list.length', pageObjectIds.list.length)
			// preserve exported
			pageObjectIds.list.forEach(function (i, index) {
				var match = cloneList.filter(function (c) {
					return c.id === i.id
				})[0];
				if (match) {
					pageObjectIds.list[index] = match
				}
			})
			// check if they are all done
			var unsaved = pageObjectIds.list.filter(function (i) {
				return !i.saved
			})
			// check if another resolver call is needed
			var hasUnsaved = !!unsaved.length
			if (hasUnsaved) {
				if (!pageObjectIds.prevent_whitelist_forceReferencesResolve) {
					var isResolvableIdentifier = unsaved[0].type !== 'CompositeArticleId'
					if (isResolvableIdentifier) {
						F1000Global.whitelist_forceReferencesResolve = hasUnsaved
					}
				}
			}
			// finalize pageObjectIds
			pageObjectIds.dominant.saved = !hasUnsaved
			state.pageObjectIds = pageObjectIds
			// resetup scan done
			if (options.resetupScanDoneCallback) {
				options.resetupScanDoneCallback()
			}
			// closes any pending highlighter ui
			content_script.closeHighlighterEditor()
			content_script.contentState()
			popup.update()
			recommendations.boot()
			observer.observe(observerTarget, observerOptions)
		}

		// default > 10 mutations
		// .search-results-chunk: pubmed2017
		// .search-items-list: researchGate
		// .search-results-section: emberPreprint
		// .citationListItem: myncbiCollections
		// #resultList: agricolaSearch
		// #search-results-chunk: f1000Prime
		var knownSearchChunkClasses = /search-results-chunk|search-items-list|search-results-section|citationListItem/i
		var knownSearchChunkIds = /search-results-chunk|resultList/i

		function haveKnownChunkClass(mutations) {
			return mutations.reduce(function (acc, i) {
				// console.log(acc, i)
				var firstAddedElement = i.addedNodes && i.addedNodes[0]
				if (firstAddedElement &&
					firstAddedElement.className &&
					firstAddedElement.className.match &&
					firstAddedElement.className.match(knownSearchChunkClasses)) {
					return true
				}
				return acc
			}, false)
		}

		function haveKnownChunkId(mutations) {
			return mutations.reduce(function (acc, i) {
				// console.log(acc, i)
				var mutationRoot = i.target
				if (mutationRoot &&
					mutationRoot.id &&
					mutationRoot.id.match &&
					mutationRoot.id.match(knownSearchChunkIds)) {
					return true
				}
				return acc
			}, false)
		}

		function isValidMutation(mutations) {
			if (isFirstObservedMutation) {
				return true
			} else if (mutations.length >= 10) {
				return true
			} else if (haveKnownChunkClass(mutations)) {
				return true
			} else if (haveKnownChunkId(mutations)) {
				return true
			} else {
				return false
			}
		}

		function lastListener(mutations) {
			// console.log('lastListener', mutations, mutations.length)
			var URLState = location.search
			if (URLState === lastURLState && !isValidMutation(mutations)) {
				return
			}
			isFirstObservedMutation = false
			lastURLState = URLState
			if (watcher) clearTimeout(watcher)
			watcher = setTimeout(function () {
				watcher = null
				// console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
				resetup()
			}, 2000)
		}

		F1000Global.whitelist_forceReferencesResolve = false
		F1000Global.whitelistedReady = true

		var isFirstObservedMutation = !!options.observeFirstMutation
		var lastURLState = location.search
		var watcher = null
		var observer = new MutationObserver(lastListener)
		var observerTarget = document.body
		var observerOptions = { childList: true, subtree: true }
		observer.observe(observerTarget, observerOptions)
		// console.log('F1000 Annotator: WHITELIST: genericSinglePageSearch ready')
	}
//
// F1000 Prime as GSPS
//
F1000Global.whitelistHandlers.f1000PrimeSearch = function () {
	var behaviourOptions = {
		observeFirstMutation: true,
		resetupScanDoneCallback: function () {
			F1000Global.blacklisted = false
			// Prime Contributor
			if (location.href.indexOf('/contributor') !== -1) {
				F1000Global.blacklisted = true
			}
			// Default
			var forceReferencesMode = !!(
				document.getElementById('search-results-chunk') ||
				document.getElementById('recommendations')
			)
			if (forceReferencesMode) {
				// force single valid reference to appear as REFERENCES
				if (pageObjectIds.pageType === 'ARTICLE') {
					// reverse heuristic on single result and discard /find
					pageObjectIds.dominant.saved = false
					if (pageObjectIds.dominant.type !== 'PageTitle') {
						var singleReference = JSON.parse(JSON.stringify(pageObjectIds.dominant))
						pageObjectIds.list.push(singleReference)
						pageObjectIds.pageType = 'REFERENCES'
					}
				}
			}
		}
	}

	F1000Global.whitelistHandlers.genericSinglePageSearch(behaviourOptions)
}
//
// ResoluteAi as GSPS
//
F1000Global.whitelistHandlers.resoluteAi = function () {
	var behaviourOptions = {
		observeFirstMutation: true,
		resetupScanDoneCallback: function () {
			if (location.href.indexOf('/search') !== -1) {
				pageObjectIds.pageType = 'REFERENCES'
			}
			if (pageObjectIds.pageType === 'ARTICLE') {
				var titleEl = document.querySelector('h1')
				if (titleEl && titleEl.textContent) {
					var cleanTitle = titleEl.textContent
					pageObjectIds.dominant.pageTitle = cleanTitle
					pageObjectIds.dominant.pageTitleEscaped = cleanTitle
				}
				// allow /find
				delete pageObjectIds.dominant.saved
				pageObjectIds.libraryItemId = null
				F1000Global.preventAnnotationsGET = false
				F1000Global.ignoreHasAnyAnnotationsRule = true
				content_script.highlighter = false
				content_script.highlighterEnabled = false
				content_script.init()
			}
		}
	}

	F1000Global.whitelistHandlers.genericSinglePageSearch(behaviourOptions)
}
//
// apaOrg 2021 as GSPS
//
F1000Global.whitelistHandlers.apaOrg2021 = function () {
	var behaviourOptions = {
		observeFirstMutation: true,
		resetupScanDoneCallback: function () {
			if (location.href.indexOf('/search/results') !== -1) {
				pageObjectIds.pageType = 'REFERENCES'
			}
			if (pageObjectIds.pageType === 'ARTICLE') {
				// allow /find
				delete pageObjectIds.dominant.saved
				pageObjectIds.libraryItemId = null
				F1000Global.preventAnnotationsGET = false
				F1000Global.ignoreHasAnyAnnotationsRule = true
				content_script.highlighter = false
				content_script.highlighterEnabled = false
				content_script.init()
			}
		}
	}

	F1000Global.whitelistHandlers.genericSinglePageSearch(behaviourOptions)
}
//
// webOfScience 2021 as GSPS
//
F1000Global.whitelistHandlers.webOfScience2021 = function () {
	var behaviourOptions = {
		observeFirstMutation: true,
		resetupScanDoneCallback: function () {
			// Note: we don't support search results, treating all as webpage + id
			pageObjectIds.pageType = 'ARTICLE'
			// allow /find
			delete pageObjectIds.dominant.saved
			pageObjectIds.libraryItemId = null
			F1000Global.preventAnnotationsGET = false
			F1000Global.ignoreHasAnyAnnotationsRule = true
			content_script.highlighter = false
			content_script.highlighterEnabled = false
			content_script.init()
		}
	}

	F1000Global.whitelistHandlers.genericSinglePageSearch(behaviourOptions)
}
//
// IEEEXploreSearch as generiSinglePageSearch
//
/*F1000Global.whitelistHandlers.ieeexploreSearch = F1000Global.whitelistHandlers.genericSinglePageSearch;*/
//
// Google Play Store XX see single page generic support above
//
/*F1000Global.whitelistHandlers.gPlayStore = function () {}*/
//
// WellKnownWebPage
//
F1000Global.whitelistHandlers.wellKnownWebPage = function () {
	pageObjectIds.pageType = 'ARTICLE'
	// all identified references in list
	if (pageObjectIds.dominant.type !== 'PageTitle') {
		pageObjectIds.list.push(JSON.parse(stringify(pageObjectIds.dominant)))
	}
	// dominant from page title
	pageObjectIds.dominant.id = pageObjectIds.dominant.pageTitle = document.title
	pageObjectIds.dominant.type = 'PageTitle'
	pageObjectIds.ignoreListCount = false
	// enable highlights
	F1000Global.whitelistedReady = true
}
//
// Wikipedia - like WellKnownWebPage but refines title
//
F1000Global.whitelistHandlers.wikipedia = function () {
	pageObjectIds.pageType = 'ARTICLE'
	// all identified references in list
	if (pageObjectIds.dominant.type !== 'PageTitle') {
		pageObjectIds.list.push(JSON.parse(stringify(pageObjectIds.dominant)))
	}
	// dominant from page title
	pageObjectIds.dominant.id = pageObjectIds.dominant.pageTitle = document.title.replace(/(.*Wikipedia).*/i, '$1')
	pageObjectIds.dominant.type = 'PageTitle'
	pageObjectIds.ignoreListCount = false
	// enable highlights
	F1000Global.whitelistedReady = true
	setTimeout(function () {
		if (pageObjectIds.dominant.uri !== currentURI) {
			var currentURI = window.location.href
			// we had a soft redirect
			if (!pageObjectIds.libraryItemId) {
				pageObjectIds.dominant.uri = currentURI
				F1000Global.whitelistedReady = true
				F1000Global.preventAnnotationsGET = false
				F1000Global.ignoreHasAnyAnnotationsRule = true
				content_script.highlighter = false
				content_script.highlighterEnabled = false
				content_script.init()
				content_script.contentState()
				popup.update()
			}
		}
	}, 1000)
}
//
// Retractionwatch
//
F1000Global.whitelistHandlers.retractionwatch = function () {
	pageObjectIds.pageType = 'ARTICLE'
	// all identified references in list
	if (pageObjectIds.dominant.type !== 'PageTitle') pageObjectIds.list.push(pageObjectIds.dominant)
	// dominant from page title
	pageObjectIds.dominant.id = pageObjectIds.dominant.pageTitle = document.title.replace(/\-.*$/, '')
	pageObjectIds.dominant.type = 'PageTitle'
	pageObjectIds.ignoreListCount = false
	// enable highlights
	F1000Global.whitelistedReady = true
}
//
// The Conversation
//
F1000Global.whitelistHandlers.theconversation = function () {
	pageObjectIds.pageType = 'ARTICLE'
	// all identified references in list
	if (pageObjectIds.dominant.type !== 'PageTitle') pageObjectIds.list.push(pageObjectIds.dominant)
	// dominant from page title
	pageObjectIds.dominant.id = pageObjectIds.dominant.pageTitle = document.title.replace(/the\s?conversation:\s?/i, '')
	pageObjectIds.dominant.type = 'PageTitle'
	pageObjectIds.ignoreListCount = false
	// enable highlights
	F1000Global.whitelistedReady = true
}
//
// Europe PMC
//
F1000Global.whitelistHandlers.europe_pmc = function () {
	if (window.location.href.match(/\/article\//i)) pageObjectIds.list.shift()
	F1000Global.whitelistedReady = true
}
//
// gScholar
//
F1000Global.whitelistHandlers.gScholar = function () {
	var citeLinks = (function citeLinksClosure() {
		function formatAuthors(aa) {
			return aa.map(function (i) {
				var isNotValid = i.match(/editor|inventor/i)
				if (isNotValid) {
					i = false
				} else {
					var initials = i.match(/\s(\S+)$/)
					if (initials && initials[1]) {
						i = initials[1] + ' ' + i.replace(/\s\S+$/, '').trim()
					}
				}
				return i
			}).filter(function (i) { return i.trim && !!i.trim() })
		}

		function scrapeHTML_book(d) {
			try {
				var citationEls = document.querySelector('#gs_citt').querySelectorAll('.gs_citr')
				var mlaEl = citationEls[0]
				if (mlaEl) {
					var mlaRaw = mlaEl.innerHTML
					var _title = mlaRaw.match(/<i>(.*)<\/i>/)
					var _volume = mlaRaw.match(/vol\W{0,4}(\d+)/i)
					if (_title && _title[1]) {
						d.id = _title[1]
						d.pageTitle = _title[1]
					}
					if (_volume && _volume[1]) {
						d.volume = _volume[1]
						var _publisher = mlaRaw
							.substr(mlaRaw.indexOf(_volume[0]))
							.replace(_volume[0], '')
							.replace(/[,/.-\d]/g, '')
							.trim()
						if (_publisher &&
							_publisher.length &&
							_publisher.length > 3) d.publisher = _publisher
					} else {
						var _publisher = mlaRaw.match(/<\/i>\.(.*),/)
						if (_publisher && _publisher[1]) {
							d.publisher = _publisher[1].trim()
						}
					}
				}
				var apaEl = citationEls[1]
				if (apaEl) {
					var apaRaw = apaEl.innerHTML
					var _pages = apaRaw.match(/pp.?\s?([\d-]+)/)
					if (!_pages) _pages = apaRaw.match(/p.\s?(\d+)/)
					if (_pages && _pages[1]) d.pages = _pages[1]
				}
				var vancouverEl = citationEls[4]
				if (vancouverEl) {
					var vancouverRaw = vancouverEl.innerHTML
					var _authors = vancouverRaw.match(/([^.]+)./)
					if (_authors && _authors[1]) {
						d.authors = formatAuthors(_authors[1].split(','))
					}
				}
				// refine
				if (d.publisher) {
					if (d.publisher.indexOf(' IN:') !== -1) {
						var _publisherSplit = d.publisher
							.replace(',', '')
							.split(' IN:')
							.map(function (i) {
								return i.trim()
							})
						if (_publisherSplit[1] &&
							_publisherSplit[0]) {
							d.publisher = _publisherSplit[1]
							d.publicationPlace = _publisherSplit[0]
						}
					}
				}
			} catch (e) {
				// console.log('parseHTML/article error', e)
			}
			// console.log('scrapeHtml/article book', d)
			return popup.references.formatWorkspaceItem(d)
		}

		function scrapeHTML_article(d) {
			try {
				var citationEls = document.querySelector('#gs_citt').querySelectorAll('.gs_citr')
				var mlaEl = citationEls[0]
				if (mlaEl) {
					var mlaRaw = mlaEl.innerHTML
					var _title = mlaRaw.match(/\.\s?"(.*)"\s?/)
					var _journal = mlaRaw.match(/<i>(.*)<\/i>/)
					var _volume = mlaRaw.match(/<i>.*<\/i>\s+([\d\.]+)/)
					var _issue = null
					var _pages = mlaRaw.match(/([e\dS]+-[e\dS]+).?$/)
					var _date = mlaRaw.match(/\((\d{4,4})\)/)
					if (_title && _title[1]) {
						d.id = _title[1]
						d.pageTitle = _title[1]
					}
					if (_journal && _journal[1]) d.journal = _journal[1]
					if (_volume && _volume[1]) {
						var _volumeIssue = _volume[1]
						if (~_volumeIssue.indexOf('.')) {
							_volumeIssue = _volumeIssue.split('.')
							d.volume = _volumeIssue[0]
							d.issue = _volumeIssue[1]
						} else {
							d.volume = _volumeIssue
						}
					}
					if (_pages && _pages[1]) d.pages = _pages[1]
					if (_date && _date[1]) d.date = _date[1]
				}
				var apaEl = citationEls[1]
				if (apaEl) {
					var apaRaw = apaEl.innerHTML
					if (!d.pages) {
						_pages = apaRaw.match(/p.?\s?(\d+)/)
						if (_pages && _pages[1]) d.pages = _pages[1]
					}
					if (!d.volume) {
						_volume = apaRaw.match(/vol.?\s?(\d+)/i)
						if (_volume && _volume[1]) d.volume = _volume[1]
					}
					if (!d.issue) {
						_issue = apaRaw.match(/no.?\s?(\d+)/i)
						if (_issue && _issue[1]) d.issue = _issue[1]
					}
					var _patent_number = apaRaw.match(/patent no. ([^\.<]+)/i)
					if (_patent_number) {
						// void article
						d.publisher = null
						d.journal = null
						d.volume = null
						d.issue = null
						d.referenceType = 'PATENT'
						// scrape patent
						if (_patent_number[1]) d.patentNumber = _patent_number[1]
						var _patent_date = apaRaw.match(/\((\d+)\)/i)
						if (_patent_date) {
							d.date = _patent_date[1]
							d.fillingDate = _patent_date[1]
						}
						var _patent_place_issuingAuthority = apaRaw.match(/<\/i>\.?(.*):(.*)/i)
						if (_patent_place_issuingAuthority[1]) d.publicationPlace = _patent_place_issuingAuthority[1].trim()
						if (_patent_place_issuingAuthority[2]) d.issuingAuthority = _patent_place_issuingAuthority[2].trim()
					}
				}
				var vancouverEl = citationEls[4]
				if (vancouverEl) {
					var vancouverRaw = vancouverEl.innerHTML.replace('<span dir="rtl">', '')
					if (vancouverRaw.match(/\(doctoral dissertation,/i)) {
						d.pages = null
						d.referenceType = 'THESIS'
					}
					if (d.patentNumber) {
						var _inventorsAssigne = vancouverRaw.match(/(.*)inventors?;|(.*)assignees?/gi)
						var _inventors = _inventorsAssigne[0]
						var _assignees = _inventorsAssigne[1]
						if (_inventors) {
							d.authors = formatAuthors(_inventors.split(','))
						}
						if (_assignees) {
							_assignees = _assignees.replace(/assignees?/i, '')
							d.assignees = [_assignees.trim().replace(/[,;\.]$/g, '')]
						}
					} else {
						var _authors = vancouverRaw.match(/([^.]+)./)
						if (_authors && _authors[1]) {
							d.authors = formatAuthors(_authors[1].split(','))
						}
					}
				}
			} catch (e) {
				// console.log('parseHTML/article error', e)
			}
			// console.log('scrapeHtml/article', d)
			return popup.references.formatWorkspaceItem(d)
		}

		function scrapeHTML(d) {
			return d.referenceType === 'BOOK' ?
				scrapeHTML_book(d) :
				scrapeHTML_article(d)
		}

		function scrapeSelect() {
			scrapeHTML(scraped)
			scraped.saved = null
			pageObjectIds.dominant.saved = null
			F1000Global.onPopupClose = function () {
				F1000Global.onPopupClose = null
				F1000Global.referencesSingleExportId = null
				popup.update()
			}
			F1000Global.onPopupOpen = function () {
				F1000Global.onPopupOpen = null
				var input = document.querySelector('#F1000AnnotatorUI #list .reference input')
				if (input && !input.checked) {
					input.click()
				}
			}
			F1000Global.referencesSingleExportId = scrapedIndex
			popup.update()
			popup.toggle()
		}

		function onclick() {
			// F1000Global.notifications.show(true, 'Importing reference...')
			// scrapeImport()
			scrapeSelect()
		}

		function scrapeTarget(e) {
			try {
				var t = e.target || e.srcElement
				var item = F1000Global.queryElementAncestor(t, '.gs_r')
				var allGSR = Array.from(document.querySelectorAll('.gs_r'))
				var index = allGSR.findIndex(function (i) { return i === item })
				if (index === -1) {
					throw 'Index not found'
				}
				scrapedIndex = index
				scraped = pageObjectIds.list[index]
			} catch (e) {
				scrapedIndex = 0
				scraped = {}
			}
		}

		function checkOldHTML() {
			var links = document.querySelectorAll('a.gs_citi')
			var f1000Link = Array.prototype.filter.call(links, function (i) {
				return i.textContent.indexOf('Sciwheel') !== -1
			})
			return f1000Link.length !== 0
		}

		function appendF1000Link() {
			var root = (document.querySelector('a.gs_citi') || {}).parentNode
			var notReady = !root || checkOldHTML()
			if (notReady && attempsLeft) {
				attempsLeft--
				return setTimeout(function () {
					appendF1000Link()
				}, 50)
			}
			var el = document.createElement('a')
			el.href = 'javascript:'
			el.className = 'gs_citi'
			el.textContent = 'Sciwheel'
			el.onclick = onclick
			root.appendChild(el)
		}

		function reset() {
			attempsLeft = MAX_ATTEMPS
			scraped = {}
		}

		function onCiteLinkSelected(e) {
			reset()
			appendF1000Link()
			scrapeTarget(e)
		}

		function getCiteLinks() {
			var citeLinks2017 = document.querySelectorAll('a[aria-controls="gs_cit"]')
			return Array.prototype.filter.call(
				citeLinks2017,
				function (i) { return true }
			)
		}

		function listen() {
			var l = getCiteLinks()
			l.forEach(function (i) {
				i.addEventListener('mouseup', onCiteLinkSelected)
			})
		}

		var MAX_ATTEMPS = 256

		var attempsLeft = MAX_ATTEMPS
		var scrapedIndex = 0
		var scraped = {}

		return {
			listen: listen
		}
	})()

	citeLinks.listen()
}
//
// Primo Beta
//
F1000Global.whitelistHandlers.primoBeta = function () {
	function bootArticle() {
		pageObjectIds.scan(true)
		F1000Global.whitelistedReady = true
		content_script.init()
		content_script.contentState()
		popup.update()
	}

	function wait() {
		var details = document.querySelectorAll('.item-text-content > li')
		if (tries > 0) {
			if (details.length > 0) {
				bootArticle()
			} else {
				tries--
				setTimeout(wait, 500)
			}
		} else {
			bootArticle()
		}
	}

	var tries = 32
	wait()
	// console.log('whitelister/primoBeta')
}
//
// Primo Explore
//
F1000Global.whitelistHandlers.primoExplore = function () {
	var integration = {
		handlers: {
			onclick: function (e) {
				popup.toggle()
				setTimeout(function () {
					var saveBtn = document.querySelector('#F1000AnnotatorUI #saveButton')
					if (saveBtn) saveBtn.click()
				})
			}
		},
		markup: (
			['li',
				['button#f1kat-primo-integration', { $: 'click.onclick' },
					['div', { style: 'height: 24px; font-size: 24px; line-height: 21px;' }, 'S'],
					['div', { style: 'font-size: 10px; font-weight: 600; letter-spacing: .03em;' }, 'Sciwheel']
				]
			]
		),
		setup: function () {
			if (location.href.indexOf('/fulldisplay') !== -1) {
				if (document.getElementById('f1kat-primo-integration')) {
					return
				}
				var actionsContainer = document.getElementById('scrollActionList')
				var nextSibling = actionsContainer && actionsContainer.children[3]
				if (nextSibling) {
					var btn = jsonML2Dom(integration.markup, integration.handlers)
					actionsContainer.insertBefore(btn, nextSibling)
				}
			}
		}
	}

	function mergeReferences(newList, oldList) {
		// console.log('mergeReferences', newList.length, oldList.length)
		var hasReferences = newList.length !== 0
		if (hasReferences) {
			oldList.forEach(function (i, index) {
				var uri = i.uri
				var foundPos = newList.findIndex(function (a) {
					return uri === a.uri
				})
				// console.log(foundPos, uri)
				if (foundPos !== -1) {
					newList[foundPos] = i
				}
			})
		}
	}

	function updateReferences() {
		// console.log('whitelist/updateReferences')
		if (pageObjectIds.list.length !== 0) {
			lastReferencesList = JSON.stringify(pageObjectIds.list)
		}
		pageObjectIds.scan(true)
		if (lastMode === 'search') {
			if (pageObjectIds.list.length !== 0 &&
				lastReferencesList) {
				mergeReferences(pageObjectIds.list, JSON.parse(lastReferencesList))
			}
		}
	}

	function resetup() {
		isPending = true
		observer.disconnect()
		updateReferences()
		var dominant = pageObjectIds.dominant
		var lastDominant = JSON.parse(lastDominantClone)
		if (dominant.id !== lastDominant.id) {
			// console.log('whitelist/dominant change')
			lastDominantClone = JSON.stringify(pageObjectIds.dominant)
			F1000Global.preventAnnotationsGET = false
			F1000Global.ignoreHasAnyAnnotationsRule = true
			content_script.highlighter = false
			content_script.highlighterEnabled = false
			content_script.init()
		}
		content_script.contentState()
		popup.update()
		observerTarget && observer.observe(observerTarget, observerOptions)
		isPending = false
	}

	function lastListener() {
		if (watcher) clearTimeout(watcher)
		watcher = setTimeout(function () {
			watcher = null
			// console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
			resetup()
		}, 800)
	}

	var isPending = false
	var watcher = null
	var observer = new MutationObserver(lastListener)
	var observerOptions = { childList: true }
	var observerTarget
	var lastUrl = null
	var lastDominantClone = JSON.stringify({ id: 'boot' })
	var lastMode = null
	var lastReferencesList = null

	function setupObserver() {
		// console.log('setupObserver', isPending)
		if (isPending) return
		var url = location.pathname || location.href
		var isDetail = url.indexOf('/fulldisplay') !== -1
		var hasChangedDetail = isDetail && url !== lastUrl
		var isSearch = url.indexOf('/search') !== -1
		var mode = isSearch ? 'search' : isDetail ? 'detail' : null
		if (isSearch ||
			isDetail) {
			if (mode !== lastMode ||
				hasChangedDetail ||
				!observerTarget ||
				!document.body.contains(observerTarget)) {
				observer.disconnect()
				if (isSearch) {
					observerTarget = document.querySelector('prm-search-result-list .results-container')
				} else {
					var fullViewContainer = document.querySelector('prm-full-view')
					observerTarget = (
						fullViewContainer ?
							fullViewContainer :
							document
					).querySelector('.result-item-text')
				}
				if (observerTarget) {
					// console.log(mode, observerTarget)
					observer.observe(observerTarget, observerOptions)
					lastListener()
				}
			}
		} else {
			if (lastUrl !== url) {
				lastListener()
			}
		}
		lastUrl = url
		lastMode = mode
	}

	// breathe and setup
	setTimeout(function () {
		setInterval(setupObserver, 1600)
	}, 1600)
	// try to attach straight away for detail pages
	setInterval(integration.setup, 800)
	// ie will not do this on its own :)
	window.addEventListener('unload', function () { observer.disconnect() })
}
//
// Academic Microsoft 2018
//
F1000Global.whitelistHandlers.academicMicrosoft2018 = function () {
	function resetup() {
		observer.disconnect()
		F1000Global.preventAnnotationsGET = false
		F1000Global.ignoreHasAnyAnnotationsRule = true
		pageObjectIds.libraryItemId = null
		pageObjectIds.scan(true)
		state.pageObjectIds = pageObjectIds
		state.references.showCitedArticles = false
		content_script.highlighter = false
		content_script.highlighterEnabled = false
		content_script.init()
		content_script.contentState()
		popup.update()
		observerTarget && observer.observe(observerTarget, observerOptions)
	}

	function isValidMutation() {
		var nextURLState = location.href
		if (lastURLState !== nextURLState) {
			lastURLState = nextURLState
			return true
		}
	}

	function lastListener(mutations) {
		if (isValidMutation()) {
			if (watcher) clearTimeout(watcher)
			watcher = setTimeout(function () {
				watcher = null
				resetup()
			}, 2000)
		}
	}

	F1000Global.whitelistedReady = true

	var lastURLState = ''
	var watcher = null
	var observer = new MutationObserver(lastListener)
	var observerTarget = document.body
	var observerOptions = { childList: true, subtree: true }
	observer.observe(observerTarget, observerOptions)
}
//
// <anything>.apa.org
//
F1000Global.whitelistHandlers.apaOrg = function () {
	function dominantOverride(pageObjectIds) {
		if (pageObjectIds.pageType === 'ARTICLE') {
			var titleEl = document.querySelector('.record-details h1') ||
				document.querySelector('.title a')
			if (titleEl) {
				pageObjectIds.dominant.pageTitle = titleEl.textContent.trim()
			}
			var abstractEl = document.querySelector('.abstract p')
			if (abstractEl) {
				pageObjectIds.dominant.articleAbstract = abstractEl.textContent.trim()
			}
		}
	}

	function resetup() {
		observer.disconnect()
		F1000Global.preventAnnotationsGET = false
		F1000Global.ignoreHasAnyAnnotationsRule = true
		pageObjectIds.libraryItemId = null
		pageObjectIds.scan(true)
		dominantOverride(pageObjectIds)
		state.pageObjectIds = pageObjectIds
		state.references.showCitedArticles = false
		content_script.highlighter = false
		content_script.highlighterEnabled = false
		console.log(pageObjectIds.pageType)
		content_script.init()
		content_script.contentState()
		popup.update()
		observerTarget && observer.observe(observerTarget, observerOptions)
	}

	function isValidMutation() {
		var nextURLState = location.href
		if (lastURLState !== nextURLState) {
			lastURLState = nextURLState
			return true
		}
	}

	function lastListener(mutations) {
		if (isValidMutation()) {
			if (watcher) clearTimeout(watcher)
			watcher = setTimeout(function () {
				watcher = null
				resetup()
			}, 2000)
		}
	}

	F1000Global.whitelistedReady = true

	var lastURLState = ''
	var watcher = null
	var observer = new MutationObserver(lastListener)
	var observerTarget = document.body
	var observerOptions = { childList: true, subtree: true }
	observer.observe(observerTarget, observerOptions)
}
//
// Cell.com
//
F1000Global.whitelistHandlers.cell_com = function () {
	function updateReferences() {
		pageObjectIds.scan(true)
		if (pageObjectIds.list.length !== 0) popup.update()
	}

	function getAnnotationsPresent() {
		var annotationsPresent = []
		var hls = document.querySelectorAll('.f1kat-hl')
			;[].forEach.call(hls, function (i) {
				var id = i.dataset ? i.dataset['f1kat_hl_id'] : null
				if (annotationsPresent.indexOf(id) === -1) annotationsPresent.push(id)
			})
		return annotationsPresent
	}

	function getAnnotationsMissing() {
		var annotations = f1kat.hl.annotations.all
		var annotationsPresent = getAnnotationsPresent()
		var annotationsMissing = []
		for (var i = 0; i < annotations.length; i++) {
			if (annotationsPresent.indexOf(annotations[i].id) === -1) {
				annotationsMissing.push(annotations[i])
			}
		}
		return annotationsMissing
	}

	function safetyResetup() {
		var annotationsLength = f1kat.hl.annotations.all.length
		if (annotationsLength > 0) {
			var resetupThreshold = annotationsLength / 2
			var annotationsPresent = getAnnotationsPresent()
			if (annotationsPresent.length < resetupThreshold) {
				resetup()
			}
		}
	}

	function resetup() {
		observer.disconnect()
		var annotationsMissing = getAnnotationsMissing()
		if (annotationsMissing.length > 0) {
			f1kat.hl.setupAnnotations(annotationsMissing)
		}
		// cited articles
		if (window.location.href.match(/references/i) && pageObjectIds.list.length === 0) {
			setTimeout(updateReferences, 1000)
		}
		// keeps listening
		observer.observe(observerTarget, observerOptions)
	}

	function lastListener(mutations) {
		if (watcher) clearTimeout(watcher)
		watcher = setTimeout(function () {
			var isWorth = window.lastURLState != window.history.state
			if (isWorth) {
				if (isFirstMutation) {
					// we avoid tracking first mutation as they are doing something dirty
					isFirstMutation = false
				} else {
					window.lastURLState = window.history.state
				}
				watcher = null
				// console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
				resetup()
			}
		}, 500)
	}

	var isFirstMutation = true
	window.lastURLState = null
	F1000Global.whitelistedReady = true
	// used by single quote rescan
	f1kat.hl.fuzzyMatchAmbiguityCheckEnabled = false
	var watcher = null
	var observer = new MutationObserver(lastListener)
	var observerTarget = document.body
	var observerOptions = { childList: true, subtree: true }
	observer.observe(observerTarget, observerOptions)
	// force a couple of safer resetups for slow connections
	setTimeout(safetyResetup, 5000)
	setTimeout(safetyResetup, 10000)
	setTimeout(safetyResetup, 20000)
	setTimeout(safetyResetup, 40000)
	setTimeout(safetyResetup, 80000)
	// ie will not do this on its own :)
	window.addEventListener('unload', function () { observer.disconnect() })
	// Done
	// console.log('F1000 Annotator: WHITELIST: BOOT: Applied whitelist rules for cell.com')
}
//
// Embopress, XN a semi-generic handler could accept flags and options
//
F1000Global.whitelistHandlers.embopress = F1000Global.whitelistHandlers.cell_com
//
// Sciencedirect.com
//
F1000Global.whitelistHandlers.sciencedirect_com = function () {
	// blacklisted when on institution login page
	if (window.location.href.indexOf('/externallogin') !== -1) {
		F1000Global.blacklisted = true
		popup.update()
		return;
	}

	// pageObjectIds.dominant.articleAbstract
	function extractAbstract() {
		if (window.location.href.indexOf('/article/') !== -1) {
			// force article detection
			if (pageObjectIds.dominant) {
				pageObjectIds.pageType = "ARTICLE"
				// FCORE-12698 In Science direct we sometimes mark it as 'Lower Body'
				pageObjectIds.dominant.matchType = null
			}
			// abstract generic scraping
			var articleAbstract = [];
			var abstractLabel = [].filter.call(document.querySelectorAll('h2'), function (i) {
				return i.textContent && i.textContent.match(/^Abstract|^Summary/i)
			})
			if (abstractLabel[0] && abstractLabel[0].nextSibling) {
				abstractLabel.forEach(function (i) {
					var abstractP = i
					while (abstractP = abstractP.nextSibling) {
						if (abstractP.textContent) {
							if (abstractP.children &&
								abstractP.children.length > 1) {
								// indented sections
								articleAbstract = articleAbstract.concat(
									Array.prototype.map.call(abstractP.children, function (i) {
										return '' + i.textContent
									})
								)
							} else {
								// just text
								articleAbstract.push(abstractP.textContent)
							}
						}
					}
				})
				articleAbstract = articleAbstract.join('\n\n')
			}
			if (articleAbstract.length === 0) {
				// abstract class based scraping
				articleAbstract = Array.prototype.map.call(
					document.querySelectorAll('.abstract'),
					function (i) {
						if (~i.className.indexOf('graphical')) {
							return ''
						} else {
							return i.textContent
						}
					}
				).join('\n\n').replace(/^\s{0,}abstract\s{0,}|^\s{0,}summary\s{0,}/i, '')
			}
			pageObjectIds.dominant.articleAbstract = articleAbstract.length !== 0 ? articleAbstract : null
			// console.log('abstract:\n', pageObjectIds.dominant.articleAbstract)
		}
	}
	extractAbstract()

	// pageObjectIds.dominant.keywords
	function cleanKeywords() {
		var sectionTitles = document.querySelectorAll('.keywords-section h2')
		if (sectionTitles && sectionTitles.length > 0) {
			var keywordsSections = Array.prototype.filter.call(sectionTitles, function (i) {
				return !/abbreviation/i.test(i.textContent)
			})
			if (keywordsSections) {
				var keywords = []
				Array.prototype.forEach.call(keywordsSections, function (i) {
					var els = i.parentNode.querySelectorAll('.keyword')
					if (els && els.length > 0) {
						Array.prototype.forEach.call(els, function (i) {
							if (i.textContent) keywords.push(i.textContent)
						})
					}
				})
				if (keywords && keywords.length > 0) {
					pageObjectIds.dominant.keywords = keywords.join(', ')
				} else {
					pageObjectIds.dominant.keywords = null
				}
			}
		}
	}
	cleanKeywords()

	// Overrides
	f1kat.hl.scrollBackup = function (restore) {
		if (restore) {
			setTimeout(function () {
				document.documentElement.scrollLeft = document.body.scrollLeft = restore.x
				document.documentElement.scrollTop = document.body.scrollTop = restore.y
			}, 0)
		} else {
			var x = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft
			var y = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
			return { x: x, y: y }
		}
	}

	// Lazy Handler
	function updateReferences() {
		if (pageObjectIds.list[0] && pageObjectIds.list[0].resolved) return;
		pageObjectIds.scan(true)
		extractAbstract()
		cleanKeywords()
		if (pageObjectIds.list.length !== referencesCount) {
			referencesCount = pageObjectIds.list.length
			popup.update()
		}
	}

	function getAnnotationsPresent() {
		var annotationsPresent = []
		var hls = document.querySelectorAll('.f1kat-hl')
			;[].forEach.call(hls, function (i) {
				var id = i.dataset ? i.dataset['f1kat_hl_id'] : null
				if (annotationsPresent.indexOf(id) === -1) annotationsPresent.push(id)
			})
		return annotationsPresent
	}

	function resetup() {
		observer.disconnect()
		// annotations
		var annotations = f1kat.hl.annotations.all
		var annotationsPresent = getAnnotationsPresent()
		var annotationsMissing = []
		for (var i = 0; i < annotations.length; i++) {
			if (annotationsPresent.indexOf(annotations[i].id) === -1) {
				annotationsMissing.push(annotations[i])
			}
		}
		f1kat.hl.setupAnnotations(annotationsMissing)
		// cited articles
		if (referencesWatcher) clearTimeout(referencesWatcher)
		referencesWatcher = setTimeout(function () {
			referencesWatcher = null
			updateReferences()
		}, 1000)
		// keeps listening till there can be something or we still miss a /find libraryItemId
		var awaitingBibliography =
			pageObjectIds.pageType === "ARTICLE" &&
			!document.querySelector('.bibliography')
		if (getAnnotationsPresent().length !== annotations.length ||
			!pageObjectIds.libraryItemId ||
			awaitingBibliography) {
			observer.observe(observerTarget, observerOptions)
		}
	}

	function lastListener() {
		if (!content_script.highlighter) return;
		if (!document.getSelection().isCollapsed) {
			// Prevents the rescan to be fired on first time annotator is called.
			return setTimeout(lastListener, 2000);
		}
		if (watcher) clearTimeout(watcher)
		watcher = setTimeout(function () {
			// instead rely on the number of childs in the article?
			var chunkCountUpdate = useChunkCount ? chunksHolder.children.length : 0
			var outdated = useChunkCount ? chunksCount != chunkCountUpdate : lastTextContentLength != document.body.textContent.length
			if (outdated) {
				chunksCount = chunkCountUpdate
				lastTextContentLength = document.body.textContent.length
				watcher = null
				//console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
				resetup()
			}
		}, 400)
	}

	var lastTextContentLength = document.body.textContent.length
	var useChunkCount = false
	var chunksHolder = document.getElementById('centerInner')
	var chunksCount = 0
	if (chunksHolder && chunksHolder.children) {
		chunksCount = chunksHolder.children.length
		useChunkCount = true
	}

	F1000Global.whitelistedReady = true

	var referencesCount = 0
	var referencesWatcher = null

	var watcher = null
	var observer = new MutationObserver(lastListener)
	var observerTarget = document.body
	var observerOptions = { childList: true, subtree: true }
	observer.observe(observerTarget, observerOptions)
	// ie will not do this on its own :)
	window.addEventListener('unload', function () { observer.disconnect() })
	// Done
	//console.log('F1000 Annotator: WHITELIST: BOOT: Applied whitelist rules for sciencedirect.com')
}
//
// PNAS Lens
//
F1000Global.whitelistHandlers.lens = function () {
	if (pageObjectIds.dominant && pageObjectIds.dominant.type !== 'PageTitle') {
		if (document.querySelectorAll('.content-node').length > 0) {
			f1kat.hl.scrollBackup = function (restore) {
				var el = document.querySelector('.surface.resource-view.content')
				if (el) {
					if (!restore) return { x: el.scrollLeft, y: el.scrollTop };
					el.scrollLeft = restore.x
					el.scrollTop = restore.y
				}
			}
			content_script.highlighter = false
			F1000Global.whitelistedReady = true
			F1000Global.preventAnnotationsGET = false
			content_script.init()
		} else {
			setTimeout(F1000Global.whitelistHandlers.lens, 1000)
		}
		return
	} else {
		pageObjectIds.scan(true)
		setTimeout(F1000Global.whitelistHandlers.lens, 1000)
		return
	}
}
//
// Scopus Article
//
F1000Global.whitelistHandlers.scopus_article = function () {
	// console.log('whitelist/scopus-article')
	function run() {
		attemps--
		referencesEl = document.querySelector('.referenceLists') ||
			document.querySelector('#referenceList')
		if (attemps > 0 && !referencesEl) {
			setTimeout(run, 300)
			return
		} else {
			if (!document.querySelector('section#referenceInfo')) {
				// trust basic pageScan
				state.preventInteractionLayerActive = false
				pageObjectIds.scan(true, 'textContent')
				popup.update()
				content_script.init()
				content_script.pageInfosCacheSet()
				var title = pageObjectIds.dominant.pageTitleEscaped && pageObjectIds.dominant.pageTitle
				var cleanTitle = title.replace(/^Scopus - Document details\W+/i, '')
				pageObjectIds.dominant.pageTitle = cleanTitle
				pageObjectIds.dominant.pageTitleEscaped = cleanTitle
				return
			}
		}
		state.preventInteractionLayerActive = false
		var isScopus2017 = document.querySelector('section#referenceInfo')
		if (isScopus2017) {
			F1000Global.whitelistedReady = true
			pageObjectIds.scan(true, 'textContent')
			pageObjectIds.pageType = 'ARTICLE'
			var titleEl = document.querySelector('#profileleftinside h2') ||
				document.querySelector('h2.h3')
			if (titleEl && titleEl.textContent) {
				titleEl = titleEl.textContent.replace(/\(article\)/i, '')
				pageObjectIds.dominant.title = titleEl
				pageObjectIds.dominant.pageTitle = titleEl
			}
		} else {
			F1000Global.whitelistedReady = true
			pageObjectIds.scan(true)
			if (pageObjectIds.list.length > 0) {
				pageObjectIds.dominant = pageObjectIds.list[0]
				pageObjectIds.pageType = 'ARTICLE'
				pageObjectIds.list.splice(0, 1)
			}
			var titleEl = document.querySelector('.txtTitle')
			if (titleEl && titleEl.childNodes && titleEl.childNodes[0]) {
				titleEl = titleEl.childNodes[0].textContent
				pageObjectIds.dominant.title = titleEl
				pageObjectIds.dominant.pageTitle = titleEl
			}
		}
		popup.update()
		content_script.init()
		content_script.pageInfosCacheSet()
	}
	var referencesEl = null
	var attemps = 24
	state.preventInteractionLayerActive = true
	run()
}
//
// hdasNice Article and Search
//
F1000Global.whitelistHandlers.hdasNice = function () {
	function bootArticle() {
		// console.log('article')
		F1000Global.whitelistedReady = true
	}

	function bootSearch() {
		function getActiveTab() {
			return document.querySelector('.tab-pane.active')
		}

		function resetup() {
			var tab = getActiveTab()
			pageObjectIds.scan(true, { isSearch: true, root: tab })
			content_script.contentState()
			popup.update()
		}

		function lastListener(mutations) {
			// console.log('lastListener', mutations, mutations.length)
			if (watcher) clearTimeout(watcher)
			watcher = setTimeout(function () {
				var activeTab = getActiveTab()
				if (currentActiveTab !== activeTab) {
					currentActiveTab = activeTab
					watcher = null
					// console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
					resetup()
				}
			}, 2500)
		}

		F1000Global.whitelistedReady = true

		var currentActiveTab = getActiveTab()
		var watcher = null
		var observer = new MutationObserver(lastListener.bind(this))
		var observerTarget = document.body
		var observerOptions = { childList: true, subtree: true }
		observer.observe(observerTarget, observerOptions)
		// ie will not do this on its own :)
		window.addEventListener('unload', function () { observer.disconnect() })

		resetup()
	}

	var isSearch = document.querySelector('#search-results-container')
	if (isSearch) {
		bootSearch()
	} else {
		bootArticle()
	}
}
//
// ovid Article and Search
//
F1000Global.whitelistHandlers.ovid = function () {
	function bootArticle() {
		// console.log('article')
		var titleEl = document.querySelector('title_link_here')
		if (titleEl) {
			var title = titleEl.textContent.trim()
			pageObjectIds.dominant.pageTitle = title.replace(/\[.*\]/g, '').trim().replace(/\.$/, '')
		}
		pageObjectIds.dominant.matchType = null
		pageObjectIds.list = []
		F1000Global.whitelistedReady = true
	}

	function bootSearch() {
		function resetup() {
			// var tab = getActiveTab()
			pageObjectIds.scan(true)
			content_script.contentState()
			popup.update()
		}

		function lastListener(mutations) {
			// console.log('lastListener', mutations, mutations.length)
			if (mutations.length < 5) return
			if (watcher) clearTimeout(watcher)
			watcher = setTimeout(function () {
				watcher = null
				// console.log('F1000 Annotator: WHITELIST: STATE CHANGED: Resetup now.')
				resetup()
			}, 2000)
		}

		F1000Global.whitelistedReady = true

		var mainEl = document.querySelector('#main-content')
		var watcher = null
		var observer = new MutationObserver(lastListener.bind(this))
		var observerTarget = mainEl
		var observerOptions = { childList: true, subtree: true }
		observer.observe(observerTarget, observerOptions)
		// ie will not do this on its own :)
		window.addEventListener('unload', function () { observer.disconnect() })

		resetup()
	}

	var isSearch = document.title.search(/search\sform/i) !== -1
	if (isSearch) {
		bootSearch()
	} else {
		bootArticle()
	}
}
//
// ovid Article and Search
//
F1000Global.whitelistHandlers.acl = function () {
	F1000Global.whitelistedReady = true

	function scrapeDOI() {
		var doiEl = document.querySelector('a.issue-item__doi')
		if (doiEl) {
			var raw = doiEl.href
			if (raw) {
				var doiMatch = raw.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
				if (doiMatch) {
					var doi = doiMatch[0]
					pageObjectIds.dominant.id = doi
					pageObjectIds.dominant.type = 'DigitalObjectId'
				}
			}
		}
	}

	var scrapeAbstract_safeGuard = 16
	function scrapeAbstract() {
		var found = false
		if (pageObjectIds.pageType === 'ARTICLE') {
			var abstractEl = document.body.querySelector('#abstract-body') ||
				document.body.querySelector('.flatbody p') ||
				document.body.querySelector('.abstractSection p')
			if (abstractEl) {
				if (abstractEl.textContent.length > 16) {
					found = true
					pageObjectIds.dominant.articleAbstract = abstractEl.textContent.trim()
				}
			}
			if (!found && scrapeAbstract_safeGuard > 0) {
				scrapeAbstract_safeGuard--
				setTimeout(scrapeAbstract, 500)
			}
		}
	}

	scrapeDOI()
	scrapeAbstract()
}
//
// Wiley
//
F1000Global.whitelistHandlers.wiley = function () {
	pageObjectIds.cleanDeep = true
	pageObjectIds.scan(true)
	if (window.location.href.indexOf('/abstract') !== -1) {
		pageObjectIds.list = []
		pageObjectIds.pageType = 'ARTICLE'
	}
	if (window.location.href.indexOf('/issuetoc') !== -1) {
		pageObjectIds.pageType = 'REFERENCES'
		pageObjectIds.ignoreListCount = false
		F1000Global.blacklistedHighlighter = true
	}
	if (window.location.href.indexOf('/journal') !== -1) {
		pageObjectIds.pageType = 'REFERENCES'
		pageObjectIds.ignoreListCount = false
		F1000Global.blacklistedHighlighter = true
	}
	F1000Global.whitelistedReady = true
}
//
// Wiley [e]PDF
//
F1000Global.whitelistHandlers.wileyPDF = function () {
	// unsupported
	if (detectBrowser().browser === 'edge') {
		F1000Global.whitelistHandlers.justBlacklist()
		return
	}

	// ie spacer
	var spacer = document.createElement('div')
	spacer.style.height = '0px'
	spacer.style.transition = 'height .25s ease-out'
	document.body.insertBefore(spacer, document.body.firstChild)

	popup.toggleHook = function () {
		var shall = detectBrowser().browser === 'ie'
		if (shall) {
			if (popup.display) {
				document.body.style.overflow = 'hidden'
				spacer.style.height = '300px'
			} else {
				setTimeout(function () {
					document.body.style.overflow = 'auto'
				}, 300)
				spacer.style.height = '0px'
			}
		}
	}

	if (window.location.pathname.indexOf('/epdf') !== -1) {
		if (
			document.querySelector('meta[name="PDF_URL"]') ||
			document.getElementById('epub-reader-container') ||
			document.querySelector('#viewer.pdfViewer')
		) {
			pageObjectIds.list = []
			var explicitDOI = (
				document.querySelector('meta[name="DOI"]') ||
				document.querySelector('meta[name="doi"]') ||
				{}
			).content
			if (typeof explicitDOI === 'string' &&
				explicitDOI.length > 3) {
				pageObjectIds.dominant.id = explicitDOI
			}
			content_script.pageInfosCacheSet()
			var pdfGUID = null
			if (document.querySelector('meta[name="PDF_URL"]')) {
				var pdfGUID = document.querySelector('meta[name="PDF_URL"]').content
			} else {
				pdfGUID = location.href.replace('epdf', 'pdf')
			}
			if (pdfGUID) {
				handlers.save2.save = function (e) {
					// set a pending import based on the /pdf url
					var f1katPdfImportPendingList = localStorage.f1katPdfImportPendingList ? JSON.parse(localStorage.f1katPdfImportPendingList) : [];
					if (f1katPdfImportPendingList.indexOf(pdfGUID) === -1) f1katPdfImportPendingList.push(pdfGUID)
					localStorage.f1katPdfImportPendingList = stringify(f1katPdfImportPendingList)
					// redirects to the /pdf url
					location = pdfGUID
				}
			}
			popup.showWelcomeBalloon('browserPDF')
		}
	} else if (
		(window.location.pathname.indexOf('/pdf') !== -1 && document.getElementById('pdfDocument')) ||
		(window.location.pathname.indexOf('/pdf') !== -1 && document.getElementById('pdf-iframe')) ||
		(window.location.pathname.indexOf('.pdf') !== -1 && document.getElementsByTagName('embed').length > 0)
	) {
		pageObjectIds.list = []
		var $pdfDocument = document.getElementById('pdfDocument') || document.getElementById('pdf-iframe')
		var $embed = document.querySelector('embed')
		var uri
		if ($pdfDocument) {
			uri = $pdfDocument.src
		} else if ($embed) {
			uri = $embed.src
		}
		if (!uri) return
		pageObjectIds.dominant.uri = uri
		// check pending imports from an /ePDF url
		var f1katPdfImportPendingList = localStorage.f1katPdfImportPendingList ? JSON.parse(localStorage.f1katPdfImportPendingList) : [];
		var pdfGUID = location.pathname
		pdfGUID = pdfGUID.match(/\/10\..+?\/.*?\/?/)
		pdfGUID = pdfGUID && pdfGUID[0] ? pdfGUID : false
		var pdfPending = -1
		if (pdfGUID) {
			for (var g = 0; g < f1katPdfImportPendingList.length; g++) {
				if (f1katPdfImportPendingList[g].indexOf(pdfGUID) !== -1) {
					pdfPending = g
					break;
				}
			}
		}
		if (pdfPending !== -1) {
			f1katPdfImportPendingList.splice(pdfPending, 1)
			localStorage.f1katPdfImportPendingList = stringify(f1katPdfImportPendingList)
			// trigger pending import, just after session & boot flow completes
			setTimeout(function () {
				if (DA4pdf && !DA.ready) DA.pendingSave2Save = true
				// For all
				popup.toggle()
				handlers.save2.save()
			}, 10)
		} else {
			popup.showWelcomeBalloon('browserPDF')
		}
	}
}
//
// ElsevierReader (PDF)
//
F1000Global.whitelistHandlers.elsevierReader = function () {
	// unsupported
	if (detectBrowser().browser === 'edge') {
		F1000Global.whitelistHandlers.justBlacklist()
		return
	}

	var link = document.querySelector('.download-pdf-link')
	if (link && link.href) {
		pageObjectIds.dominant.uri = link.href
		pageObjectIds.dominant.alternatePDF = null
	} else if (pageObjectIds.dominant.alternatePDF) {
		pageObjectIds.dominant.uri = pageObjectIds.dominant.alternatePDF
		pageObjectIds.dominant.alternatePDF = null
	}
}
//
// emberPreprint
//
F1000Global.whitelistHandlers.emberPreprint = function () {
	function bootArticle() {
		// console.log('whitelister/emberPreprint/bootArticle')
		pageObjectIds.scan(true)
		F1000Global.whitelistedReady = true
		content_script.init()
		content_script.contentState()
		popup.update()
	}

	function bootReferences() {
		// console.log('whitelister/emberPreprint/bootSearch')
		var domain = 'emberPreprintSearch'
		var scanner = F1000Global.pageObjectIdsHandlers['htmlContentScanner_' + domain]
		scanner.domain = domain
		pageObjectIds = scanner
		F1000Global.whitelistHandlers.genericSinglePageSearch()
	}

	function wait() {
		if (document.querySelector('#view-page.container')) {
			bootArticle()
		} else if (document.querySelector('.search-results-section')) {
			bootReferences()
		} else if (document.getElementById('searchBox')) {
			bootReferences()
		} else if (tries > 0) {
			tries--
			setTimeout(wait, 1000)
		}
	}

	var tries = 32
	wait()
	// console.log('whitelister/emberPreprint')
}
//
// frameset PDF
//
F1000Global.whitelistHandlers.framesetPDF = function () {
	// collect the pdf hint that triggered the whitelister
	var headPDFHint = top.document.head.querySelector('[name*="pdf"]')
	pageObjectIds.list = []
	pageObjectIds.dominant.uri = headPDFHint.content
	popup.showWelcomeBalloon('browserPDF')
}
//
// F1000 PDF Viewer Legacy
// @param {version Number} the view version detected at boot time, affects caches.
//
// NOTE: This code is supposed to be frozen in support for pdf-legacy viewer,
// see below for latest viewer whitelister.
//
F1000Global.whitelistHandlers.F1000_PDF_Viewer_Legacy = function (version) {
	// ALL THINGS CACHES
	// WhitelistedSignature is used to invalidate paths cache when viewer version changes <integer>,
	// MUST BE INCREASED if html content before or containing quotes changes in any way that affects the xPaths.
	// Original paths will be invalidated automatically when cache is not found or invalid,
	// allowing a full rescan: see f1kat.hl.setupAnnotations and f1kat.hl.pathsCache.instantiate.
	//
	// WE ARE HARD CODING IT - WE FEAR FALSE POSITIVES IF WE ACTIVATE RESCAN IN SAME DOMAIN
	//
	F1000Global.whitelistedSignature = 1 //+version
	//console.log(F1000Global.whitelistedSignature, typeof F1000Global.whitelistedSignature)
	// enable pageInfos and pathsCache caches
	F1000Global.whitelistedPathsCacheOn = true
	F1000Global.whitelistedPagesInfoCacheOn = true
	// remember to remove that newapi thing from the uri!
	var cacheDomain = location.pathname.replace(/.*:|\W/g, '').replace('newapi', '')
	F1000Global.whitelistedPathsCacheDomain = F1000Global.whitelistedPagesInfoCacheDomain = cacheDomain
	// Set global regexp for pages matching
	// NOTE: be careful when html changes, this gets applied as faster choice for
	// inSameDomain notes, so if changed the new one should not give false positives on
	// old xPaths instead of null.
	// On f1k-invalidated paths from pathsCache invalidation it will just fail which is wanted.
	pagesInfo.getPagesByXPathRange_regExp = /\/div\[1\]\/div\[2\]\/div\[4\]\/div\[1\]\/div\[(\d+)/i

	// Mobile
	function setBodyHeight() {
		document.body.style.height = window.innerHeight + 'px'
	}
	if (false) {
		// webview fix https://github.com/mozilla/pdf.js/issues/7157
		window.addEventListener("resize", function () {
			setTimeout(setBodyHeight, 0)
		})
		setBodyHeight()
		/* NOTE: Mobile consistency logs, MUST pass both Android and iOS
		console.log('F1000Global.whitelistedPathsCacheDomain')
		console.log(F1000Global.whitelistedPathsCacheDomain)
		console.log('F1000Global.whitelistedPagesInfoCacheDomain')
		console.log(F1000Global.whitelistedPagesInfoCacheDomain)
		console.log('pagesInfo.getPagesByXPathRange_regExp')
		console.log(pagesInfo.getPagesByXPathRange_regExp + '')
		var executed = pagesInfo.getPagesByXPathRange_regExp.exec('html/body/div[1]/div[2]/div[4]/div[1]/div[1]/div[2]')
		console.log('executed should be: ["/div[1]/div[2]/div[4]/div[1]/div[1", "1"]')
		console.log(executed[0], executed[1])
		//*/
	}

	// Highlighter Target
	f1kat.highlighterTarget = document.querySelector('#viewerContainer')

	// Overrides
	content_script.session.highlighterPreference = true
	// this will be picked up in content_script.closeHighlighterEditor to restore the caret in the custom find
	f1kat.caretBackupActive = true
	// this will be picked up in content_script.init
	F1000Global.useRelativeURI = true
	// this will be used by ie selectionScan and helpers/selectText
	F1000Global.partialsFindThreshold = 1
	// XN if we want to improve rescan this can be allowed accordingly
	f1kat.hl.allowFullQuoteMatch = false
	// shoeNotes 404 message before content is received
	var message404_default = state.showNotes.message404
	state.showNotes.message404 = 'Full content is still loading, please wait a moment then retry.',

		// Polyfills
		F1000Global.whitelistHandlers.polyfill_CustomEvent()

	f1kat.hl.scrollBackup = function (restore) {
		var el = document.getElementById('viewerContainer')
		if (el) {
			if (!restore) return { x: el.scrollLeft, y: el.scrollTop };
			el.scrollLeft = restore.x
			el.scrollTop = restore.y
		}
	}

	// Helpers
	f1kat.hl.getRangeImagesSrc2Id = {}
	f1kat.hl.getRangeImages = function (r) {
		return []
	}

	F1000Global.whitelistedAnnotationSaved = function (annotation, requestType) {
		window.postMessage({ annotationsUpdate: requestType }, '*')
	}

	// Force page id infos to the source library item
	var LibraryItemId = document.head.querySelector('meta[name="F1000-LibraryItemId"]').content
	pageObjectIds.dominant.id = LibraryItemId
	pageObjectIds.dominant.type = "LibraryItemId"
	pageObjectIds.libraryItemId = LibraryItemId
	pageObjectIds.list = []

	// Handles lazy page rendering
	function getLoadedPages() {
		var pages = []
		var loaded = document.querySelectorAll('[data-loaded="true"]')
			;[].forEach.call(loaded, function (p) {
				var pageNumber = parseInt(p.dataset.pageNumber)
				if (pageNumber) pages.push(pageNumber)
			})
		return pages
	}

	function getAnnotationsMissing(annotations) {
		var annotationsPresent = []
		var annotationsMissing = []
		if (annotations.length > 0) {
			var hls = document.querySelectorAll('.f1kat-hl')
				;[].forEach.call(hls, function (i) {
					var id = i.dataset ? i.dataset['f1kat_hl_id'] : null
					if (annotationsPresent.indexOf(id) === -1) annotationsPresent.push(id)
				})
			for (var i = 0; i < annotations.length; i++) {
				var annotation = annotations[i]
				if (annotationsPresent.indexOf(annotation.id) === -1) annotationsMissing.push(annotation)
			}
		}
		// console.log('annotations present', annotationsPresent)
		// console.log('annotations missing', annotationsMissing)
		return annotationsMissing
	}

	function getAnnotationsInLoadedPages(loadedPages) {
		var loadedPages = loadedPages || getLoadedPages()
		//console.log('data-loaded pages', loadedPages)
		var annotations = f1kat.hl.annotations.all.filter(function (a) {
			//console.log('checking pages for', a.id)
			if (a.pagesInfo) {
				var inLoadedPages = loadedPages.indexOf(a.pagesInfo.start) !== -1 &&
					loadedPages.indexOf(a.pagesInfo.end) !== -1
				return inLoadedPages
			} else {
				// if still has not pagesInfo we need to give it a try
				return true
			}
		})

		return annotations
	}

	function resetup() {
		document.removeEventListener(pagerendered, whitelistedReadyListener, false)
		// console.log('\n\nPAGE UPDATE: resetup')
		// console.log('annotations.all.length', f1kat.hl.annotations.all.length)
		var annotations = getAnnotationsInLoadedPages()
		// console.log('data-loaded pages annotations', annotations.length, annotations)
		var annotationsMissing = getAnnotationsMissing(annotations)
		if (annotationsMissing.length > 0) {
			f1kat.hl.setupAnnotations(annotationsMissing, function () {
				document.dispatchEvent(new CustomEvent('setupAnnotationsDone'))
			})
		}
		// getAnnotationsMissing(annotations)
		document.addEventListener(pagerendered, whitelistedReadyListener, false)
	}

	var watcher = null
	function whitelistedReadyListener(e) {
		//console.log('whitelistedReadyListener')
		//console.log('whitelistedSuspended', F1000Global.whitelistedSuspended)
		// while scrolling or so
		if (F1000Global.whitelistedSuspended) return
		// default
		if (watcher) clearTimeout(watcher)
		watcher = setTimeout(function () {
			watcher = null
			//console.log('F1000 Annotator: WHITELIST: PAGE RENDERED: Resetup now.')
			F1000Global.whitelistedReady = true
			resetup()
		}, 300)
	}

	// Bootstrap

	// Open a funny message if not against preferences
	if (!false) popup.showWelcomeBalloon('f1000PDF')

	// Before Printinting, triggers rescan on passed target
	/*window.addEventListener('message', function (e) {
		if (!e.data || e.data.type !== 'hl-beforeprint') return
		var selector = e.data.selector
		var target = document.querySelector(selector)
		if (!target) return;
		f1kat.highlighterTarget = target
		var loadedPages = // XX should come with the event
		var annotations = getAnnotationsInLoadedPages(loadedPages)
		// XX we need to rescan? what about the cache? can we simply adapt the xPaths?
		//f1kat.hl.setupAnnotations(annotations)
		window.postMessage({ type: 'hl-beforeprint-done' }, '*')
		f1kat.highlighterTarget = null
	})*/

	// Receive pages content
	window.addEventListener('message', function (e) {
		if (e.data && e.data.type === 'pageContentsLoaded') {
			pagesInfo.setContent(e.data.pageContents)
			pagesInfo.instantiate(null, function () {
				// this is good to stay only here as if /find comes second the content
				// will be available and message will be wrongly the default one only
				// in the short timeframe of the async execution
				state.showNotes.message404 = message404_default
			})
		}
	})

	// expose resetup
	F1000Global.whitelistedResetup = resetup

	// starts listening for pages rendering
	var pagerendered = 'textlayerrendered'
	document.addEventListener(pagerendered, whitelistedReadyListener, false)

	// Interface Hacks
	if (false) {
		F1000PDF_pinchZoomHandler.init()
	} else {
		var hideArrow = F1000Global.debounce(function () {
			f1kat.hl.ui && f1kat.hl.ui.setAttribute('f1kat-arrow-hidden', true)
		}, 250)
		document.body.querySelector('#viewerContainer').addEventListener('scroll', hideArrow)
		F1000Global.integratedUI = F1000Global.integratedUI_F1000PDFViewer
		if (false) {
			F1000Global.userLocked = true
		}
	}

	// fire an eventless setup for embedded annotator
	if (false) {
		whitelistedReadyListener()
	}

	// Done
	//console.log('F1000 Annotator: WHITELIST: BOOT: Applied whitelist rules for F1000 PDF Viewer')
}
//
// F1000 PDF Viewer Latest
// @param {version Number} the view version detected at boot time, affects caches.
//
// You can use /pdf /pdf-legacy /pdf-latest to select the viewer
//
F1000Global.whitelistHandlers.F1000_PDF_Viewer_Latest = function (version) {
	// ALL THINGS CACHES
	// WhitelistedSignature is used to invalidate paths cache when viewer version changes <integer>,
	// MUST BE INCREASED if html content before or containing quotes changes in any way that affects the xPaths.
	// Original paths will be invalidated automatically when cache is not found or invalid,
	// allowing a full rescan: see f1kat.hl.setupAnnotations and f1kat.hl.pathsCache.instantiate.
	//
	// WE ARE HARD CODING IT - WE FEAR FALSE POSITIVES IF WE ACTIVATE RESCAN IN SAME DOMAIN
	//
	F1000Global.whitelistedSignature = 1 //+version
	//console.log(F1000Global.whitelistedSignature, typeof F1000Global.whitelistedSignature)
	// enable pageInfos and pathsCache caches
	F1000Global.whitelistedPathsCacheOn = true
	F1000Global.whitelistedPagesInfoCacheOn = true
	// remember to remove that newapi thing from the uri!
	var cacheDomain = location.pathname.replace(/.*:|\W/g, '').replace('newapi', '')
	F1000Global.whitelistedPathsCacheDomain = F1000Global.whitelistedPagesInfoCacheDomain = cacheDomain
	// Set global regexp for pages matching
	// NOTE: be careful when html changes, this gets applied as faster choice for
	// inSameDomain notes, so if changed the new one should not give false positives on
	// old xPaths instead of null.
	// On f1k-invalidated paths from pathsCache invalidation it will just fail which is wanted.
	pagesInfo.getPagesByXPathRange_regExp = /\/div\[1\]\/div\[2\]\/div\[4\]\/div\[1\]\/div\[(\d+)/i

	// Mobile
	function setBodyHeight() {
		document.body.style.height = window.innerHeight + 'px'
	}
	if (false) {
		// webview fix https://github.com/mozilla/pdf.js/issues/7157
		window.addEventListener("resize", function () {
			setTimeout(setBodyHeight, 0)
		})
		setBodyHeight()
		/* NOTE: Mobile consistency logs, MUST pass both Android and iOS
		console.log('F1000Global.whitelistedPathsCacheDomain')
		console.log(F1000Global.whitelistedPathsCacheDomain)
		console.log('F1000Global.whitelistedPagesInfoCacheDomain')
		console.log(F1000Global.whitelistedPagesInfoCacheDomain)
		console.log('pagesInfo.getPagesByXPathRange_regExp')
		console.log(pagesInfo.getPagesByXPathRange_regExp + '')
		var executed = pagesInfo.getPagesByXPathRange_regExp.exec('html/body/div[1]/div[2]/div[4]/div[1]/div[1]/div[2]')
		console.log('executed should be: ["/div[1]/div[2]/div[4]/div[1]/div[1", "1"]')
		console.log(executed[0], executed[1])
		//*/
	}

	// Highlighter Target
	f1kat.highlighterTarget = document.querySelector('#viewerContainer')

	// Overrides
	content_script.session.highlighterPreference = true
	// this will be picked up in content_script.closeHighlighterEditor to restore the caret in the custom find
	f1kat.caretBackupActive = true
	// this will be picked up in content_script.init
	F1000Global.useRelativeURI = true
	// this will be used by ie selectionScan and helpers/selectText
	F1000Global.partialsFindThreshold = 1
	// XN if we want to improve rescan this can be allowed accordingly
	f1kat.hl.allowFullQuoteMatch = false
	// shoeNotes 404 message before content is received
	var message404_default = state.showNotes.message404
	state.showNotes.message404 = 'Full content is still loading, please wait a moment then retry.',

		// Polyfills
		F1000Global.whitelistHandlers.polyfill_CustomEvent()

	f1kat.hl.scrollBackup = function (restore) {
		var el = document.getElementById('viewerContainer')
		if (el) {
			if (!restore) return { x: el.scrollLeft, y: el.scrollTop };
			el.scrollLeft = restore.x
			el.scrollTop = restore.y
		}
	}

	// Helpers
	f1kat.hl.getRangeImagesSrc2Id = {}
	f1kat.hl.getRangeImages = function (r) {
		return []
	}

	F1000Global.whitelistedAnnotationSaved = function (annotation, requestType) {
		window.postMessage({ annotationsUpdate: requestType }, '*')
	}

	// Force page id infos to the source library item
	var LibraryItemId = document.head.querySelector('meta[name="F1000-LibraryItemId"]').content
	pageObjectIds.dominant.id = LibraryItemId
	pageObjectIds.dominant.type = "LibraryItemId"
	pageObjectIds.libraryItemId = LibraryItemId
	pageObjectIds.list = []

	// Handles lazy page rendering
	function getLoadedPages() {
		var pages = []
		var loaded = document.querySelectorAll('[data-loaded="true"]')
			;[].forEach.call(loaded, function (p) {
				var pageNumber = parseInt(p.dataset.pageNumber)
				if (pageNumber) pages.push(pageNumber)
			})
		return pages
	}

	function getAnnotationsMissing(annotations) {
		var annotationsPresent = []
		var annotationsMissing = []
		if (annotations.length > 0) {
			var hls = document.querySelectorAll('.f1kat-hl')
				;[].forEach.call(hls, function (i) {
					var id = i.dataset ? i.dataset['f1kat_hl_id'] : null
					if (annotationsPresent.indexOf(id) === -1) annotationsPresent.push(id)
				})
			for (var i = 0; i < annotations.length; i++) {
				var annotation = annotations[i]
				if (annotationsPresent.indexOf(annotation.id) === -1) annotationsMissing.push(annotation)
			}
		}
		//console.log('annotations present', annotationsPresent)
		//console.log('annotations missing', annotationsMissing)
		return annotationsMissing
	}

	function getAnnotationsInLoadedPages(loadedPages) {
		var loadedPages = loadedPages || getLoadedPages()
		//console.log('data-loaded pages', loadedPages)
		var annotations = f1kat.hl.annotations.all.filter(function (a) {
			//console.log('checking pages for', a.id)
			if (a.pagesInfo) {
				var inLoadedPages = loadedPages.indexOf(a.pagesInfo.start) !== -1 &&
					loadedPages.indexOf(a.pagesInfo.end) !== -1
				return inLoadedPages
			} else {
				// if still has not pagesInfo we need to give it a try
				return true
			}
		})

		return annotations
	}

	function resetup() {
		document.removeEventListener(pagerendered, whitelistedReadyListener, false)
		//console.log('\n\nPAGE UPDATE: resetup')
		//console.log('annotations.all.length', f1kat.hl.annotations.all.length)
		var annotations = getAnnotationsInLoadedPages()
		//console.log('data-loaded pages annotations', annotations.length, annotations)
		var annotationsMissing = getAnnotationsMissing(annotations)
		if (annotationsMissing.length > 0) {
			f1kat.hl.setupAnnotations(annotationsMissing, function () {
				document.dispatchEvent(new CustomEvent('setupAnnotationsDone'))
			})
		}
		//getAnnotationsMissing(annotations)
		document.addEventListener(pagerendered, whitelistedReadyListener, false)
	}

	var watcher = null
	function whitelistedReadyListener(e) {
		//console.log('whitelistedReadyListener')
		//console.log('whitelistedSuspended', F1000Global.whitelistedSuspended)
		// while scrolling or so
		if (F1000Global.whitelistedSuspended) return
		// default
		if (watcher) clearTimeout(watcher)
		watcher = setTimeout(function () {
			watcher = null
			//console.log('F1000 Annotator: WHITELIST: PAGE RENDERED: Resetup now.')
			F1000Global.whitelistedReady = true
			resetup()
		}, 300)
	}

	// Bootstrap

	// Open a funny message if not against preferences
	if (!false) popup.showWelcomeBalloon('f1000PDF')

	// Before Printinting, triggers rescan on passed target
	/*window.addEventListener('message', function (e) {
		if (!e.data || e.data.type !== 'hl-beforeprint') return
		var selector = e.data.selector
		var target = document.querySelector(selector)
		if (!target) return;
		f1kat.highlighterTarget = target
		var loadedPages = // XX should come with the event
		var annotations = getAnnotationsInLoadedPages(loadedPages)
		// XX we need to rescan? what about the cache? can we simply adapt the xPaths?
		//f1kat.hl.setupAnnotations(annotations)
		window.postMessage({ type: 'hl-beforeprint-done' }, '*')
		f1kat.highlighterTarget = null
	})*/

	// Receive pages content
	window.addEventListener('message', function (e) {
		if (e.data && e.data.type === 'pageContentsLoaded') {
			pagesInfo.setContent(e.data.pageContents)
			pagesInfo.instantiate(null, function () {
				// this is good to stay only here as if /find comes second the content
				// will be available and message will be wrongly the default one only
				// in the short timeframe of the async execution
				state.showNotes.message404 = message404_default
			})
		}
	})

	// expose resetup
	F1000Global.whitelistedResetup = resetup

	// starts listening for pages rendering
	var pagerendered = 'textlayerrendered'
	document.addEventListener(pagerendered, whitelistedReadyListener, false)

	// Interface Hacks
	if (false) {
		F1000PDF_pinchZoomHandler.init()
	} else {
		var hideArrow = F1000Global.debounce(function () {
			f1kat.hl.ui && f1kat.hl.ui.setAttribute('f1kat-arrow-hidden', true)
		}, 250)
		document.body.querySelector('#viewerContainer').addEventListener('scroll', hideArrow)
		F1000Global.integratedUI = F1000Global.integratedUI_F1000PDFViewer
		if (false) {
			F1000Global.userLocked = true
		}
	}

	// fire an eventless setup for embedded annotator
	if (false) {
		whitelistedReadyListener()
	}

	// Done
	//console.log('F1000 Annotator: WHITELIST: BOOT: Applied whitelist rules for F1000 PDF Viewer')
}
//
// F1000 Workbench
//
F1000Global.whitelistHandlers.workbench = function () {
	// Overrides
	// ignore list count
	pageObjectIds.ignoreListCount = true
	// ignore HighlighterPreference
	content_script.session.highlighterPreference = true
	// this will be picked up in content_script.closeHighlighterEditor to restore the caret in the custom find
	f1kat.caretBackupActive = true
	f1kat.hl.allowFullQuoteMatch = false

	function annnotationCommentSaved(detail) {
		if (!detail.id) return;
		var targetAnnotation = f1kat.hl.annotations.all.filter(function (i) { return i.id === detail.id })[0];
		if (!targetAnnotation) return;
		targetAnnotation.text = detail.value
	}

	function annnotationFilterByUser(detail) {
		if (detail.userIds) f1kat.hl.filterAnnotations(detail.userIds)
	}

	function domupdated(e) {
		setTimeout(function () {
			var highlighterTarget = document.querySelector('.highlighter-target')
			//console.log('domupdated highlighterTarget', highlighterTarget)
			if (!highlighterTarget) return f1kat.highlighterTarget = 0;
			f1kat.highlighterTarget = highlighterTarget
			// the following is equivalent to lazy pages "resetup"
			var annotations = f1kat.hl.annotations.all
			var annotationsPresent = []
			var annotationsMissing = []
			var hls = document.querySelectorAll('.f1kat-hl')
				;[].forEach.call(hls, function (i) {
					var id = i.dataset ? i.dataset['f1kat_hl_id'] : null
					if (annotationsPresent.indexOf(id) === -1) annotationsPresent.push(id)
				})
			for (var i = 0; i < annotations.length; i++) {
				if (annotationsPresent.indexOf(annotations[i].id) === -1) {
					annotationsMissing.push(annotations[i])
				}
			}
			//console.log('domupdated annotationsMissing', annotationsMissing)
			f1kat.hl.setupAnnotations(annotationsMissing)
		}, 0)
	}

	function routechange(e) {
		// console.log('\nroutechange')
		// stop listening for local comments updates
		document.removeEventListener('annotation-comment-saved', annnotationCommentSaved)
		// stop listening for annotations push
		document.removeEventListener('annotationspush', f1kat.hl.annotations.refresh)
		// stop listening for dom mutations
		document.removeEventListener('domupdated', domupdated)
		// closes any pending highlighter ui
		content_script.closeHighlighterEditor()
		// reset the preventGET for eventual f1000.com same domain users
		F1000Global.preventAnnotationsGET = true
		// clean highlighterTarget ref
		f1kat.highlighterTarget = null
		// clean highlighter state
		content_script.highlighter = false
		content_script.highlighterEnabled = false
		state.highlighter.on = false
		// clean page infos
		pageObjectIds.dominant.pageTitle = document.title
		pageObjectIds.dominant.id = null
		pageObjectIds.dominant.type = null
		pageObjectIds.dominant.uri = window.location.href
		pageObjectIds.libraryItemId = null
		pageObjectIds.articleId = null
		// enters correct workbench mode
		state.workbenchMode = 'off'
		// ignore HighlighterPreference
		content_script.session.highlighterPreference = true
		// updates popup ui
		popup.update()
		// console.log('end of route change\n')
	}

	function routeready(e) {
		// console.log('\nrouteready', document.location.href)
		var manuscript, itemDetail
		// Check for a manuscript page (has been moved outside the wb)
		manuscript = document.location.href.match(/\/documents\/(\d+)/, 'gi')
		if (manuscript) {
			manuscript = manuscript[1]
			// enters correct workbench mode
			state.workbenchMode = 'manuscript'
			//console.log('manuscript', manuscript)
		} else {
			// Check for an item detail page
			itemDetail = document.location.hash.match(/\#\/items\/(\d+)/, 'gi')
			if (itemDetail) {
				itemDetail = itemDetail[1]
				// enters correct workbench mode
				state.workbenchMode = 'itemDetail'
				//console.log('itemDetail', itemDetail)
			}
		}
		// if any of the above bootstrap the highlighter with the url's libraryItemId
		var libraryItemId = manuscript || itemDetail
		//console.log('libraryItemId', libraryItemId)
		if (libraryItemId) {
			F1000Global.preventAnnotationsGET = false
			// set highlighter target, this will scope adder and rescan/paint
			var highlighterTarget = document.querySelector('.highlighter-target')
			f1kat.highlighterTarget = highlighterTarget ? highlighterTarget : 0
			//console.log('highlighterTarget', highlighterTarget, f1kat.highlighterTarget)
			// Nothing to do here, workbenchMode manuscript is only after a scoped target is present
			if (manuscript && !highlighterTarget) return routechange()
			// tries to lookup a suggested title
			var title = document.querySelector('[data-title]')
			if (title) {
				pageObjectIds.dominant.pageTitle = title.dataset.title
				pageObjectIds.dominant.pageTitleEscaped = title.dataset.title
			}
			if (!title) title = document.title
			//console.log('target dataset', highlighterTarget.dataset)
			//console.log('target title', title)
			// set page infos
			pageObjectIds.dominant.id = libraryItemId
			pageObjectIds.dominant.type = "LibraryItemId"
			pageObjectIds.dominant.uri = window.location.href
			pageObjectIds.libraryItemId = libraryItemId
			// turn on the highlighter
			content_script.init(true)
			// updates ui
			popup.update()
			// local comments updates
			window.addEventListener('message', function (e) {
				var type = e.data.type
				if (type === 'annotation-comment-saved') annnotationCommentSaved(e.data.detail)
				else if (type === 'annotation-filter-by-user') annnotationFilterByUser(e.data.detail)
			})
			// live annotations push
			document.addEventListener('annotationspush', f1kat.hl.annotations.refresh)
			// dom mutations
			document.addEventListener('domupdated', domupdated)
			// console.log('end of routeready\n')
		} else {
			// console.log('\nfalse routeready')
			routechange()
		}

	}

	function setdemomode(e) {
		var collections = document.querySelectorAll('.collections-container .collection')
		var isOnboarding = collections.length === 1
		if (isOnboarding) content_script.setDemoMode(e.detail)
	}

	// start listening to workbench events
	document.addEventListener('routechange', routechange)
	document.addEventListener('routeready', routeready)
	document.addEventListener('setdemomode', setdemomode)
	// initial state needs to be induced imperatively
	routeready()
	// show popup programmatically
	if (location.hash.indexOf('/guide/collect') !== -1) {
		if (state.session && state.session.preferences.welcomeBalloon_guideCollect) {
			content_script.setPreferences({ welcomeBalloon_guideCollect: false })
			popup.toggle()
		}
	}
}
//
// Google Books - NOT A WHITELISTED - can be internationalized using ors in the match regexp
//
F1000Global.whitelistHandlers.gbooks = function () {
	function init() {
		F1000Global.preventAnnotationsGET = false
		content_script.init()
		popup.update()
	}

	function parseMetadataRows(frag) {
		var f = typeof frag !== 'string' ? frag : F1000Global.htmlFragment(frag)
		var mrs = f.querySelectorAll('.metadata_row')
		var metas = {}
			;[].forEach.call(mrs, function (r) {
				var label = r.querySelector('.metadata_label')
				var value = r.querySelector('.metadata_value')
				if (label && label.textContent &&
					value && value.textContent) {
					label = label.textContent
					if (label.match(/Title/i)) {
						if (value.childNodes && value.childNodes[0] && value.childNodes[0].textContent) {
							value = value.childNodes[0].textContent
							pageObjectIds.dominant.id = value
							pageObjectIds.dominant.pageTitle = value
						}
					} else if (label.match(/Authors/i)) {
						value = value.querySelectorAll('a')
						value = [].map.call(value, function (i) {
							return i.textContent ? i.textContent.replace(/\,/g, '').trim() : null
						}).filter(function (i) {
							return i && i.length && i.length > 3 ? true : false
						})
						pageObjectIds.dominant.authors = value
					} else if (label.match(/Author/i)) {
						value = value.textContent
						var authors = [value]
						pageObjectIds.dominant.authors = authors
					} else if (label.match(/Editors/i)) {
						value = value.querySelectorAll('a')
						value = [].map.call(value, function (i) {
							return i.textContent ? i.textContent.replace(/\,/g, '').trim() : null
						}).filter(function (i) {
							return i && i.length && i.length > 3 ? true : false
						})
						pageObjectIds.dominant.editors = value
					} else if (label.match(/Editor/i)) {
						value = value.textContent
						pageObjectIds.dominant.editors = [value]
					} else if (label.match(/Edition/i)) {
						value = F1000Global.parseWordNumber(value.textContent)
						pageObjectIds.dominant.edition = value
					} else if (label.match(/Publisher/i)) {
						value = value.textContent
						var publisherDate = value.split(',')
						pageObjectIds.dominant.date = publisherDate[1]
						pageObjectIds.dominant.publisher = publisherDate[0]
					} else if (label.match(/ISBN/i)) {
						value = value.textContent
						var isbnList = value.split(',')
						var isbn = isbnList[1] ? isbnList[1] : isbnList[0]
						pageObjectIds.dominant.isbn = isbn.trim()
					}
				}
			})
		var synopsis = f.querySelector('#synopsistext')
		if (synopsis && synopsis.childNodes && synopsis.childNodes.length > 0) {
			synopsis = [].filter.call(synopsis.childNodes, function (i) {
				return i.textContent ? true : false
			})
				.map(function (i) { return i.textContent })
				.join('\n\n')
		}
		if (synopsis) pageObjectIds.dominant.articleAbstract = synopsis
		pageObjectIds.dominant.type = 'CompositeArticleId'
		pageObjectIds.dominant.referenceType = 'BOOK'
		pageObjectIds.pageType = 'ARTICLE'
		setTimeout(init)
	}

	F1000Global.preventAnnotationsGET = true

	var biblioInfoURI = document.querySelector('#sidebar-atb-link')
	if (biblioInfoURI && biblioInfoURI.href) {
		popup.preventInteraction()
		F1000Global.request('get', biblioInfoURI.href, null, null,
			function (d) {
				var frag = d.match(/<div[\s\S]*/i)[0];
				parseMetadataRows(frag)
			},
			function () {
				parseMetadataRows(document.body)
			}
		)
	} else {
		parseMetadataRows(document.body)
	}
}
//
// Google Docs
//
F1000Global.whitelistHandlers.gdocs = function () {
	var triggerHelper = {
		clickButton: function (el, cb) {
			var self = this
			setTimeout(function () {
				self.triggerMouseEvent("mousedown", el)
				setTimeout(function () {
					self.triggerMouseEvent("mouseup", el)
					//self.triggerMouseEvent("click", el)
					if (cb) cb()
				}, 10)
			}, 10)
		},
		triggerMouseEvent: function (type, el) {
			var box = el.getBoundingClientRect()
			var x = box.left + box.width / 2
			var y = box.top + box.height / 2

			var ev;
			if (detectBrowser().browser === 'ie') {
				ev = document.createEvent("MouseEvents")
				ev.initMouseEvent(type, true, false, document.defaultView, 1, x, y, 0, 0, false, false, false, false, 0, null)
			} else {
				ev = new MouseEvent(type, { view: document.defaultView, bubbles: true, cancelable: false, screenX: x, screenY: y })
			}
			el.dispatchEvent(ev)
		}
	}

	function getMenuEntry(contentFilter, equal) {
		var menusContent = document.querySelectorAll('.goog-menuitem-content')
		var entry;
		if (equal) {
			entry = [].filter.call(menusContent, function (i) { return i.textContent == contentFilter })[0];
		} else {
			entry = [].filter.call(menusContent, function (i) { return i.textContent.indexOf(contentFilter) !== -1 })[0];
		}
		return entry
	}

	function detectInstallation() {
		F1000Btn = getMenuEntry('Sciwheel') || getMenuEntry('F1000')
		installed = !!F1000Btn
	}

	// handles all the menu actions, taking care that all preconditions are clear
	function openSomething(defaultAction) {
		if (openSomethingSafetyCheck < 0) {
			openSomethingSafetyCheck = 64
			return
		}
		// F1000 button installed?
		detectInstallation()
		if (!installed || !F1000Btn) {
			if (!waitInstallTimeout) {
				if (waitInstallCheck) {
					waitInstallCheck = false
					waitInstallTimeout = setTimeout(function () {
						waitInstallTimeout = false
						openSomething(defaultAction)
					}, 2000)
				} else {
					openIntallInstructions()
				}
			}
			return
		}
		// trigger something
		var manageBtn = getMenuEntry('Insert citations  ', true)
		if (!manageBtn) {
			openSomethingSafetyCheck -= 1
			triggerHelper.clickButton(F1000Btn, function () { openSomething(defaultAction) })
		} else {
			openSomethingSafetyCheck = 64
			if (defaultAction) {
				manageBtn.parentNode.parentNode.style.display = 'none'
				triggerHelper.clickButton(manageBtn)
			} else {
				var F1000BtnBox = F1000InjectedMenuEntry.getBoundingClientRect()
				menuContainer = manageBtn.parentNode.parentNode
				menuContainer.style.top = F1000BtnBox.top - 1 + F1000BtnBox.height + 'px'
				menuContainer.style.left = F1000BtnBox.left + 'px'
				menuContainer.style.display = 'block'
				F1000InjectedMenuEntryActive.style.top = F1000BtnBox.top + 'px'
				F1000InjectedMenuEntryActive.style.left = F1000BtnBox.left + 'px'
				document.body.appendChild(F1000InjectedMenuEntryActive)
				window.addEventListener('mousedown', closeF1000MenuMD)
				window.addEventListener('mouseup', closeF1000MenuMU)
			}
		}
	}

	// closing the menu
	function menuStyleReset() {
		if (menuContainer) menuContainer.style.display = 'none'
		if (F1000InjectedMenuEntryActive && F1000InjectedMenuEntryActive.parentNode) {
			F1000InjectedMenuEntryActive.parentNode.removeChild(F1000InjectedMenuEntryActive)
		}
	}
	function closeF1000MenuMD(e) {
		window.removeEventListener('mousedown', closeF1000MenuMD)
		var target = e.target || e.srcElement
		var contained = menuContainer.contains(target)
		if (!contained) menuStyleReset()
	}
	function closeF1000MenuMU(e) {
		window.removeEventListener('mouseup', closeF1000MenuMU)
		var target = e.target || e.srcElement
		var contained = menuContainer.contains(target)
		if (!contained) {
			window.addEventListener('mousedown', closeF1000MenuMD)
		} else {
			menuStyleReset()
		}
	}
	function closeF1000MenuBlur() {
		window.removeEventListener('mouseup', closeF1000MenuMU)
		window.removeEventListener('mousedown', closeF1000MenuMD)
		menuStyleReset()
	}

	function appendMenu() {
		var el = jsonML2Dom(
			['div#docs-f1000-menu.menu-button.goog-control.goog-inline-block',
				{
					role: 'menuitem',
					'aria-disabled': 'false',
					'aria-haspopup': 'false',
					style: '-webkit-user-select: none;'
				},
				'Sciwheel'
			]
		)
		var elActive = jsonML2Dom(
			['div.f1k-gdocs-active',
				['div.f1k-gdocs-active-in', 'Sciwheel']
			]
		)
		var t = document.getElementById('docs-extensions-menu')
		if (t && t.nextSibling) {
			el.addEventListener('click', function () { openSomething(false) })
			t.parentNode.insertBefore(el, t.nextSibling)
			F1000InjectedMenuEntry = el
			F1000InjectedMenuEntryActive = elActive
		}
	}

	/*function appendToolbarFIcon() {
		var el = jsonML2Dom(['div#docs-f1000-f-icon.goog-toolbar-button.goog-toolbar-menu-button.goog-inline-block',
			'F'
		])
		el.dataset.tooltip = 'Sciwheel Add-on'
		var t = document.getElementById('docs-primary-toolbars')
		if (t) {
			el.addEventListener('click', function () { openSomething(true) })
			t.appendChild(el)
		}
	}*/

	var handlers = {
		step: 0,
		close: function () {
			var modal = document.getElementById('f1k-gdocs-installation-modal-layer')
			if (modal) modal.click()
		},
		progress: function () {
			handlers.step += 1
			handlers.stepSelect()
		},
		reload: function () {
			window.location.reload()
		},
		remove: function (e) {
			var target = e.target || e.srcElement
			if (target) target.parentNode.removeChild(target);
		},
		stepSelect: function () {
			var stepClass = 'f1k-step-' + handlers.step
			var stepsElements = document.querySelectorAll('#f1k-gdocs-installation .f1k-step')
				;[].forEach.call(stepsElements, function (s) {
					s.style.display = s.classList.contains(stepClass) ? 'block' : 'none'
				})
		},
		stop: function (e) {
			e.stopPropagation()
		}
	}

	function openIntallInstructions() {
		if (document.getElementById('f1k-gdocs-installation')) return;
		var el = jsonML2Dom(
			['#f1k-gdocs-installation-modal-layer', { $: 'click.remove' },
				['div#f1k-gdocs-installation', { $: 'click.stop', style: 'background: linear-gradient(to bottom, rgba(253,253,253,1) 32%, rgba(241,247,250,1) 128%);' },
					['.f1k-gdocs-installation-header',
						'Sciwheel add-on',
						['div', { $: 'click.close', style: 'margin-top: -10px; float: right; color: darkgray; font-size: 21px' },
							'x'
						]
					],
					['span.f1k-step.f1k-step-0', { style: 'height: 100%;' },
						['div', { style: 'height: 100%; background-position: 40px 0 !important; background-repeat: no-repeat !important; background: url(' + 'https://sciwheel.com/annotator/assets' + '/images/gdocs-preview1.png);' },
							['div', { style: 'margin: 40px 40px 40px 330px;' },
								['p', { style: 'font-size: 16px; line-height: 27px; font-weight: bold;' },
									'Install the Sciwheel writing add-on to cite references, search PubMed and over 170,000 expert recommendations, all without leaving Google Docs.',
								],
								['p', { style: 'margin: 30px 0; font-size: 13px; line-height: 21px;' },
									['strong', 'To install the add-on'],
									['ul', { style: 'padding: 0 16px; line-height: 28px;' },
										['li', 'Click the ', ['strong', 'Get Sciwheel add-on'], ' button below'],
										['li', 'Click the button ',
											['span', { $: 'click.progress', style: 'cursor: default; display: inline; position: absolute; margin-left: 8px;' },
												['a', { href: 'https://sciwheel.com/get-gdocs-addon', target: '_blank' },
													['img', { src: 'https://sciwheel.com/annotator/assets' + '/images/gdocs-installbtn.png' }],
												]
											]
										],
										['li', 'Click ', ['strong', 'Allow'], ' for Sciwheel to access Google Docs']
									]
								],
								['div', { $: 'click.progress' },
									['a', { href: 'https://sciwheel.com/get-gdocs-addon', target: '_blank' },
										['div.goog-inline-block jfk-button.jfk-button-action.docs-titlebar-button',
											'Get Sciwheel add-on'
										]
									]
								]
							]
						]
					],
					['span.f1k-step.f1k-step-1', { style: 'height: 100%;' },
						['div', { style: 'height: 100%; background-position: 50% 80% !important; background-repeat: no-repeat !important; background: url(' + 'https://sciwheel.com/annotator/assets' + '/images/gdocs-preview2.png);' },
							['div', { style: 'margin: 40px 128px 40px 330px;' },
								['img', { style: 'position: absolute; margin-left: -200px; margin-top: 28px;', src: 'https://sciwheel.com/annotator/assets' + '/images/gdocs-refresh.png' }],
								['p', { style: 'font-size: 19px; line-height: 27px; font-weight: bold;' },
									'Almost done!',
								],
								['p', { style: 'margin: 30px 0; font-size: 14px; line-height: 21px;' },
									'Simply refresh this page to start using Sciwheel.'
								],
								['p', { style: 'margin: 30px 0; font-size: 14px; line-height: 21px;' },
									'Once the page has been refreshed, you can insert citations into your document by clicking ', ['strong', 'Sciwheel tab'], '.'
								],
								['div', { $: 'click.reload', style: 'float: left;' },
									['div.goog-inline-block jfk-button.jfk-button-action.docs-titlebar-button',
										'Refresh now'
									]
								],
								['div', { $: 'click.close', style: 'float: left;' },
									['div.goog-inline-block jfk-button.jfk-button-action.docs-titlebar-button',
										{ style: 'background: transparent; color: #4C8EFA;' },
										'Close'
									]
								]
							]
						]
					]
				]
			]
			, handlers)
		document.body.appendChild(el)
		handlers.stepSelect()
	}

	// unsupported
	if (detectBrowser().browser === 'edge') {
		F1000Global.gdocs = false
		F1000Global.whitelistHandlers.justBlacklist()
		return
	}
	// general
	F1000Global.whitelisted = 'gdocs'
	F1000Global.blacklistedHighlighter = true
	// F icon
	pageObjectIds.ignoreListCount = true
	F1000Global.redMood = true
	// browserAction queues are prevented in content_sript.sessionHandler
	F1000Global.preventBrowserActionQueue = true
	// delay boot until menubar is ready
	var docsNoticeEl = document.querySelector('#docs-notice')
	if (!docsNoticeEl || !docsNoticeEl.getAttribute('role')) {
		content_script.browserAction = function () { }
		setTimeout(F1000Global.whitelistHandlers.gdocs, 500)
		return
	}
	// don't run twice
	if (F1000Global.gDocsInjected) return;
	F1000Global.gDocsInjected = true
	// state
	var installed = false
	var F1000Btn;
	var F1000InjectedMenuEntry;
	var F1000InjectedMenuEntryActive;
	var waitInstallCheck = true;
	setTimeout(function () { waitInstallCheck = false }, 2000)
	// uncomment to dev the installation balloon
	//setTimeout(function () { waitInstallCheck = false; openIntallInstructions() }, 0)
	var waitInstallTimeout;
	var openSomethingSafetyCheck = 64
	// closing the menu
	var menuContainer;
	window.addEventListener('blur', closeF1000MenuBlur)
	// browserAction
	content_script.browserAction = function () { openSomething(true) }
	// DOM
	appendMenu()
	//appendToolbarFIcon()
}
//
// Recommendations (not a whitelisted)
//
// NOTE: refactor can do this as whitelist onReferencesUpdated
//
var recommendations = function () {
	var module = {}
	var ARTICLE_ID_NOT_RECOMMENDED = 'not-recommended'
	var GACampaignName = 'ext-fo-badge'
	var config = {
		targetSelector: 'div',
		labelStyles: 'margin: 16px;'
	}

	module.toggle = function _toggle(value) {
		var shouldShow = value
		// preference
		state.session.preferences.showRecommendations = shouldShow
		content_script.setPreferences({ showRecommendations: shouldShow })
		// visual toggle
		var labels = document.querySelectorAll('.f1kat-recommendation-label')
		Array.prototype.forEach.call(labels, function (i) {
			i.classList[shouldShow ? 'remove' : 'add']('f1000-at-popup-hidden')
		})
		// resetup for SPA searches
		module.boot()
	}

	function resolveRecommended(references) {
		// Pick unresolved
		var payload = references.filter(function (i) {
			return !(i.resolved && i.resolved.articleId)
		})
		// All resolved already
		if (payload.length === 0) {
			return
		}
		// console.log('recommendations onPageScan payload', payload)
		F1000Global.request("post", getBaseURL() + '/annotator/objectids/resolver-recommended', payload, 'json',
			function (d) {
				// console.log('recommendations fetch response', d)
				// var shouldSetupRecommendations = 'always-dev-only' // NOTE: dev only
				var shouldSetupRecommendations = false
				d.forEach(function (resolved) {
					var articleId = resolved.articleId
					if (articleId) {
						shouldSetupRecommendations = true
					} else {
						// NOTE: mark all so we can ignore references on SPA resetup
						articleId = ARTICLE_ID_NOT_RECOMMENDED
					}
					pageObjectIds.list.forEach(function (reference) {
						if (reference.id === resolved.id) {
							reference.resolved.articleId = articleId
						}
					})
				})
				if (shouldSetupRecommendations) {
					setupRecommendations()
				}
			},
			content_script.unauthorized
		)
	}

	function resolveRecommendedArticle(dominant) {
		var payload = [dominant]
		F1000Global.request("post", getBaseURL() + '/annotator/objectids/resolver-recommended', payload, 'json',
			function (d) {
				// console.log('recommendations fetch response', d)
				var resolved = d[0]
				var articleId = resolved.articleId // || 'dev-only'
				if (articleId) {
					setupRecommendationsArticle(articleId)
				}
			},
			content_script.unauthorized
		)
	}

	function getGAQueryString() {
		var domain = location.host
		var qs = '?utm_source=' + domain + '&utm_medium=click-through&utm_campaign=' + GACampaignName
		return qs
	}

	var handlers = {
		stopPropagation: function (e) { e.stopPropagation() }
	}

	function renderLabel(articleId) {
		var labelStyles = config.labelStyles
		var href = encodeURI(
			'https://facultyopinions.com' + '/prime/' + articleId + getGAQueryString()
		)
		var labelAttrs = {
			href: href,
			target: '_blank',
			rel: 'noreferrer noopener',
			style: labelStyles,
			$: 'click.stopPropagation'
		}
		return jsonML2Dom((
			['a.f1kat-recommendation-label.f1kat-just-fade-in', labelAttrs,
				['div.f1kat-img-faculty', {
					style: 'margin: 4px 6px 0 6px !important;'
				}],
				'Recommended'
			]
		), handlers)
	}

	function getTargetElement($el) {
		if (!$el.children) {
			return null
		}
		var targetSelector = config.targetSelector
		var targetEl = targetSelector ? $el.querySelector(targetSelector) : $el
		return targetEl ? targetEl : $el
	}

	function setupRecommendations() {
		// console.log('recommendations setupRecommendations domain', pageObjectIds.domain)
		pageObjectIds.list.forEach(function (i) {
			var articleId = i.resolved.articleId
			// if (articleId && 'always-dev-only') { // NOTE: dev only
			if (articleId && articleId !== ARTICLE_ID_NOT_RECOMMENDED) {
				var targetElement = getTargetElement(i.$el)
				if (targetElement) {
					if (!targetElement.querySelector('.f1kat-recommendation-label')) {
						var label = renderLabel(articleId)
						targetElement.appendChild(label)
					}
				}
			}
		})
	}

	function setupRecommendationsArticle(articleId) {
		var targetSelector = config.targetSelector
		var targetElement = document.body.querySelector(targetSelector)
		if (targetElement) {
			if (!targetElement.querySelector('.f1kat-recommendation-label')) {
				var label = renderLabel(articleId)
				targetElement.appendChild(label)
			}
		}
	}

	function checkIsReccomendationsArticleDomain() {
		var quickTest = /pubmed\.ncbi\.nlm\.nih\.gov\/\d+|ncbi\.nlm\.nih\.gov\/pmc\/articles\/|rxiv\.org\/content\/10\./i
		return quickTest.test(location.href)
	}

	function getRecommendationsArticleSupport() {
		var href = location.href
		var _config = {}
		if (/pubmed\.ncbi\.nlm\.nih\.gov\/\d+/i.test(href)) {
			_config.targetSelector = '#full-view-heading'
			_config.labelStyles = 'display: flex; margin: 16px 16px 16px 0;'
		} else if (/ncbi\.nlm\.nih\.gov\/pmc\/articles\//i.test(href)) {
			_config.targetSelector = '.fm-sec'
			_config.labelStyles = 'display: flex; margin: 16px 16px 32px 0;'
		} else if (/rxiv\.org\/content\/10\./i.test(href)) {
			_config.targetSelector = '.highwire-article-citation'
			_config.labelStyles = 'display: flex; margin: 16px 16px 32px 0;'
		} else {
			return null
		}
		return {
			isArticle: true,
			getConfig: function () { return _config }
		}
	}

	function getRecommendationsSupport() {
		var found = pageObjectIds.recommendationsSupport
		if (!found) {
			var isReccomendationsArticleDomain = checkIsReccomendationsArticleDomain()
			if (isReccomendationsArticleDomain) {
				found = getRecommendationsArticleSupport()
			}
		}
		return found
	}

	module.boot = function _boot() {
		if (state.session.preferences.showRecommendations) {
			var recommendationsSupport = getRecommendationsSupport()
			if (recommendationsSupport) {
				config = recommendationsSupport.getConfig()
				if (recommendationsSupport.isArticle) {
					GACampaignName = 'ext-fo-badge-article'
					var dominant = pageObjectIds.dominant
					resolveRecommendedArticle(dominant)
				} else {
					GACampaignName = 'ext-fo-badge-list'
					var references = pageObjectIds.list
					var shouldShowRecommendations = Array.isArray(references) && references.length > 0
					if (shouldShowRecommendations) {
						resolveRecommended(references)
					}
				}
			}
		}
	}

	return module
}();
