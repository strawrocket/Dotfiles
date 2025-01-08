'use strict';
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

/*
Server side options for 'referenceType' field:
	F1000_ARTICLE
	RESEARCH_ARTICLE
	REVIEW_ARTICLE
	BOOK
	CONFERENCE_PAPER
	WEBSITE
	SOFTWARE
	THESIS
	PERSONAL_COMMUNICATION
	PATENT
	OTHER
*/

function getJournal() {
	var journal = null
	var citationJournalMeta = document.head.querySelector('meta[name="citation_journal_title"]') ||
		document.head.querySelector('meta[property="citation_journal_title"]')
	if (citationJournalMeta && citationJournalMeta.content) journal = citationJournalMeta.content
	return journal
}

function getAuthors() {
	var authors = null
	var citationAuthorsMeta
	citationAuthorsMeta = document.head.querySelector('meta[name="citation_authors"]') ||
		document.head.querySelector('meta[property="citation_authors"]')
	if (citationAuthorsMeta) {
		if (citationAuthorsMeta.content.length > 3)
			citationAuthorsMeta = citationAuthorsMeta.content.split(/[,;]/).map(function (i) { return i.trim() })
	} else {
		citationAuthorsMeta = document.head.querySelectorAll('meta[name="citation_author"]')
		if (citationAuthorsMeta.length === 0)
			citationAuthorsMeta = document.head.querySelectorAll('meta[property="citation_author"]')
		if (citationAuthorsMeta.length > 0)
			citationAuthorsMeta = Array.prototype.map.call(citationAuthorsMeta, function (i) { return i.content })
	}
	if (citationAuthorsMeta) {
		if (Array.isArray(citationAuthorsMeta)) {
			authors = citationAuthorsMeta.filter(function (i) { return !!i })
			if (authors.length === 0) authors = null
		} else {
			authors = null
		}
	}

	return authors
}

function getPublisher() {
	var publisher = null;
	var citationPublisherMeta = document.head.querySelector('meta[name="citation_publisher"]') ||
		document.head.querySelector('meta[property="citation_publisher"]')
	if (citationPublisherMeta && citationPublisherMeta.content) publisher = citationPublisherMeta.content
	return publisher
}

function getDate() {
	var date = null
	var citationPublicationDateMeta = document.head.querySelector('meta[name="citation_publication_date"]') ||
		document.head.querySelector('meta[property="citation_publication_date"]')
	if (!citationPublicationDateMeta || !citationPublicationDateMeta.content) {
		citationPublicationDateMeta = document.head.querySelector('meta[name="citation_date"]') ||
			document.head.querySelector('meta[property="citation_date"]')
	}
	if (!citationPublicationDateMeta || !citationPublicationDateMeta.content) {
		citationPublicationDateMeta = document.head.querySelector('meta[name="citation_online_date"]') ||
			document.head.querySelector('meta[property="citation_online_date"]')
	}
	if (citationPublicationDateMeta && citationPublicationDateMeta.content) date = citationPublicationDateMeta.content
	return date
}

function getIsbn() {
	var isbn = null
	var citationISBNMeta = document.head.querySelector('meta[name="citation_isbn"]') ||
		document.head.querySelector('meta[property="citation_isbn"]')
	if (citationISBNMeta && citationISBNMeta.content) isbn = citationISBNMeta.content
	return isbn
}

function getMetadataObject(citationTitleMeta) {
	var journal = citationTitleMeta ? getJournal() : null
	var authors = citationTitleMeta ? getAuthors() : null
	var publisher = citationTitleMeta ? getPublisher() : null
	var date = citationTitleMeta ? getDate() : null
	var isbn = citationTitleMeta ? getIsbn() : null

	return {
		journal: journal,
		authors: authors,
		publisher: publisher,
		date: date,
		isbn: isbn
	}
}

//
// IncludePDF allowed domains helper
//
var autoImportPDF = {
	// all: second domains known not to allow PDF fetch
	blacklist: [
		'sciencedirect',
		// ours - http://tools2.lsc.net:8181/browse/FCORE-13508
		'f1000research',
		'mniopenresearch',
		'wellcomeopenresearch',
		'gatesopenresearch',
		'childhealthopenresearch',
		'hrbopenresearch',
		'aasopenresearch',
		// new ours
		'facultyopinions',
		'facultyinternal'
	],
	isIncludePDFSupportedDomain: function (host) {
		var hostSplit = host.split('.')
		var secondDomain = hostSplit[hostSplit.length - 2]
		// you can forget it
		var isBlacklisted = autoImportPDF.blacklist.indexOf(secondDomain) !== -1
		if (isBlacklisted) {
			return false
		}
		// all others are true as this feature is not on embedded build
		return true
	}
}

//
// Page Object Ids Scanners
//
// review cleanDeep/cleanDeepFlag is really messed up probably pointless
//
F1000Global.pageObjectIdsHandlers = {}
// Generic
F1000Global.pageObjectIdsHandlers.genericIdsScanner = {
	alreadyRunned: false,
	blacklist: ['10.7763/ijbbb'],
	cleanDeepFlag: false,
	domain: null,
	dominant: null,
	ignoreListCount: false,
	libraryItemId: null,
	list: [],
	known: [],
	pattern: {
		use: 0,
		list: [
			{
				type: 'DigitalObjectId',
				matchURL: '',
				head: /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi,
				body: /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi,
				capture: true,
				clean: /[^\?|^\#]*/,
				cleanDeep: /[^\/]*[\/][^\/]*/,
				decode: false,
				heuristic: true,
				multipleTypesPage: false,
				downmixStereo: true
			},
			{
				type: 'DigitalObjectId',
				matchURL: null,
				head: /dx.doi.org\/(.*?)[\"&\'<>;\S]/gi,
				body: /dx.doi.org\/(.*?)[\"&\'<>;\S]/gi,
				capture: true,
				clean: /10\.[^\"&\'<>;\S]*/,
				cleanDeep: /[^\/]*[\/][^\/]*/,
				decode: true,
				heuristic: false,
				multipleTypesPage: true,
				downmixStereo: true
			},
			{
				type: 'PubMed', // Will be refined as PubMedId or PubMedCentralId in matches()
				matchURL: /nih.gov|europepmc.org/,
				head: /citation_pmid\D*(\d+)|ncbi_uidlist\D*(\d+)|ncbi_article_id\D*(\d+)/gi,
				body: /PMID:\D*(\d+)|PubMed:\D*(\d+)|PubMed ID:\D*(\d+)|PMCID:\D*(\d+)|pubmed\/(\d+)|MED\/(\d+)|list_uids\D?(\d+)/gi,
				capture: false,
				clean: /\d+|PMC\d+/i,
				cleanDeep: null,
				decode: false,
				heuristic: true,
				multipleTypesPage: false,
				downmixStereo: false
			},
			{
				type: 'PrimeArticleId', // XN It is probably totally useless to perform the primeIds scan outside of our domains
				matchURL: /f1000.com\/prime|f1000internal.com\/prime|sciwheel.com\/prime|sciwheelinternal.com\/prime|facultyopinions.com\/prime|facultyinternal.com\/prime/,
				head: /prime\/(\d+)/gi,
				body: /prime\/(\d+)/gi,
				capture: false,
				clean: /\d+/,
				cleanDeep: null,
				decode: false,
				heuristic: false,
				multipleTypesPage: true,
				downmixStereo: false
			}
		],
		set: function () {
			for (var i = 0; i < this.list.length; i++)
				if (this.list[i].matchURL && window.location.href.match(this.list[i].matchURL)) this.use = i;
		},
	},
	extractAlternatePDF: function () {
		function valid(url) {
			if (typeof url === 'string') {
				url = url.trim()
			}
			return url.length > 3 ? url : null
		}

		var host = location.host
		var url = null

		if (!autoImportPDF.isIncludePDFSupportedDomain(host)) {
			return
		}

		// generic meta
		var meta = document.querySelector('meta[name="citation_pdf_url"]') ||
			document.querySelector('meta[property="citation_pdf_url"]')
		if (meta && meta.content) {
			url = valid(meta.content)
			// regular overrides
			if (url) {
				if (~host.indexOf('.wiley.') ||
					~host.indexOf('.embopress.')) {
					url = url.replace(/\/e?pdf\//i, '/pdfdirect/')
				}
			}
		} else {
			// generic link
			var link = document.querySelector('link[type="application/pdf"]') ||
				document.querySelector('a[type="application/pdf"]')
			if (link && link.href) {
				url = valid(link.href)
			} else {
				// domain specific
				if (~host.indexOf('ncbi.nlm.nih.gov')) {
					var pubmedReader = document.getElementById('jr-pdf-sw')
					if (pubmedReader && pubmedReader.href) {
						url = valid(pubmedReader.href)
					}
				} else if (~host.indexOf('europepmc.')) {
					var l = document.querySelectorAll('.list_article_link a')
					if (l) {
						var a = Array.prototype.filter.call(l, function (i) {
							return ~i.href.indexOf('pdf')
						})[0]
						if (a && a.href) {
							url = valid(a.href)
						}
					}
				} else if (~host.indexOf('.nature.')) {
					var natureLink = document.querySelector('.download-pdf a') ||
						document.querySelector('.pdf__download a')
					if (natureLink) {
						url = valid(natureLink.href)
					}
				} else if (~host.indexOf('sciencedirect.')) {
					var sdPdfLink = document.getElementById('pdfLink') ||
						document.querySelector('.pdf-download-btn-link')
					sdPdfLink = sdPdfLink && sdPdfLink.href
					if (sdPdfLink) {
						// NOTE: see http://tools2.lsc.net:8181/browse/FCORE-11802
						F1000Global.autoImportAlternatePDF_middleware = 'sciencedirect'
						if (!/ShoppingCart/i.test(sdPdfLink)) {
							if (!/#$/.test(sdPdfLink)) {
								url = valid(sdPdfLink)
							} else {
								// hash url means js dropdown menu
								var url = null
								var b = document.querySelector('.pdf-download-btn-link')
								if (b) {
									// open
									b.click()
									// scrape
									var sdPdfLink = document.querySelector('.PdfDownloadButton .PdfDropDownMenu a')
									sdPdfLink = sdPdfLink && sdPdfLink.href
									// close
									F1000Global.triggerMouseEvent(document.body, 'mousedown')
									if (sdPdfLink) {
										url = valid(sdPdfLink)
									}
								}
							}
						}
					}
				} else if (
					~host.indexOf('.sagepub.') ||
					~host.indexOf('.frontiersin.')
				) {
					var plausiblePdfLink = Array.prototype.filter.call(
						document.querySelectorAll('a'),
						function (i) {
							return i.href.match(/pdf/i)
						}
					)[0]
					if (plausiblePdfLink) {
						url = valid(plausiblePdfLink.href)
					}
				} else if (~host.indexOf('.biorxiv.')) {
					var biorxivPdfLink = document.querySelector('.icon-external-link-sign')
					if (biorxivPdfLink &&
						biorxivPdfLink.parentNode &&
						biorxivPdfLink.parentNode.href) {
						url = valid(biorxivPdfLink.parentNode.href)
					}
				} else if (~host.indexOf('researchgate.')) {
					var rGateDownloadAnchor = document.querySelector('.content-page-header__navigation--actions a')
					if (rGateDownloadAnchor &&
						rGateDownloadAnchor.href) {
						url = valid(rGateDownloadAnchor.href)
					}
				} else if (~host.indexOf('freemagazinepdf.')) {
					var fmpDownloadAnchor = document.querySelector('.vk-att-item a')
					if (fmpDownloadAnchor &&
						fmpDownloadAnchor.href) {
						url = valid(fmpDownloadAnchor.href)
					}
				}
			}
		}

		// invalidation domain based, mostly paywalled links
		if (~host.indexOf('.cell.')) {
			if (document.querySelector('.toolPdf.denied')) {
				url = null
			}
		}
		// console.log('extractAlternatePDF', url)
		if (url &&
			url.length > 3) {
			if (window.location.href.indexOf('https') === 0) {
				url = makeHTTPS(url)
			}
			this.dominant.alternatePDF = url
		}
	},
	extractAbstract: function () {
		var dominant = this.dominant
		if (typeof dominant.articleAbstract === 'string' &&
			dominant.articleAbstract.length > 3) {
			return
		}
		// By citation
		var descriptionMeta = document.querySelector('meta[name="citation_description"]')
		var descriptionMetaContent = descriptionMeta && descriptionMeta.content
		if (descriptionMetaContent &&
			descriptionMetaContent.length > 3) {
			dominant.articleAbstract = descriptionMetaContent
			return
		}
		// By Rules
		var host = location.host
		var abstract = null
		if (
			host.indexOf('pubmed.ncbi.nlm.nih.') !== -1
		) {
			// pubmed2019
			var abstract = document.querySelector('.abstract p')
		}
		else if (
			host.indexOf('.biorxiv.') !== -1 ||
			host.indexOf('arxiv.') !== -1 ||
			host.indexOf('.oup.') !== -1 ||
			host.indexOf('.cambridge.') !== -1 ||
			host.indexOf('europepmc.') !== -1
		) {
			abstract = document.querySelector('.abstract')
		}
		else if (
			host.indexOf('.springer.') !== -1
		) {
			abstract = document.querySelector('.Abstract')
		}
		else if (
			host.indexOf('.wiley.') !== -1
		) {
			abstract = document.querySelector('.mainAbstract')
		}
		else if (
			host.indexOf('.sagepub.') !== -1 ||
			host.indexOf('.tandfonline.') !== -1
		) {
			abstract = document.querySelector('.abstractSection')
		}
		else if (
			host.indexOf('.degruyter.') !== -1
		) {
			abstract = document.querySelector('.articleBody_abstract')
		}
		else if (
			host.indexOf('.ingentaconnect.') !== -1
		) {
			abstract = document.querySelector('#Abst')
		}
		else if (
			host.indexOf('.ssrn.') !== -1
		) {
			abstract = document.querySelector('.abstract-text p')
		}
		// console.log('abstract', abstract)
		// Finally
		if (abstract && abstract.textContent) {
			dominant.articleAbstract = abstract.textContent.trim().replace(/^abstract:?\s?/i, '')
		}
	},
	// BEGIN FINALIZE
	finalize: function () {
		// Authora
		if (document.location.host.indexOf('authorea.com') !== -1) {
			this.pageType = 'ARTICLE'
			this.ignoreListCount = true
			this.dominant.id = (document.title || (document.location.host + document.location.pathname)).replace(/\|.*/g, '')
			this.dominant.pageTitle = this.dominant.id
			this.dominant.type = 'CompositeArticleId'
			// Exit from finalize 1
			return true
		}
		// Lens, always force article mode
		if (F1000Global.whitelisted === 'lens') {
			if (this.list.length > 0) {
				this.dominant = this.list.splice(0, 1)[0]
				this.pageType = 'ARTICLE'
				this.ignoreListCount = true
				// Exit from finalize 2
				return true
			}
		}
		// ARTICLES refinement
		if (this.pageType === 'ARTICLE') {
			this.ignoreListCount = true
			if (this.list.length !== 0) {
				if (this.list.length === 2 &&
					this.list[0].type !== this.list[1].type) {
					// only two references of different types, most likely two ids of the same article
					this.list = []
				} else {
					// always remove the top most it's the article itself
					this.list.splice(0, 1)
				}
				// ignore cited articles false positives from pubmed
				if (this.dominant.type === 'PubMedId') {
					if (this.dominant.uri.match(/\/pubmed\/[?term=]{0,}\w+/i)) {
						var isPubmed2017 = document.body.querySelector('h1.heading-title')
						if (isPubmed2017) {
							// pubmed 2017, remove duplicates
							this.list.splice(0, 1)
						} else {
							// pubmed old, ignore all
							this.list = []
						}
					}
					// This is the equivalent of x => x.innerText, but gulp is a dead project that doesn't support es6
					function innerTextFn(x) {
						return x.innerText
					}
					if (document.location.host.indexOf('europepmc.') !== -1) {
						var europepmcAuthors = document.querySelectorAll('.metadata--author-name')
						var arrEuropepmcAuthors = Array.from(europepmcAuthors).map(innerTextFn)
						this.dominant.authors = arrEuropepmcAuthors
					} else {
						var pubmedAuthorMeta =
							document.querySelector('meta[name="author"]') ||
							document.querySelector('meta[name="authors"]')
						if (pubmedAuthorMeta &&
							pubmedAuthorMeta.content) {
							this.dominant.authors = pubmedAuthorMeta.content.split(',')
						}
					}
				}
			}
			// extract article abstract
			this.extractAbstract()
			// console.log('dominant/abstract', this.dominant.articleAbstract)
			// extract extras - these are outside as can be used by many scrapers
			this.dominant.keywords = F1000Global.extraScraping.keywords()
			// console.log('dominant/keywords', this.dominant.keywords)
		}
		// Takes care of empty titles assigned as id, replacing them with the uri
		if (!this.dominant.id.trim()) this.dominant.id = window.location.href
		// extract alternate PDF for auto import
		this.extractAlternatePDF()
		// console.log('dominant/alternate', this.dominant.alternatePDF)
		// Exit from finalize 3
		return true
	},
	// END FINALIZE
	heuristic: function () {
		// XN this could be simplified to top entry heuristic only
		var items = this.list;
		// First
		items[0].marginalDistance = items[1].position - items[0].position;
		// Last
		items[items.length - 1].marginalDistance = items[items.length - 1].position - items[items.length - 2].position;
		// Many
		if (items.length > 2) {
			for (var i = 1; i < items.length - 1; i++) {
				var prev = items[i].position - items[i - 1].position;
				var next = items[i + 1].position - items[i].position;
				items[i].marginalDistance = (prev + next) / 2;
			}
		} else {
			// Two
			return this.dominant = items[0];
		}
		// item with max marginal distance
		var maxIndex = 0;
		for (var i = 0; i < items.length; i++) maxIndex = (items[i].marginalDistance > items[maxIndex].marginalDistance) ? i : maxIndex;
		var itemStanding = items[maxIndex];
		// average distance of items, except itemStanding
		var averageDistance = 0;
		for (var i = 0; i < items.length; i++) averageDistance += (i === maxIndex) ? 0 : items[i].marginalDistance;
		averageDistance = averageDistance / (items.length - 1);
		// check if item is standing considerably to set dominant
		// only if standing is first:
		if ((maxIndex === 0) && (itemStanding.marginalDistance >= averageDistance * 2)) this.dominant = itemStanding;
		// only if standing is in the upper part:
		//if ((itemStanding.marginalDistance >= averageDistance*2) && (maxIndex < items.length/2)) this.dominant = itemStanding;
	},
	targetContent: function (target, within) {
		var content
		if (F1000Global.framesetPage) {
			content = framesetGetMain()
			if (!(content && content.document && content.document[target])) return '';
			content = content.document[target][within]
		} else {
			content = document[target][within]
		}
		return content
	},
	matches: function (target, content, ignoreKnowList) {
		var capture = this.pattern.list[this.pattern.use].capture;
		var clean = this.pattern.list[this.pattern.use].clean;
		var cleanDeep = this.pattern.list[this.pattern.use].cleanDeep;
		var cleanDeepFlag = this.cleanDeep
		var decode = this.pattern.list[this.pattern.use].decode;
		var match, matches = [];
		var pattern = this.pattern.list[this.pattern.use][target];
		var patternType = this.pattern.list[this.pattern.use].type;
		var title = document.title || (document.location.host + document.location.pathname);
		var type = patternType;
		var referrer = document.referrer;
		var uri = window.location.href;
		// console.log('content length', content.length)
		while (match = pattern.exec(content)) {
			// console.log('m0 m1', match[0], match[1])
			// match capture
			var id = capture && match[1] ? match[1] : match[0]
			// clean
			if (clean) id = id.match(clean)
			if (!id) continue;
			id = id[0]
			// clean deeper levels, mainly for dois
			if (cleanDeepFlag && cleanDeep) {
				id = id.match(cleanDeep)
				if (!id) continue;
				id = id[0]
			}
			// decode
			if (decode) {
				id = safeDecodeURIComponent(id)
				if (!id) continue;
			}
			// pubmed namespace refinement
			if (patternType === 'PubMed') {
				if (match[0].indexOf('querykey') !== -1) continue; // Skip querykey occurrencies
				id = id.toUpperCase()
				type = (id.indexOf('PMC') !== -1) ? 'PubMedCentralId' : 'PubMedId' // Refines PubMed namespace
				if (type === 'PubMedId') {
					// FCORE-12801
					var asNumber = parseInt(id)
					if (isNaN(asNumber) || asNumber < 10) continue;
				}
			}
			// normalize
			var idCaseInsensitive = id.toLowerCase();
			// console.log('id', id)
			if (ignoreKnowList || this.known.indexOf(idCaseInsensitive) === -1) {
				matches.push({
					// Heuristic
					position: match.index,
					marginalDistance: 0,
					// Exporting
					id: id,
					type: type,
					uri: uri,
					pageTitle: title,
					referrer: referrer,
					// Metadata
					journal: null,
					authors: null,
					publisher: null,
					date: null,
					isbn: null
				});
				this.known.push(idCaseInsensitive);
			}
		}
		// console.log('matches', matches)
		return matches;
	},
	getMatchType: function (d) {
		// OPT-OUT FCORE-11384: when the word "journal" appears in the title
		var isPossibleJournalTitle = document.title && /journal/i.test(document.title)
		if (isPossibleJournalTitle) {
			return null
		}
		// Hints the server with the certainty of a matched id:
		// null/none default certain match
		// LOWER_BODY the server will do some heuristic on metadata
		if (d &&
			d.contentType &&
			typeof d.matchPosition === 'number' &&
			!F1000Global.framesetPage) {
			if (d.contentType === 'BODY') {
				var visibleContent = document.body.innerText || document.body.textContent
				var ratio = d.matchPosition / visibleContent.length
				if (ratio > .15) {
					// OPT-OUT RULE FCORE-11384: when the string ">Abstract<"" appears in the html
					var htmlContent = document.body.innerHTML
					var hasAbstractElement = />abstract</i.exec(htmlContent)
					if (hasAbstractElement) {
						return null
					}
					return 'LOWER_BODY'
				}
			}
		}
		return null
	},
	getDecodedAnchorsContent: function () {
		try {
			return decodeURIComponent(
				Array.prototype.reduce.call(
					document.body.querySelectorAll('a'),
					function (acc, i) {
						return acc + ' ' + i
					},
					'').replace(/%/g, '')
			).replace(/doi=/g, 'doi ')
		} catch (error) {
			console.log('F1000Annotator/getDecodedAnchorsContent/error', error.message)
			return ''
		}
	},
	getDecodedLocationHref: function () {
		try {
			return decodeURIComponent(location.href)
		} catch (error) {
			console.log('F1000Annotator/getDecodedLocationHref/error', error.message)
			return ''
		}
	},
	// this refs:
	// dominant, pageType, list, matchType, 

	// BEGIN SCAN
	scan: function (reset, useBodyContentProperty, useHeadContentProperty) {
		// external flag
		this.alreadyRunned = true
		// scraping vars
		var provisoryDominantType = null
		var title = document.title || (document.location.host + document.location.pathname)

		// blacklisted keeping any know from pior scans
		this.known = this.known.concat(this.blacklist)
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
			this.known = [].concat(this.blacklist)
		}
		// Exit 1, no document head, or no document body, or blacklisted
		// Nothing to scan or blacklisted
		if (!document.head ||
			!document.body ||
			F1000Global.blacklisted) {
			this.dominant = {
				id: title,
				type: "PageTitle",
				uri: window.location.href,
				pageTitle: title,
				referrer: document.referrer,
				// Metadata
				journal: null,
				authors: null,
				publisher: null,
				date: null,
				isbn: null
			};
			this.pageType = 'ARTICLE'
			// console.log("Exit from scan 1")
			return this.finalize();
		}
		//
		// BODY MATCH, uses all rules to grow a list of ids
		//
		// coins are to hard to merge to generic ids, so we assume if a page contain coins we can trust them
		var coins = F1000Global.coinsScanner()
		var usingCoins = false
		if (coins) {
			usingCoins = true
			// console.log('F1000Annotator: pageObjectIds/scan: using coins')
			// console.log(JSON.parse(JSON.stringify(coins)))
			this.list = coins
		} else {
			var bodyContent = this.targetContent('body', useBodyContentProperty || 'innerHTML') + this.getDecodedAnchorsContent()
			for (this.pattern.use = 0; this.pattern.use < this.pattern.list.length; this.pattern.use++) {
				var tempList = this.matches('body', bodyContent, false);
				this.list = this.list.concat(tempList)
			}
		}
		// console.log('list', JSON.stringify(this.list))
		// sort the mathces
		this.list.sort(function (a, b) { return a.position - b.position })
		// Ignore any used pattern, we will detect it later when matching the head and use that fir the heuristic flags on body matches
		this.pattern.use = 0;
		//
		// METADATA - may determine an article or just add information
		// var citationMetas = document.head.querySelectorAll("meta[name*='citation']")
		//
		// Try to scrape a citation_title, if so forces mode to Article
		var citationTitleMeta = document.head.querySelector('meta[name="citation_title"]') ||
			document.head.querySelector('meta[property="citation_title"]') ||
			document.head.querySelector('meta[name="dc.Title"]') ||
			document.head.querySelector('meta[property="dc.Title"]')

		if (citationTitleMeta) {
			// Title
			const citationTitleMetaContent = citationTitleMeta.content
			if (citationTitleMetaContent.length > 3) {
				// NOTE: we don't do proper ampersand escaping since we can't use innerHTML, but quotes at least.
				title = citationTitleMetaContent.replace(/&quot;/g, '"')
				this.pageType = 'ARTICLE'
				provisoryDominantType = 'CompositeArticleId'
				//F1000Global.articleForced = true
			}
		}

		const metadataObject = getMetadataObject(citationTitleMeta)

		// First try scraping head for citation_pmid meta or citation_doi
		var citationPmidMeta = document.head.querySelector('meta[name="citation_pmid"]') ||
			document.head.querySelector('meta[property="citation_pmid"]')
		// Lonely results on pubmed search
		if (!citationPmidMeta) {
			var pubmedResultsCount = document.head.querySelector('meta[name="ncbi_resultcount"]')
			if (pubmedResultsCount && pubmedResultsCount.content === '1') {
				var pubmedPutativeId = document.body.textContent.match(/PMID:\s*(\d+)/i)
				if (pubmedPutativeId) {
					pubmedPutativeId = pubmedPutativeId[1]
					if (pubmedPutativeId.length > 3) citationPmidMeta = { content: pubmedPutativeId }
				}
			}
		}
		// http://tools2.lsc.net:8181/browse/FCORE-11956
		function isValidPmid(s) {
			if (typeof s !== 'string') return false
			var cleanFromPMC = s.trim().replace(/pmc/i, '')
			return !/\D/.test(cleanFromPMC)
		}
		// Exit 2, pubmed data
		// use the pubmed meta
		if (citationPmidMeta &&
			citationPmidMeta.content &&
			isValidPmid(citationPmidMeta.content)) {
			// PMID
			this.dominant = Object.assign({
				id: citationPmidMeta.content,
				type: "PubMedId",
				uri: window.location.href,
				pageTitle: title,
				referrer: document.referrer,
			}, metadataObject);
			this.pageType = 'ARTICLE'
			// simple page title on pubmed is dirty so scrape the actual one
			var pubmedScrapedTitle = document.body.querySelector('.rprt.abstract h1')
			if (pubmedScrapedTitle && pubmedScrapedTitle.textContent.length > 3) this.dominant.pageTitle = pubmedScrapedTitle.textContent
			// makes sure a citation_doi doesn't get into the related articles
			var citationDOIMeta = document.head.querySelector('meta[name="citation_doi"]') ||
				document.head.querySelector('meta[property="citation_doi"]');
			if (citationDOIMeta && citationDOIMeta.content) {
				var duplicatedId = this.list.filter(function (i) { return i.id.indexOf(citationDOIMeta.content) !== -1 })
				if (duplicatedId) this.list.splice(this.list.indexOf(duplicatedId), 1)
			}
			// console.log("Exit from scan 2")
			return this.finalize();
		}

		var citationDOIMeta = document.head.querySelector('meta[name="citation_doi"]') ||
			document.head.querySelector('meta[property="citation_doi"]') ||
			document.head.querySelector('meta[name="dc.Identifier"][scheme="doi"]') ||
			document.head.querySelector('meta[property="dc.Identifier"][scheme="doi"]')
		if (citationDOIMeta && citationDOIMeta.content) {
			// DOI
			var citationDOIMetaMatch = citationDOIMeta.content.match(this.pattern.list[0].head);
			if (citationDOIMetaMatch && citationDOIMetaMatch.length > 0) {
				this.dominant = Object.assign({
					id: citationDOIMetaMatch[0],
					type: "DigitalObjectId",
					uri: window.location.href,
					pageTitle: title,
					referrer: document.referrer
				}, metadataObject);
				this.pageType = 'ARTICLE'
				// console.log("Exit from scan 3")
				return this.finalize();
			}
		}
		//
		// HEAD MATCH, 1 or more assume ARTICLE and quits.
		//
		this.pattern.set()
		// clean head from unwanted metas 1/2
		var dirtyMetas = []
		// tandfonline http://tools2.lsc.net:8181/browse/FCORE-11899
		if (document.head.querySelector('meta[name="pbContext"]')) {
			dirtyMetas.push(document.head.querySelector('meta[name="pbContext"]'))
		}
		if (dirtyMetas.length > 0) {
			dirtyMetas.forEach(function (i) {
				if (i.remove) i.remove()
			})
		}
		// actual head match
		var headContent = this.targetContent('head', useHeadContentProperty || 'innerHTML') + ' ' + this.getDecodedLocationHref()
		var metas = this.matches('head', headContent, true)
		// restore unwanted metas 2/2
		if (dirtyMetas.length > 0) {
			dirtyMetas.forEach(function (i) { document.head.appendChild(i) })
		}
		// head match results
		if (metas.length) {
			// Dominant
			this.dominant = metas[0];
			// Metadata
			Object.assign(this.dominant, metadataObject)
			// pubmed down helper code
			if (this.dominant.type === "PubMedId") {
				var pubmedScrapedTitle = document.body.querySelector('.rprt.abstract h1') ||
					document.body.querySelector('h1.heading-title')
				if (pubmedScrapedTitle) this.dominant.pageTitle = pubmedScrapedTitle.textContent.trim()
				// Never tested, if this goes into production it needs to be resilent of undefineds
				//var pubmedAuthorMeta = document.head.querySelector('meta[name="author"]')
				//var pubmedScrapedCitation = document.querySelector('.cit').textContent.split(';')[0].split('.')
				//var pubmedScrapedJournal = pubmedScrapedCitation[0]
				//var pubmedScrapedJournal = pubmedScrapedCitation[1]
			}
			// end of pubmed down helper code
			this.pageType = 'ARTICLE'
			// console.log("Exit from scan 4")
			return this.finalize();
		}
		//
		// BODY RESULTS HEURISTIC - assumes 0 PAGE, 1 ARTICLE, 2 or MANY HEURISTIC => ARTICLE/REFERENCES.
		//
		if (!this.list.length) {
			// 0 assume PAGE.
			this.dominant = Object.assign({
				id: title,
				type: provisoryDominantType || "PageTitle",
				uri: window.location.href,
				pageTitle: title,
				referrer: document.referrer
			}, metadataObject);
			this.pageType = 'ARTICLE'
			// console.log("Exit from scan 5")
			return this.finalize();
		}

		function setMatchTypeToBody() {
			this.dominant.matchType = this.getMatchType({
				contentType: 'BODY',
				matchPosition: this.dominant.position
			})
		}

		function notUsingCoins() {
			setMatchTypeToBody.call(this)
			// Metadata
			if (!usingCoins) {
				Object.assign(this.dominant, metadataObject)
			}
			this.pageType = 'ARTICLE'
		}

		function usePubmedScrapedTitle(querySelection) {
			var pubmedScrapedTitle = document.body.querySelector(querySelection)
			if (pubmedScrapedTitle) {
				this.dominant.pageTitle = pubmedScrapedTitle.textContent
				this.matchType = null
			}
		}

		if (this.list.length === 1) {
			// 1 assume ARTICLE.
			this.dominant = this.list[0];
			setMatchTypeToBody.call(this)
			// pubmed down helper code, override match
			if (this.dominant.type === 'PubMedId') {
				usePubmedScrapedTitle.call(this, '.rprt.abstract h1')
			}
			if (this.dominant.type === 'PubMedCentralId') {
				usePubmedScrapedTitle.call(this, '.rprt .title')
			}
			// console.log("Exit from scan 6")
			return this.finalize();
		} else {
			// 2 or many runs heurisitc:
			if (this.pattern.list[this.pattern.use].heuristic) {
				// the heuristic will set a dominant, and manage the 2 ids case
				this.heuristic();
			} else if (this.list.length === 2 && this.pattern.list[this.pattern.use].downmixStereo) {
				// we didn't run any heuristic so we resolve the 2 ids case according to pattern flags
				this.dominant = this.list[0];
				notUsingCoins.call(this)
			}
			// heuristic results
			if (this.dominant) {
				notUsingCoins.call(this)
			} else {
				// assume REFERENCES, list stays untouched.
				this.dominant = Object.assign({
					id: this.list[0].pageTitle,
					type: provisoryDominantType || "PageTitle",
					uri: this.list[0].uri,
					pageTitle: this.list[0].pageTitle,
					referrer: this.list[0].referrer
				}, metadataObject);
				if (!this.pageType) {
					// console.log("References")
					this.pageType = 'REFERENCES'
				}
			}
			// finalize them all
			// console.log("Exit from scan 7")
			return this.finalize();
		}
	}
}
// END SCAN
//
// Coins html encoded metadata
//
// SPEC: https://www.univie.ac.at/elib/index.php?title=COinS_Microfromat_Bibliographic_Metadata_for_Embedding_in_HTML
// TEST: wikipedia references usually contain Coins
//
F1000Global.coinsScanner = function () {
	function getPages(d) {
		var spage = d['rft.spage']
		if (spage) {
			var epage = d['rft.epage']
			if (epage) {
				return spage + '-' + epage
			} else {
				return spage
			}
		}
		return null
	}

	function getReferenceType(d) {
		var raw = d['rft.genre']
		if (raw) {
			if (raw.match(/book/i)) {
				return 'BOOK'
			}
		}
		return null
	}

	function parseId(d) {
		var raw = d['rft_id']
		if (raw) {
			if (raw.match(/^info:doi\//i)) {
				return {
					value: raw.replace(/^info:doi\//i, ''),
					type: 'DigitalObjectId'
				}
			}
			if (raw.match(/^info:pmid\//i)) {
				return {
					value: raw.replace(/^info:pmid\//i, ''),
					type: 'PubMedId'
				}
			}
		}
		return { value: null, type: 'CompositeArticleId' }
	}

	function getURI(d) {
		// URIs in coins are usually meaningless
		// we are gonna try scrape some well known ones
		// or default to current href
		var el = d.$element
		if (typeof el.closest === 'function') {
			// add well known here
			var usefulParent = el.closest('.result-list-record')
			if (usefulParent) {
				var link = usefulParent.querySelector('a')
				if (link && link.href && link.href.length > 3) {
					return link.href
				}
			}
		}
		return null
	}

	function getTitle(d) {
		var raw = d['rft.atitle'] || d['rft.btitle'] || d['rft.title'] || d['rft.jtitle']
		if (raw) {
			return raw.replace(/\/.*$/, '')
		}
		return null
	}

	function normalize(d) {
		// console.log('normalize', d)
		var uri = getURI(d)
		var title = getTitle(d)
		var referrer = document.referrer
		var parsedId = parseId(d)
		var id = parsedId.value || title
		var type = parsedId.type
		var authors = d['rft.au'] && d['rft.au'].split(/;|\|/)
		var date = d['rft.date']
		var isbn = d['rft.isbn']
		var issn = d['rft.issn']
		var journal = d['rft.jtitle']
		var publisher = d['rft.pub']
		var volume = d['rft.volume']
		var issue = d['rft.issue']
		var pages = getPages(d)
		var referenceType = getReferenceType(d)
		var r = {
			// Exporting
			id: id,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			referenceType: referenceType || null,
			journal: journal || null,
			authors: authors || null,
			publisher: publisher || null,
			volume: volume || null,
			issue: issue || null,
			pages: pages || null,
			date: date || null,
			isbn: isbn || null,
			issn: issn || null,
			resolved: {
				id: id || null,
				pageTitle: title || null,
				type: type || null,
				uri: uri || null
			}
		}
		return r
	}

	function collectKeyValue(acc, i) {
		var pair = i.split('=')
		var k = pair[0]
		var v = pair[1] ? pair[1].replace(/\+/g, ' ') : null
		acc[k] = v
		return acc
	}

	function collectCoin(acc, i) {
		try {
			var decoded = decodeURIComponent(i.title)
			var object = decoded.split('&').reduce(collectKeyValue, {})
			object.$element = i
			acc.push(object)
		} catch (e) {
			console.error('F1000Annotator/error', e.message)
		}
		return acc
	}

	function getCoins() {
		var results = Array.prototype.reduce.call(
			document.body.querySelectorAll('.Z3988'),
			collectCoin,
			[])
		return results
	}

	function parseCoins(list) {
		// console.log('parseCoins list', list)
		return list.map(normalize).filter(function (i) { return !!i.id })
	}

	if (location.host.indexOf('f1000') !== -1 ||
		location.host.indexOf('sciwheel') !== -1 ||
		location.host.indexOf('facultyopinions') !== -1 ||
		location.host.indexOf('facultyinternal') !== -1) {
		// blacklisted domains
		// console.log('F1000Annotator: coinsScanner blacklisted domain')
		var parsed = []
	} else {
		var parsed = parseCoins(getCoins())
	}

	return parsed.length > 0 ? parsed : null
}
// PubMed Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_pubmedSearch = {
	recommendationsSupport: {
		getConfig: function () {
			return {
				targetSelector: '.links',
				labelStyles: 'margin: -8px 15px 0 3px; position: absolute;'
			}
		}
	},
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		pubmedSearch: {
			item: {
				query: '.rslt'
			},
			authors: {
				query: '.supp > .desc',
				content: 'textContent',
				split: ','
			},
			uri: {
				query: '.title a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.title a',
				content: 'textContent',
				clean: null
			},
			type: 'PubMed'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		// Skip if not supported pubmed database
		if (pageURI.indexOf('/pmc') === -1 &&
			pageURI.indexOf('/pubmed') === -1) return;
		if (pageURI.indexOf('/pubmedhealth') !== -1) return;
		// Special rules according to display settings
		var displaySettings = document.querySelector('.display_settings')
		if (displaySettings &&
			displaySettings.textContent &&
			displaySettings.textContent.search(/Abstract/i) !== -1) {
			rules.uri.query = 'h1 a'
			rules.title.query = 'h1'
			rules.authors.query = '.auths'
		}
		// Scrape
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// may have here an extract function invoked with the query result
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)[rules.title.content]
			if (rules.title.clean) title = title.replace(rules.title.clean, '').trim()
			var publisher = null
			var date = null
			var journal = item.querySelector('.jrnl')
			if (journal) journal = journal.title
			var authors = item.querySelector(rules.authors.query)
			if (authors) authors = authors[rules.authors.content].split(rules.authors.split)
			var id = uri.match(/\d+/)[0]
			var type = (uri.indexOf('PMC') === -1) ? 'PubMedId' : 'PubMedCentralId'
			if (type === 'PubMedCentralId') id = "PMC" + id
			this.list.push({
				$el: item,
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		console.log("references 2")
		this.pageType = 'REFERENCES'
	}
}
// PubMed Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_pubmedSearch2019 = {
	recommendationsSupport: {
		getConfig: function () {
			var isAbstractView = location.href.match(/format=abstract/i)
			if (isAbstractView) {
				return {
					targetSelector: '.result-actions-bar',
					labelStyles: 'margin: 10px 15px 0 13px; float: right;'
				}
			} else {
				return {
					targetSelector: '.docsum-wrap',
					labelStyles: 'margin: 3px 15px 6px 0; float: left;'
				}
			}
		}
	},
	prevent_whitelist_forceReferencesResolve: true,
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		pubmedSearch2019: {
			item: {
				query: 'article'
			},
			type: 'PubMed'
		}
	},
	scan: function (reset) {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		var isAbstractView = location.href.match(/format=abstract/i)
		// Reset
		if (reset) {
			this.dominant = null
			this.list = []
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Scrape
		var perfectMatchContainer = document.querySelector('.matching-citations')
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			if (perfectMatchContainer) {
				if (perfectMatchContainer.contains(item)) {
					// discard perfect citation matching double results
					continue
				}
			}
			console.log(item)
			var titleEl = item.querySelector('h1 a') || item.querySelector('.docsum-content a')
			// console.log(item, titleEl)
			if (!titleEl) continue
			var uri = titleEl.href
			var title = titleEl.textContent.replace(/\n/g, '').trim()
			var id = uri.match(/\d+/)[0]
			var type = (uri.indexOf('PMC') === -1) ? 'PubMedId' : 'PubMedCentralId'
			if (type === 'PubMedCentralId') id = "PMC" + id
			var authors = null
			if (isAbstractView) {
				var authorsEls = item.querySelectorAll('.full-name')
				if (authorsEls && authorsEls.length > 0) {
					authors = Array.prototype.map.call(authorsEls, function (i) { return i.textContent.trim() })
				}
			} else {
				var authorsEl = item.querySelector('.docsum-authors')
				if (authorsEl && authorsEl.textContent && authorsEl.textContent.length > 3) {
					var authorsRaw = authorsEl.textContent
					authors = authorsRaw.replace('.', '').split(', ')
				}
			}
			var journal = null
			var issue = null
			var date = null
			if (isAbstractView) {
				var journalEl = item.querySelector('.journal-actions-trigger')
				if (journalEl && journalEl.textContent && journalEl.textContent.length > 3) {
					journal = journalEl.textContent.trim()
				}
				var infoEl = item.querySelector('.article-source .cit')
				if (infoEl && infoEl.textContent && infoEl.textContent.length > 3) {
					date = infoEl.textContent.replace(/;.*/, '')
					var issueMatch = infoEl.textContent.match(/;(\d+)/)
					if (issueMatch && issueMatch[1]) {
						issue = issueMatch[1].trim()
					}
				}
			} else {
				var infoEl = item.querySelector('.docsum-journal-citation')
				if (infoEl && infoEl.textContent && infoEl.textContent.length > 3) {
					var infoDotSplit = infoEl.textContent.split('.')
					journal = infoDotSplit[0] ? infoDotSplit[0] + '.' : null
					if (infoDotSplit[1]) {
						var infoSemicolonSplit = infoDotSplit[1].split(';')
						date = infoSemicolonSplit[0] ? infoSemicolonSplit[0].trim() : null
						if (infoSemicolonSplit[1]) {
							var issueMatch = infoSemicolonSplit[1].match(/\d+/)
							if (issueMatch) {
								issue = issueMatch[0] ? issueMatch[0].trim() : null
							}
						}
					}
				}
			}
			var articleAbstract = null
			var abstractEl = item.querySelector('.abstract-content') || item.querySelector('.full-view-snippet')
			if (abstractEl && abstractEl.textContent && abstractEl.textContent.length > 3) {
				articleAbstract = abstractEl.textContent.trim()
			}
			// console.log(type, id, uri, title, authors, journal, issue, date, articleAbstract)
			this.list.push({
				$el: item,
				// Exporting Type Specific
				articleAbstract: articleAbstract,
				authors: authors,
				journal: journal,
				issue: issue,
				date: date,
				publisher: null,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// PubMed Europe Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_pubmedEuropeSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		pubmedEuropeSearch: {
			item: {
				query: '.results_list_item'
			},
			authors: {
				query: 'meta[itemprop="name"]',
				content: 'textContent'
			},
			uri: {
				query: 'a.resultLink',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.results_list_citation_title',
				content: 'textContent',
				clean: null
			},
			id: {
				query: '.pmid'
			},
			type: 'PubMed'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Scrape
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// may have here an extract function invoked with the query result
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)[rules.title.content]
			if (rules.title.clean) title = title.replace(rules.title.clean, '').trim()
			var publisher = null
			var journal = null
			var date = null
			var authors = null
			var type = null
			var id = item.querySelector(rules.id.query)
			// id info in results or skip it
			if (id && id.textContent) {
				id = id.textContent
				// match the type namespace or skip item, later
				if (id.match(/pmid/i)) type = 'PubMedId';
				else if (id.match(/pmcid/i)) type = 'PubMedCentralId';
				else type = null;
				// match numeric id or skip item
				id = id.match(/\d+/)
				if (id && id[0]) id = id[0];
				else continue;
			} else {
				continue;
			}
			// "later"
			if (!type) continue;
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// ScienceDirect Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_scienceDirectSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		scienceDirectSearch: {
			item: {
				container: 'ol.results',
				query: '.detail'
			},
			authors: {
				query: '.authorTxt',
				content: 'textContent',
				split: ',',
				trim: true
			},
			journal: {
				query: '.source',
				content: 'textContent',
				split: {
					separator: ',',
					hold: '0'
				}
			},
			uri: {
				query: '.title a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.title a',
				content: 'textContent',
				clean: /☆/g
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// is volumeView search
		var volumeView = null
		var volumeEl = document.querySelector('.volumeHeader h2')
		if (volumeEl && volumeEl.childNodes && volumeEl.childNodes.length) {
			volumeView = {}
			if (volumeEl.childNodes[0] &&
				volumeEl.childNodes[0].textContent) volumeView.journal = volumeEl.childNodes[0].textContent
			var afterTitleText = ''
			for (var cni = 1; cni < volumeEl.childNodes.length; cni++)
				if (volumeEl.childNodes[cni].nodeType === 3) afterTitleText += volumeEl.childNodes[cni].textContent
			if (afterTitleText) {
				volumeView.date = afterTitleText.match(/\((.*\d{4})\)/)
				volumeView.date = volumeView.date && volumeView.date[1] ? volumeView.date[1] : null
				volumeView.volume = afterTitleText.match(/volume\s*(\d+)/i)
				volumeView.volume = volumeView.volume && volumeView.volume[1] ? volumeView.volume[1] : null
				volumeView.issue = afterTitleText.match(/issue\s*(\d+)/i)
				volumeView.issue = volumeView.issue && volumeView.issue[1] ? volumeView.issue[1] : null
			}
		}
		// scraper
		var type = rules.type
		var container = document.querySelector(rules.item.container)
		var items = container.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (rules.title.clean) title = title.replace(rules.title.clean, '').trim()
			var journalRaw = item.querySelector(rules.journal.query)
			journalRaw = journalRaw ? journalRaw[rules.journal.content] : null
			if (!journalRaw) continue;
			journalRaw = journalRaw.split(rules.journal.split.separator)
			var journal = journalRaw[rules.journal.split.hold] ? journalRaw[rules.journal.split.hold] : null
			var date = journalRaw[journalRaw.length - 2] ? journalRaw[journalRaw.length - 2] : null
			date = date ? trimmed(date) : null
			if (date && !date.match(/\d{4}/)) {
				date = journalRaw.join('').match(/\d{4}/)
				date = date && date[0] ? date[0] : null
			}
			var volume = journalRaw[1] ? journalRaw[1] : null
			volume = volume && volume.match(/volume/i) ? volume.replace(/volume/i, '') : null
			var issue = journalRaw[2] ? journalRaw[2] : null
			issue = issue && issue.match(/issue/i) ? issue.replace(/issue/i, '') : null
			var pages = journalRaw[journalRaw.length - 1] ? journalRaw[journalRaw.length - 1] : null
			pages = pages && pages.match(/page[s]?/i) ? pages.replace(/page[s]?/i, '') : null
			var authors = item.querySelector(rules.authors.query)
			if (!authors) authors = item.querySelector('.authors')
			authors = authors ? authors[rules.authors.content] : null
			if (authors) {
				authors = authors.split(rules.authors.split).map(function (a) {
					return trimmed(a);
				}.bind(this))
			} else {
				authors = []
			}
			if (volumeView) {
				journal = volumeView.journal
				date = volumeView.date
				volume = volumeView.volume
				issue = volumeView.issue
			}
			var publisher = null
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// ScienceDirect Search 2017
F1000Global.pageObjectIdsHandlers.htmlContentScanner_scienceDirectSearch2017 = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		scienceDirectSearch2017: {
			item: {
				container: 'ol.search-result-wrapper',
				query: '.result-item-content'
			},
			authors: {
				query: 'span.author',
				content: 'textContent'
			},
			uri: {
				query: 'h2 a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: 'h2',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		function trimmed(t) { return t ? t.trim() : null }
		function hasEtAliiContent(el) {
			try {
				return getComputedStyle(el, ':before')
					.getPropertyValue('content')
					.indexOf('…') !== -1
			} catch (err) {
				return null
			}
		}
		// Reset
		if (reset) {
			this.pageType = null
			this.dominant = null
			this.ignoreListCount = false
			this.list = []
		}
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var type = rules.type
		var container = document.querySelector(rules.item.container)
		var items = container.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (rules.title.clean) title = title.replace(rules.title.clean, '').trim()
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var infoContainer = item.querySelector('ol.SubType') || item.querySelector('div.SubType')
			var infoSpans = infoContainer.querySelectorAll('li span:first-child')
			var journalEl = infoSpans[0]
			if (journalEl && journalEl.textContent) journal = journalEl.textContent
			var volumeEl = infoSpans[1]
			if (volumeEl && volumeEl.textContent) {
				var volumeRaw = volumeEl.textContent
				var volumeSplit = volumeRaw.split(',')
				var volumeParse = volumeSplit[0]
				if (typeof volumeParse === 'string') {
					volumeParse = volumeParse.match(/[\d-]+/)
					if (volumeParse && volumeParse[0]) volume = volumeParse[0]
				}
				var issueParse = volumeSplit[1]
				if (typeof issueParse === 'string') {
					issueParse = issueParse.match(/[\d-]+/)
					if (issueParse && issueParse[0]) issue = issueParse[0]
				}
			}
			var dateEl = infoSpans[2]
			if (dateEl && dateEl.textContent) {
				date = dateEl.textContent.replace(/Available online\s+/i, '')
			}
			var pagesEl = infoSpans[3]
			if (pagesEl && pagesEl.textContent) {
				var pagesParse = pagesEl.textContent
				if (typeof pagesParse === 'string') {
					pagesParse = pagesParse.match(/[\d-]+/)
					if (pagesParse && pagesParse[0]) pages = pagesParse[0]
				}
			}
			var authorEls = item.querySelectorAll(rules.authors.query)
			var hasEtAli = false
			var authors = Array.prototype.map.call(authorEls, function (el) {
				if (hasEtAliiContent(el.parentNode)) hasEtAli = true
				return el.textContent
			})
			if (hasEtAli) authors.push('et al.')
			// console.log('journal', journal, 'volume', volume, 'issue', issue, 'date', date, 'pages', pages)
			var publisher = null
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Google Scholar
F1000Global.pageObjectIdsHandlers.htmlContentScanner_googleScholar = {
	recommendationsSupport: {
		getConfig: function () {
			return {
				targetSelector: '.gs_ggs.gs_fl',
				labelStyles: 'margin: 10px 15px 0 0; float: left;'
			}
		}
	},
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		googleScholar: {
			item: {
				query: '.gs_r'
			},
			authors: {
				et_al: '…',
				et_al_clean: /…/g
			},
			journal: {
				clean: '…'
			},
			infos: {
				query: '.gs_a'
			},
			uri: {
				query: '.gs_rt a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.gs_rt',
				content: 'textContent',
				clean: /\[[^\]]{0,16}\]/g
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		var isRTL = document.body.dir === 'rtl'
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// may have here an extract function invoked with the query result
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			var referenceType = null
			var titleEl = item.querySelector(rules.title.query)
			if (titleEl) {
				title = titleEl[rules.title.content]
				if (rules.title.clean) title = title.replace(rules.title.clean, '').trim()
				if (titleEl.textContent.match(/\[book\]/i)) {
					referenceType = 'BOOK'
				}
			} else {
				title = document.title || (document.location.host + document.location.pathname)
			}
			var authors = null
			var journal = null
			var date = null
			var publisher = null
			var infos = item.querySelector(rules.infos.query)
			if (infos) {
				infos = infos.textContent
				infos = infos.replace(/\s/g, ' ')
				infos = infos.split(' -')
				publisher = trimmed(infos.pop())
				var journalDate = trimmed(infos[1])
				var authorsRaw = trimmed(infos[0])
				if (journalDate) {
					journalDate = journalDate.split(',')
					var dateMatch = journalDate[1]
					if (dateMatch) {
						if (!isNaN(parseInt(dateMatch))) {
							date = trimmed(dateMatch)
						}
					}
					var journalMatch = journalDate[0]
					if (journalMatch) {
						if (!isNaN(parseInt(journalMatch))) {
							date = trimmed(journalMatch)
						} else {
							journal = trimmed(journalMatch)
						}
					}
				}
				if (authorsRaw) {
					var et_al = null
					if (authorsRaw.indexOf(rules.authors.et_al) !== -1) {
						et_al = 'et al.'
						authorsRaw = authorsRaw.replace(rules.authors.et_al_clean, '')
					}
					authors = authorsRaw
						.split(',')
						.map(trimmed)
						.filter(function (i) { return i })
					if (et_al) {
						authors.push(et_al)
					}
				}
			}
			// console.log(authors, journal, date, publisher)
			var id = title
			this.list.push({
				$el: item,
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referenceType: referenceType,
				referrer: referrer,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Webofknowledge
F1000Global.pageObjectIdsHandlers.htmlContentScanner_webofknowledgeSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		webofknowledgeSearch: {
			item: {
				query: '.search-results-item'
			},
			authors: {
				query: '.search-results-content div:nth-child(2)',
				clean: /By\:|; et al\.|\n/gi
			},
			infos: {
				query: '.search-results-content div:nth-child(3)'
			},
			uri: {
				query: '.search-results-content a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.search-results-content a value',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		var contentScope = document.body.querySelector('.search-results')
		var items;
		if (contentScope && contentScope.parentNode) {
			items = contentScope.parentNode.querySelectorAll(rules.item.query)
		} else {
			items = []
		}
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// may have here an extract function invoked with the query result
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (!title) continue;
			var authors = item.querySelector(rules.authors.query)
			if (authors && authors.textContent) {
				authors = authors.textContent.replace(rules.authors.clean, '')
				authors = authors.split(';')
				authors = authors.map(function (a) { return a.trim() })
			}
			var publisher = null
			var journal = null
			var date = null
			var volume = null
			var issue = null
			var pages = null
			var infos = item.querySelector(rules.infos.query)
			if (infos && infos.childNodes && infos.children) {
				var infosContent = infos.textContent
				volume = infosContent.match(/v\w*:\s*(\d+)/i)
				volume = volume && volume[1] ? volume[1] : null
				issue = infosContent.match(/i\w*:\s*(\d+)/i)
				issue = issue && issue[1] ? issue[1] : null
				pages = infosContent.match(/page\w*:\s*(\w+-?\w+)\s+/i)
				pages = pages && pages[1] ? pages[1] : null
				journal = infos.childNodes[0]
				journal = journal.textContent || ''
				journal = journal.trim()
				date = infos.children[infos.children.length - 1]
				date = date.textContent || ''
			}
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
F1000Global.pageObjectIdsHandlers.htmlContentScanner_webofknowledgeArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	ignoreListCount: true,
	scan: function () {
		pageObjectIds = F1000Global.pageObjectIdsHandlers.genericIdsScanner
		pageObjectIds.scan()
		var title = document.querySelector('.title')
		if (title && title.textContent) {
			pageObjectIds.dominant.pageTitle = title.textContent
			if (pageObjectIds.dominant.type === "PageTitle") {
				pageObjectIds.dominant.id = title.textContent
			}
		}
		var addInfo = document.querySelector('.block-record-info-source-values')
		if (addInfo && addInfo.textContent) {
			addInfo = addInfo.textContent.replace(/\n/g, ' ')
			var volume = addInfo.match(/v\w*:\s*(\d+)/i)
			volume = volume && volume[1] ? volume[1] : null
			var issue = addInfo.match(/i\w*:\s*(\d+)/i)
			issue = issue && issue[1] ? issue[1] : null
			var pages = addInfo.match(/page\w*:\s*(\w+-?\w+)\s+/i)
			pages = pages && pages[1] ? pages[1] : null
			pageObjectIds.dominant.volume = volume
			pageObjectIds.dominant.issue = issue
			pageObjectIds.dominant.pages = pages
		}
		pageObjectIds.pageType = 'ARTICLE'
	}
}
// Academic Research Microsoft
F1000Global.pageObjectIdsHandlers.htmlContentScanner_academicResearchMicrosoft = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		academicResearchMicrosoft: {
			item: {
				query: '.paper-item'
			},
			authors: {
				query: '.author-name-tooltip'
			},
			uri: {
				query: '.title-download a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.title-download a',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		// note: if document.body.querySelector('.paper-card') than it's a detail
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var volume = null
			var issue = null
			var pages = null
			// may have here an extract function invoked with the query result
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (!title) continue;
			var authors = item.querySelectorAll(rules.authors.query)
			authors = [].map.call(authors, function (a) { return a.textContent })
			var journal = item.querySelector('.conference-name')
			var date = null
			if (journal) {
				var dateRaw = journal.parentNode.querySelector('.year')
				if (dateRaw) {
					dateRaw = dateRaw.textContent
					if (dateRaw && dateRaw.length > 3) {
						volume = dateRaw.match(/,\s*vol.*?(\d+),/)
						volume = volume && volume[1] ? volume[1] : null
						issue = dateRaw.match(/,\s*no.*?(\d+),/)
						issue = issue && issue[1] ? issue[1] : null
						pages = dateRaw.match(/,\s*pp.*?(\d+-?\d+),/)
						pages = pages && pages[1] ? pages[1] : null
						dateRaw = dateRaw.match(/\d{4,}\.?$/)
						if (dateRaw) {
							date = dateRaw[0]
							if (date) date = date.replace('.', '')
						}
					}
				}
				journal = journal.textContent
			} else {
				var dateRaw = item.textContent
				if (dateRaw) {
					dateRaw = dateRaw.match(/published in \d{4,}/i)
					if (dateRaw) {
						dateRaw = dateRaw[0]
						dateRaw = dateRaw.match(/\d{4,}/)
						if (dateRaw) date = dateRaw[0]
					}
				}
			}
			var publisher = journal
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		var articlePage = window.location.href.match(/\/Publication\//i)
		if (!articlePage) {
			this.pageType = 'REFERENCES'
		} else {
			var articleDOI = document.querySelector('#ctl00_MainContent_PaperItem_hypDOIText')
			if (articleDOI && articleDOI.textContent && articleDOI.textContent.length > 3) {
				this.dominant.id = articleDOI.textContent
				this.dominant.type = 'DigitalObjectId'
			} else {
				this.dominant.type = 'CompositeArticleId'
			}
			this.pageType = 'ARTICLE'
		}
	}
}
// Academic Microsoft 2018 Search/Detail
F1000Global.pageObjectIdsHandlers.htmlContentScanner_academicMicrosoft2018 = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		academicMicrosoft2018: {
			item: {
				query: '.paper'
			}
		}
	},
	scan: function (reset) {
		if (reset) {
			this.list = []
			this.dominant = null
		}
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer
		}
		// Scrape
		var scraper = this._scrapeItem.bind(this)
		var isSearch = location.pathname.indexOf('/search') === 0
		var isDetail = location.pathname.indexOf('/paper') === 0
		if (isSearch) {
			this.pageType = 'REFERENCES'
			this.ignoreListCount = false
		} else if (isDetail) {
			this.pageType = 'ARTICLE'
			this.ignoreListCount = true
		}
		// Dominant
		if (isDetail) {
			var dominantItem = document.querySelector('.name-section') ||
				document.querySelector('ma-entity-detail-info')
			if (dominantItem) {
				var scrapedDominant = scraper(dominantItem, true)
				if (scrapedDominant) {
					// console.log('scraped dominant', scrapedDominant)
					this.dominant = scrapedDominant
				}
			}
		}
		// Matches
		var items = document.querySelectorAll(rules.item.query)
		// console.log('items', items)
		this.list = Array.prototype.reduce.call(items, function (acc, i) {
			var scraped = scraper(i)
			// console.log('scraped', scraped)
			if (scraped) {
				var resolved = {
					id: scraped.id,
					pageTitle: scraped.title,
					type: scraped.type,
					uri: scraped.uri
				}
				scraped.resolved = resolved
				acc.push(scraped)
			}
			return acc
		}.bind(this), [])
	},
	_scrapeItem: function (item, isDetail) {
		var shouldSkeepLastKeyword = false
		var d = {
			referrer: document.referrer,
			type: 'CompositeArticleId'
		}
		var rules = isDetail
			? {
				title: '.name',
				uri: null,
				date: 'ma-entity-detail-info .year',
				journal: 'ma-entity-detail-info .pub-name',
				authors: 'ma-entity-detail-info .author-item',
				abstract: 'ma-entity-detail-info p',
				keywords: 'ma-entity-detail-info .ma-tag'
			}
			: {
				title: 'a.title',
				uri: 'a.title',
				date: '.year',
				journal: '.publication .name',
				authors: '.author-item',
				abstract: null,
				keywords: '.ma-tag'
			}
		// scrape
		var uri = null
		if (rules.uri) {
			uri = item.querySelector(rules.uri)
			uri = uri ? uri.href : null
		} else {
			uri = location.href
		}
		var title = item.querySelector(rules.title)
		title = title ? title['textContent'].trim() : 'null'
		if (title) {
			var bookMatch = /\[book\]/i
			if (title.match(bookMatch)) {
				title = title.replace(bookMatch, '')
				d.referenceType = 'BOOK'
			}
		}
		// console.log('scrapeItem isDetail uri title', isDetail, uri, title)
		if (uri && title) {
			d.uri = uri
			d.id = d.title = d.pageTitle = title
		} else {
			return null
		}
		var date = null
		var dateEl = item.querySelector(rules.date)
		if (dateEl) {
			var dateValue = dateEl.title ? dateEl.title : dateEl.textContent
			if (dateValue) {
				dateValue = dateValue.trim()
				date = dateValue.replace(/(\d)\D+/g, '$1 ')
			}
		}
		d.date = date
		var journal = null
		var volume = null
		var issue = null
		var pages = null
		var journalEl = item.querySelector(rules.journal)
		if (journalEl && journalEl.textContent) {
			journal = journalEl.textContent.trim()
		}
		d.publisher = d.journal = journal
		d.volume = volume
		d.issue = issue
		d.pages = pages
		var authors = null
		var authorsList = item.querySelectorAll(rules.authors)
		var validAuthors = Array.prototype.reduce.call(authorsList, function (acc, i) {
			var content = i.textContent.replace(/\d/g, '').trim()
			if (content.length > 0 && content.indexOf(')') === -1) {
				acc.push(content)
			}
			return acc
		}, [])
		if (validAuthors.length > 0) {
			authors = validAuthors
		}
		d.authors = authors
		var articleAbstract = null
		var articleAbstractEl = item.querySelector(rules.abstract)
		if (articleAbstractEl) {
			var articleAbstractValue = articleAbstractEl.textContent
			if (articleAbstractValue && articleAbstractValue.length > 3) {
				articleAbstract = articleAbstractValue.trim()
			}
		}
		d.articleAbstract = articleAbstract
		var keywords = null
		var keywordsElList = (isDetail ? document : item).querySelectorAll(rules.keywords)
		var validKeywords = Object.keys(
			Array.prototype.reduce.call(keywordsElList, function (acc, i, index, arr) {
				if (shouldSkeepLastKeyword && index === arr.length - 1) {
					return acc
				}
				var content = i.textContent.trim()
				if (content.length > 0) {
					acc[content] = true
				}
				return acc
			}, {})
		)
		if (validKeywords.length > 0) {
			keywords = validKeywords.join(', ')
		}
		d.keywords = keywords
		this._extractIds(d, item)
		// console.log(d)
		return d
	},
	_extractIds: function (d, el) {
		var raw = el.innerHTML
		// doi
		var hasDOI = raw.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
		// console.log(hasDOI)
		if (hasDOI) {
			d.id = hasDOI[0]
			d.type = 'DigitalObjectId'
		} else {
			// books isbn/issn
			var hasISBN = raw.match(/isbn\s+?:?\s+?[\d-]{1,}/i)
			if (hasISBN) {
				d.isbn = hasISBN[0].replace(/isbn\s+?:?\s+?/i, '').trim()
				d.referenceType = 'BOOK'
			}
			var hasISSN = raw.match(/issn:?\s+?[\d-]{1,}/i)
			if (hasISSN) {
				d.issn = hasISSN[0].replace(/issn:?\s+?/i, '').trim()
				d.referenceType = 'BOOK'
			}
		}
	}
}
// Arxiv Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_arxivSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		arxivSearch: {
			item: {
				query: '.arxiv-result'
			},
			authors: {
				query: '.authors a'
			},
			uri: {
				query: 'a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.title',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		// note: if document.body.querySelector('.paper-card') than it's a detail
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// may have here an extract function invoked with the query result
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			title = title.replace(/Title:/gi, '').trim()
			if (!title) continue;
			var authors = Array.prototype.map.call(
				item.querySelectorAll(rules.authors.query),
				function (i) {
					return i.textContent
				}
			)
			var authors$ = item.querySelector('.authors')
			if (authors$ && authors$.textContent.indexOf('et al.') !== -1) {
				authors.push('et al.')
			}
			var date = null
			var dateMatch = item.textContent.match(/submitted\s(.*);/i)
			if (dateMatch && dateMatch[1]) {
				date = dateMatch[1].replace(/[-,.]/g, '').replace(/;.*/, '').trim()
			}
			var volume = null
			var issue = null
			var pages = null
			var journal = null
			var publisher = null
			// journal ref info line exist but is arbitrary syntax
			var abstract = item.querySelector('.abstract-full')
			if (abstract) {
				abstract = abstract.textContent.replace('△ Less', '').trim()
			}
			var doi = null
			var controlEl = item.querySelector('.control')
			if (controlEl) {
				var _doi = controlEl.textContent.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
				if (_doi && _doi[0] && _doi[0].length > 3) {
					doi = _doi[0]
					id = doi
				}
			}
			var id = doi ? doi : title
			var _type = doi ? 'DigitalObjectId' : type
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: _type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				articleAbstract: abstract,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Highwire Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_highwireSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		highwireSearch: {
			item: {
				query: 'td[valign=top]',
				parent: true,
				content: 'children'
			},
			infosParent: {
				query: 'td:nth-child(5)'
			},
			infos: {
				query: 'font:nth-child(3)',
				content: 'textContent',
				clean: / and /gi
			},
			uri: {
				query: 'td:nth-child(8) a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: 'font:nth-child(2)',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		var items = document.querySelector(rules.item.query)
		if (items) {
			items = items[rules.item.content]
		} else {
			items = []
		}
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// Fallback
			var id = null
			var uri = null
			var title = null
			var authors = null
			var journal = null
			var date = null
			var volume = null
			var issue = null
			var pages = null
			// Scrape
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			var infosParent = item.querySelector(rules.infosParent.query)
			if (!infosParent) continue;
			var title = infosParent.querySelector(rules.title.query)
			if (!title) continue;
			title = trimmed(title[rules.title.content])
			if (!title) continue;
			var infos = infosParent.querySelector(rules.infos.query)
			infos = trimmed(infos[rules.infos.content])
			if (infos) {
				infos = infos.split('\n')
				if (infos.length) {
					authors = infos[0]
					journal = infos[1]
					date = infos[2]
					pages = infos.length > 2 ? infos[infos.length - 1] : null
					if (authors) {
						authors = authors.replace(' and ', '')
						authors = authors.split(',')
					}
					if (journal) {
						journal = journal.replace(/[,;]/g, '')
						journal = trimmed(journal)
					}
					if (date) {
						date = date.replace(/[^\d]|[,;]/g, '')
						date = trimmed(date)
					}
					if (pages) {
						pages = pages.match(/\d+\s*-\s*\d+/)
						pages = pages && pages[0] ? pages[0] : null
						if (pages) {
							// we had pages good chances are we are gonna have volume
							if ((infos.length - 2) !== 2) {
								volume = infos[infos.length - 2]
								volume = volume.match(/\d+/)
								volume = volume && volume[0] ? volume[0] : null
							}
						}
					}
				}
			}
			var publisher = journal
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// ACM Digital Library Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_ACMDigitalLibrarySearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		ACMDigitalLibrarySearch: {
			items: {
				query: '.details'
			},
			uri: {
				query: 'a'
			},
			title: {
				query: 'a'
			},
			authors: {
				query: '.authors'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		var items = document.querySelectorAll(rules.items.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// console.log(item)
			// Fallback
			var authors = null
			var journal = null
			var publisher = null
			var date = null
			var volume = null
			var issue = null
			var pages = null
			var articleAbstract = null
			var keywords = null
			// Scrape
			var uri = item.querySelector(rules.uri.query)
			if (uri && uri.href) uri = uri.href
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			if (title && title.textContent) title = title.textContent
			if (!title) continue;
			var authors$ = item.querySelector(rules.authors.query)
			if (authors$ && authors$.textContent) {
				authors$ = authors$.textContent.split(',')
				if (authors$ && authors$.length && authors$.length > 0) {
					authors = authors$
					authors = authors.map(function (a) { return trimmed(a) }).filter(function (a) { return a ? true : false })
					if (authors.length === 0) authors = null
				}
			}
			var date$ = item.querySelector('.publicationDate')
			if (date$) {
				if (date$.textContent) {
					date = date$.textContent.trim().replace(/[^\d]/g, '')
				}
				var source$ = date$.nextElementSibling
				if (source$ && source$.textContent) {
					source$ = source$.textContent.trim()
					journal = source$
					// extras
					volume = source$.match(/volume\s+(\d+)/i)
					volume = volume && volume[1] ? volume[1] : null
					issue = source$.match(/issue\s+([a-zA-Z0-9-]*)/i)
					issue = issue && issue[1] ? issue[1] : null
					pages = source$.match(/pages?\s+(\d+-?\d+)/i)
					pages = pages && pages[1] ? pages[1] : null
					if (volume || issue || pages) {
						journal = journal.replace(/:.*?$/, '').trim()
					}
				}
			}
			var publisher$ = item.querySelector('.publisher')
			if (publisher$ && publisher$.textContent) {
				publisher = publisher$.textContent.replace(/publisher:?/i, '').trim()
			}
			var articleAbstract$ = item.querySelector('.abstract')
			if (articleAbstract$ && articleAbstract$.textContent) {
				articleAbstract = articleAbstract$.textContent.replace(/abstract:?/i, '').trim()
			}
			var keywords$ = item.querySelector('.kw')
			if (keywords$ && keywords$.textContent) {
				keywords = keywords$.textContent.replace(/keywords?:?/i, '').trim()
			}
			// console.log('date', date)
			// console.log('journal', journal)
			// console.log('volume', volume)
			// console.log('issue', issue)
			// console.log('pages', pages)
			// console.log('publisher', publisher)
			// console.log('abstract', articleAbstract)
			// console.log('keywords', keywords)
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				articleAbstract: articleAbstract,
				keywords: keywords,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Scopus Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_scopusSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		scopusSearch: {
			items: {
				query: 'ul#documentListUl > li'
			},
			uri: {
				query: '.docTitle a'
			},
			title: {
				query: '.docTitle a'
			},
			authors: {
				query: '.dataCol3 a'
			},
			date: {
				query: '.dataCol4 span'
			},
			journal: {
				query: '.dataCol5 a'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		var items = document.querySelectorAll(rules.items.query)
		for (var i = 0; i < items.length; i++) {
			var volume = null
			var issue = null
			var pages = null
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			if (!uri) continue;
			uri = uri.href
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title.textContent
			var authors = item.querySelectorAll(rules.authors.query)
			if (authors && authors.length > 0) {
				var authorsRoot = authors[0].parentNode
				authors = [].map.call(authors, function (a) {
					return a.textContent.replace(/[,]/g, ' ')
				})
				if (authorsRoot && authorsRoot.textContent) {
					var et_al = authorsRoot.textContent.match(/\(\.\.\.\)/)
					if (et_al) authors.push('et al.')
				}
			} else {
				authors = null
			}
			var journal = item.querySelector(rules.journal.query)
			if (journal) {
				var addInfo = journal.nextElementSibling
				if (addInfo && addInfo.textContent) {
					addInfo = addInfo.textContent
					volume = addInfo.match(/\s*(\d+)/)
					volume = volume && volume[1] ? volume[1] : null
					issue = addInfo.match(/\s+\((\d+)\)|,\s+(\d+),/)
					if (issue) {
						if (issue[1]) issue = issue[1]
						else if (issue[2]) issue = issue[2]
						else issue = null
					}
					pages = addInfo.match(/p[\D]*(\d+-?\d+)/)
					pages = pages && pages[1] ? pages[1] : null
				}
				journal = journal.textContent.trim()
			}
			var date = item.querySelector(rules.date.query)
			if (date) date = date.textContent.trim()
			var publisher = journal
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Scopus Search 2017 
F1000Global.pageObjectIdsHandlers.htmlContentScanner_scopusSearch2017 = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		scopusSearch2017: {
			items: {
				query: 'tbody tr.searchArea'
			},
			uri: {
				query: 'a'
			},
			title: {
				query: 'a'
			},
			authors: {
				query: 'a[title="Show author details"]'
			},
			date: {
				query: 'td:nth-child(4)'
			},
			journal: {
				query: 'td:nth-child(5) a'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		function trimmed(t) { return t ? t.trim() : null }
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var items = document.querySelectorAll(rules.items.query)
		for (var i = 0; i < items.length; i++) {
			var type = rules.type
			var volume = null
			var issue = null
			var pages = null
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			if (!uri) continue;
			uri = uri.href
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title.textContent
			var authors = item.querySelectorAll(rules.authors.query)
			if (authors && authors.length > 0) {
				var authorsRoot = authors[0].parentNode
				authors = [].map.call(authors, function (a) {
					return a.textContent.replace(/[,]/g, ' ')
				})
				if (authorsRoot && authorsRoot.textContent) {
					var et_al = authorsRoot.textContent.match(/\(\.\.\.\)/)
					if (et_al) authors.push('et al.')
				}
			} else {
				authors = null
			}
			var journal = item.querySelector(rules.journal.query)
			if (journal && journal.textContent) {
				var addInfo = journal.nextElementSibling
				if (addInfo && addInfo.textContent) {
					addInfo = addInfo.textContent
					volume = addInfo.match(/\s*(\d+)/)
					volume = volume && volume[1] ? volume[1] : null
					issue = addInfo.match(/\s+\((\d+)\)|,\s+(\d+),/)
					if (issue) {
						if (issue[1]) issue = issue[1]
						else if (issue[2]) issue = issue[2]
						else issue = null
					}
					pages = addInfo.match(/p[\D]*(\d+-?\d+)/)
					pages = pages && pages[1] ? pages[1] : null
				}
				journal = journal.textContent.trim()
			}
			var date = item.querySelector(rules.date.query)
			if (date && date.textContent) date = date.textContent.trim()
			var publisher = journal
			var id = title
			var itemLinks = item.nextElementSibling
			var stableURI = null
			if (itemLinks &&
				itemLinks.id &&
				itemLinks.id.indexOf('resultLink') !== -1) {
				stableURI = itemLinks.querySelector('.divTextLink a')
				if (stableURI &&
					stableURI.href &&
					stableURI.href.length > 8 &&
					stableURI.style &&
					stableURI.style.display !== 'none') {
					uri = stableURI.href
					var decoded = decodeURIComponent(uri)
					// console.log('decoded uri', uri)
					if (decoded) {
						var doiMatch = decoded.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
						if (doiMatch && doiMatch[0]) {
							id = doiMatch[0]
							type = 'DigitalObjectId'
						}
					}
				}
			}
			// console.log(title, uri, authors, date)
			// console.log(volume, issue, pages, journal)
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Pro Quest Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_proQuestSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		proQuestSearch: {
			item: {
				query: '.results_list_copy'
			},
			infos: {
				query: '.titleAuthorETC'
			},
			uri: {
				query: '.previewTitle',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.previewTitle',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		// note: if document.body.querySelector('.paper-card') than it's a detail
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			uri = uri.replace(/\?.*/, '')
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (!title) continue;
			var infos = item.querySelectorAll(rules.infos.query)
			var authors = null
			var journal = null
			var date = null
			var volume = null
			var issue = null
			var pages = null
			// Authors
			if (infos[0]) {
				authors = infos[0].textContent.split(';')
				if (authors.length > 0) authors = authors.map(function (a) {
					a = a.replace(/[^\w ]/g, '').replace(/^ /, '')
					if (!a.match(/et\sal/gi)) {
						var aParts = a.split(' ')
						a = ''
						for (var ai = 1; ai < aParts.length; ai++) a += aParts[ai][0]
						a += ' ' + aParts[0]
					} else {
						a = 'et al.'
					}
					return a
				})
			}
			// Journal and date
			if (infos[1]) {
				journal = infos[1].querySelector('strong')
				if (journal) journal = journal.textContent
				date = /\((.*)\)/g.exec(infos[1].textContent)
				date = date && date[1] ? date[1] : null
				if (date) {
					var dParts = date.split(',')
					var dY = '', dM = '', dD = '';
					if (dParts.length > 1) {
						dY = dParts[1].replace(' ', '')
						dM = dParts[0].replace(/[ *]|\d*/g, '')
						dD = dParts[0].replace(/[ *]|[a-zA-Z]*/g, '')
					} else {
						dParts = dParts[0].split(' ')
						if (dParts.length > 1) {
							dY = dParts[1]
							dM = dParts[0]
						} else {
							dY = dParts[0]
						}
					}
					date = dY
					if (dM) date += ' ' + dM
					if (dD) date += ' ' + dD
				}
				var volumeIssue = infos[1].textContent.match(/\d+.\d+/)
				if (volumeIssue && volumeIssue[0]) {
					volumeIssue = volumeIssue[0].split('.')
					if (volumeIssue[0]) volume = volumeIssue[0]
					if (volumeIssue[1]) issue = volumeIssue[1]
				}
				var pages = infos[1].textContent.match(/:\s*(\d+-?\d+)/)
				pages = pages && pages[1] ? pages[1] : null
			}
			var publisher = journal
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Pro Quest Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_proQuestArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = null
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		var authors = null
		var date = null
		var publisher = null
		var journal = null
		var volume = null
		var issue = null
		var pages = null
		// scraping
		var item = document.body.querySelector('.docViewFullCitation')
		var rows = item.querySelectorAll('.display_record_indexing_fieldname')
		for (var r = 0; r < rows.length; r++) {
			var fieldValue = rows[r].nextSibling
			var fieldLabel = rows[r].textContent
			if (fieldLabel) fieldLabel = fieldLabel.replace(/\s/g, '').toLowerCase()
			if (fieldValue && fieldLabel) {
				switch (fieldLabel) {
					case 'title':
						title = fieldValue.textContent
						break;
					case 'author':
						authors = fieldValue.textContent
						break;
					case 'year':
						date = fieldValue.textContent
						break;
					case 'publicationtitle':
						// NOTE: omitted as per http://tools2.lsc.net:8181/browse/FCORE-11040
						// journal = fieldValue.textContent
						break;
					case 'publisher':
						publisher = fieldValue.textContent
						break;
					case 'doi':
						id = fieldValue.textContent.match(/10\..*/)
						if (id && Array.isArray(id)) id = id[0]
						type = 'DigitalObjectId'
						break;
					case 'documenturl':
						uri = fieldValue.textContent.replace(/\?.*/, '')
						break;
					case 'volume':
						volume = fieldValue.textContent
						break;
					case 'issue':
						issue = fieldValue.textContent
						break;
					case 'pages':
						pages = fieldValue.textContent
						break;
					default:
						continue;
				}
			}
		}
		// Authors refine
		if (authors && authors.split) {
			authors = authors.split('; ')
			authors = authors.map(function (a) {
				var parts = a.split(', ')
				var last = parts[0]
				var initials = ''
				if (parts.length > 1) {
					initials = parts[1].split(' ')
					initials = initials.map(function (i) { return i[0] })
					initials = initials.join('')
					initials = initials + ' '
				}
				return initials + last
			})
		}
		// Dominant
		this.dominant = {
			id: id || title,
			type: type,
			uri: uri || pageURI,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: journal,
			authors: authors,
			publisher: publisher,
			date: date,
			isbn: null,
			volume: volume,
			issue: issue,
			pages: pages
		};
		this.pageType = 'ARTICLE'
	}
}
// Worldcat Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_worldcatSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		worldcatSearch: {
			item: {
				query: '.result.details'
			},
			authors: {
				query: '.author'
			},
			uri: {
				query: '.name a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.name a',
				content: 'textContent',
				clean: null
			},
			publication: {
				query: 'div'
			},
			type: 'CompositeArticleId'
		}
	},
	observe: {
		observer: null,
		observerTarget: null,
		observerOptions: { childList: true, subtree: true }
	},
	scan: function (reset) {
		if (reset) {
			this.dominant = null
			this.libraryItemId = null
			this.list = []
		}
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		// note: if document.body.querySelector('.paper-card') than it's a detail
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			uri = uri.replace(/\&.*/, '')
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (!title) continue;
			var authors = item.querySelector(rules.authors.query)
			if (authors && authors.textContent) {
				authors = authors.textContent.replace(/by/i, '').replace(/\./g, '').replace(/\(.*\)/g, '')
				authors = authors.split(';')
				authors = authors.map(function (i) { return i.trim() })
				authors = authors.filter(function (i) { return i })
			}
			var journal = null
			var date = null
			var volume = null
			var issue = null
			var pages = null
			var publication = null
			var publicationParts = []
			var publication$ = item.querySelectorAll(rules.publication.query)
			if (publication$.length > 0) {
				publication$ = [].filter.call(publication$, function (p) {
					return p.textContent && p.textContent.match(/Publication:|Publisher:|Database:/i)
				})
				if (publication$.length > 0) publication = publication$[0].textContent.replace(/Publication:|Publisher:|Database:/i, '')
			}
			if (publication) {
				journal = publication.match(/[^,]*/)
				journal = journal && journal[0] ? journal[0] : null
				if (journal) journal = journal.trim()
				date = /,.*(\d{4}).*/.exec(publication)
				date = date && date[1] ? date[1] : null
				volume = /v\.\s*(\d+)|vol\.?\s*(\d+)|volume\s*(\d+)/i.exec(publication)
				volume = volume && volume[1] ? volume[1] : null
				issue = /no\.\s*(\d+)|issue\s*(\d+)/i.exec(publication)
				issue = issue && issue[1] ? issue[1] : null
				pages = /pp?\.?\s*(\d+\-?\d*)|pages\s*(\d+\-?\d*)/i.exec(publication)
				pages = pages && pages[1] ? pages[1] : null
			}
			var publisher = journal
			var id = title
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
		// Lazy searches
		function lastListener(e) {
			// XN may use a timeout watcher
			pageObjectIds && pageObjectIds.scan && pageObjectIds.scan(true)
			popup && popup.update()
		}
		if (!this.observe.observer) {
			this.observe.observerTarget = document.querySelector('#results')
			this.observe.observer = new MutationObserver(lastListener)
			this.observe.observer.observe(this.observe.observerTarget, this.observe.observerOptions)
		}
	}
}
// Worldcat Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_worldcatArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var uri = pageURI.replace(/\&.*/, '')
		var referrer = document.referrer
		var authors = null
		var date = null
		var journal = null
		var publisher = null
		var volume = null
		var issue = null
		var isbn = null
		var referenceType = null
		// scraping
		var coin = null
		var coins = F1000Global.coinsScanner()
		if (coins && coins[0]) {
			coin = coins[0]
			// console.log('coin', coin)
		} else {
			coin = {}
		}
		if (coin.title) {
			title = coin.title
		} else {
			var title$ = document.querySelector('h1.title')
			if (title$ && title$.textContent) title = title$.textContent
		}
		if (coin.authors) {
			authors = coin.authors
		} else {
			var authors$ = document.querySelector('#bib-author-cell')
			if (authors$ && authors$.textContent) {
				authors$ = authors$.textContent
				authors = authors$.replace(/\./g, '').replace(/\(.*\)/g, '').split(';')
				authors = authors.map(function (i) {
					i = i.trim()
					if (i.match(/et\sal/gi)) i = 'et al.'
					return i
				})
				authors = authors.filter(function (i) { return i && !i.match(/all\sauthors/gi) })
			}
		}
		var publication = document.querySelector('#bib-journalTitle-cell')
		if (publication && publication.textContent) {
			publication = publication.textContent
			journal = publication.match(/[^,]*/)
			journal = journal && journal[0] ? journal[0] : null
			if (journal) {
				journal = journal.trim()
				publisher = journal
			}
			date = /,.*(\d{4}).*/.exec(publication)
			date = date && date[1] ? date[1] : null
			volume = /vol.?\s*(\d+)/i.exec(publication)
			volume = volume && volume[1] ? volume[1] : null
			issue = /issue\s*(\d+)/i.exec(publication)
			issue = issue && issue[1] ? issue[1] : null
		}
		// override with coins
		if (coin.journal) {
			journal = coin.journal
			publisher = journal
		}
		if (coin.date) {
			date = coin.date
		}
		if (coin.volume) {
			volume = coin.volume
		}
		if (coin.issue) {
			issue = coin.issue
		}
		if (coin.isbn) {
			isbn = coin.isbn
			referenceType = 'BOOK'
		}
		var id = title
		if (typeof publication === 'string') {
			var doiMatchInPublication = publication.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
			if (doiMatchInPublication && doiMatchInPublication[0]) {
				id = doiMatchInPublication[0]
				type = 'DigitalObjectId'
			}
		}
		// Dominant
		this.dominant = {
			id: id,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			referenceType: referenceType,
			// Metadata
			journal: journal,
			authors: authors,
			publisher: publisher,
			date: date,
			isbn: isbn,
			volume: volume,
			issue: issue,
		};
		this.pageType = 'ARTICLE'
	}
}
// NIH Library Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_nihLibrarySearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		nihLibrarySearch: {
			item: {
				query: '.briefCitRow'
			},
			infos: {
				query: '.briefcitDetail'
			},
			uri: {
				query: '.briefcitTitle a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.briefcitTitle',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	observe: {
		observer: null,
		observerTarget: null,
		observerOptions: { childList: true, subtree: true }
	},
	scan: function (reset) {
		if (reset) {
			this.dominant = null
			this.libraryItemId = null
			this.list = []
		}
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		// note: if document.body.querySelector('.paper-card') than it's a detail
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			uri = uri//.replace(/\&.*/, '')
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (!title) continue;
			title = title.replace(/\n/g, '')
			var authors = null
			var journal = null
			var date = null
			var id = title
			var useType = null
			var referenceType = null
			var infos = item.querySelector(rules.infos.query)
			if (infos) {
				var infosRaw = [].reduce.call(infos.childNodes, function (p, c) {
					return typeof c !== 'undefined' && c.nodeType === 3 ? p + c.textContent : p
				})
				infosRaw = infosRaw.split ? infosRaw.split(':') : null
				if (infosRaw.length > 0) {
					infosRaw = infosRaw[infosRaw.length - 1]
					journal = infosRaw.split(',')[0]
					date = /,.*(\d{4}).*/.exec(infosRaw)
					date = date && date[1] ? date[1] : null
				}
				// eventually authors
				var authorsRaw = infos.querySelector('br')
				if (authorsRaw && authorsRaw.nextSibling && authorsRaw.nextSibling.nodeType === 3) {
					authors = authorsRaw.nextSibling.textContent.split('.')
					authors = authors[0] ? [authors[0]] : null
				}
				// eventually a doi
				var id$ = /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi.exec(infos.innerHTML)
				if (id$ && id$.length > 1) {
					useType = 'DigitalObjectId'
					id = id$[1]
				}
				// supposedly a book?
				var cit$ = infos.querySelector('.briefcitItems')
				if (cit$) {
					if (cit$.textContent.match(/book/gi)) referenceType = 'BOOK'
				}
			}
			var publisher = journal
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: useType || type,
				referenceType: referenceType,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				resolved: {
					id: id,
					pageTitle: title,
					type: useType || type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// NIH Library Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_nihLibraryArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = null
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		var authors = []
		var date = null
		var publisher = null
		var journal = null
		var isbn = null
		// scraping
		var item = document.body.querySelector('.bibInfoEntry')
		var rows = item.querySelectorAll('.bibInfoData')
		var inAuthorsList = false
		for (var r = 0; r < rows.length; r++) {
			var fieldValue = rows[r]
			var fieldLabel = rows[r].previousElementSibling
			if (fieldLabel) fieldLabel = fieldLabel.textContent
			if (fieldLabel) fieldLabel = fieldLabel.replace(/\s/g, '').replace(/\/.*/g, '').toLowerCase()
			if (inAuthorsList) {
				if (!fieldLabel) fieldLabel = 'auth'
				else inAuthorsList = false
			}
			if (fieldValue && fieldLabel) {
				switch (fieldLabel.trim()) {
					case 'title':
						title = fieldValue.textContent
						break;
					case 'auth':
						inAuthorsList = true
						if (fieldValue.textContent) {
							var a = fieldValue.textContent
							a = a.replace(/[\.\,]/g, '').trim()
							a = a.split(' ')
							if (a.length > 0) {
								if (a.length > 1) a = a[1] + ' ' + a[0];
								else a = a[0];
								authors.push(a)
							}
						}
						break;
					case 'publisher':
						var infosRaw = fieldValue.textContent
						infosRaw = infosRaw.split ? infosRaw.split(':') : null
						if (infosRaw.length > 0) {
							infosRaw = infosRaw[infosRaw.length - 1]
							journal = infosRaw.split(',')[0]
							date = /,.*(\d{4}).*/.exec(infosRaw)
							date = date && date[1] ? date[1] : null
						}
						break;
					default:
						continue;
				}
			}
		}
		// no author collected
		if (!authors[0]) authors = null
		// eventual doi
		var detail$ = document.body.querySelectorAll('.bibDetail')
		if (detail$.length > 0) {
			detail$ = detail$[detail$.length - 1]
			var id$ = /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi.exec(detail$.innerHTML)
			if (id$ && id$.length > 1) {
				type = 'DigitalObjectId'
				id = id$[1]
			}
		}
		// Dominant
		this.dominant = {
			id: id || title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: journal,
			authors: authors,
			publisher: publisher,
			date: date,
			isbn: isbn
		};
		this.pageType = 'ARTICLE'
	}
}
// JSTOR Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_jstorSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		jstorSearch: {
			item: {
				query: '.result-item'
			},
			infos: {
				query: '.src'
			},
			authors: {
				query: '.contrib'
			},
			uri: {
				query: '.title a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.title a',
				content: 'textContent',
				clean: null
			},
			type: 'CompositeArticleId'
		}
	},
	observe: {
		observer: null,
		observerTarget: null,
		observerOptions: { childList: true, subtree: true }
	},
	scan: function (reset) {
		if (reset) {
			this.dominant = null
			this.libraryItemId = null
			this.list = []
		}
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Matches
		var type = rules.type
		// note: if document.body.querySelector('.paper-card') than it's a detail
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.attr] : null
			if (!uri) continue;
			uri = uri.replace(/\?.*/, '')
			var title = item.querySelector(rules.title.query)
			if (!title) continue;
			title = title[rules.title.content]
			if (title) title = title.replace(/"/g, '')
			if (!title) continue;
			var authors = null
			var journal = null
			var publisher = null
			var date = null
			var id = title
			var authorsRaw = item.querySelector(rules.authors.query)
			if (authorsRaw && authorsRaw.textContent) {
				var lastAuthor = null
				authorsRaw = authorsRaw.textContent.split(' and ')
				if (authorsRaw.length > 1) lastAuthor = authorsRaw.pop()
				authorsRaw = authorsRaw[0].split(',')
				if (authorsRaw.length && lastAuthor) authorsRaw.push(lastAuthor)
				if (authorsRaw && authorsRaw.length > 0) authors = authorsRaw
			}
			var volume = null
			var issue = null
			var pages = null
			var pages$ = item.querySelector('.title .nonLinkText')
			if (pages$ && pages$.textContent) {
				pages$ = pages$.textContent.match(/\d+-?\d+/)
				pages = pages$ ? pages$[0] : null
			}
			var infos = item.querySelector(rules.infos.query)
			if (infos && infos.textContent) {
				infos = infos.textContent
				date = infos.match(/\d{4}/)
				date = date ? date[0] : null
				journal = infos.split(',')
				journal = journal && journal.length ? journal[0] : null
				volume = infos.match(/,\s*vol\D*(\d+)\D/i)
				volume = volume && volume[1] ? volume[1] : null
				issue = infos.match(/,\s*no\D*(\d+)\D/i)
				issue = issue && issue[1] ? issue[1] : null
				if (!pages) {
					pages = infos.match(/,\s*pp\D*(\d+-?\d+)/i)
					pages = pages && pages[1] ? pages[1] : null
				}
			} else {
				var bookTitle = item.querySelector('.book-title')
				if (bookTitle && bookTitle.textContent) journal = bookTitle.textContent
				var bookPublisher = item.querySelector('.src-book a')
				if (bookPublisher && bookPublisher.textContent) publisher = bookPublisher.textContent
				var bookDate = item.querySelector('.src-book')
				if (bookDate && bookDate.textContent) {
					bookDate = bookDate.textContent
					bookDate = bookDate.match(/\((.*)\)/)
					date = bookDate && bookDate.length && bookDate[1] ? bookDate[1] : null
				}
			}
			publisher = publisher || journal
			this.list.push({
				// Exporting Type Specific
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// JSTOR Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_jstorArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	ignoreListCount: true,
	scan: function () {
		// console.log('jstonArticle/scan')
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = null
		var title = document.title || (document.location.host + document.location.pathname)
		var referrer = document.referrer
		var authors = null
		var editors = null
		var date = null
		var publisher = null
		var journal = null
		var isbn = null
		var referenceType = null
		var volume = null
		var issue = null
		var pages = null
		var edition = null
		// scraping
		var itemView = null
		var item = document.body.querySelector('.article-view-info')
		if (item) itemView = 'articleView'
		if (!item) {
			item = document.body.querySelector('#bookInfo')
			if (item) itemView = 'bookView'
		}
		if (!item) {
			item = document.body.querySelector('.articleTop')
			if (item) itemView = 'journalView'
		}
		if (!item) {
			item = document.head.querySelector('meta[name="ST.datatype"]')
			if (item && item.content) {
				if (item.content.match(/BOOK/i)) itemView = 'bookChapterView'
				else item = null
			} else {
				item = null
			}
		}
		if (!item) {
			item = document.body.querySelector('[data-qa="book-title"]')
			if (item && item.parentNode) {
				item = item.parentNode
			} else {
				item = null
			}
			if (item) itemView = 'badBookView'
		}
		// nice fallback to generic scanner hack: because sometimes there's a doi you never know
		var doiElement = document.querySelector('.doi')
		if (doiElement &&
			doiElement.textContent &&
			doiElement.textContent.trim().length > 8) item = null
		// console.log('item itemView', item, itemView)
		if (item) {
			uri = document.location.href.replace(/\?.*/, '')
			if (!uri) return
			if (itemView === 'bookChapterView') {
				var titleMeta = document.head.querySelector('meta[name="ST.title"]')
				titleMeta = titleMeta.content ? titleMeta.content : null
				if (titleMeta) title = titleMeta
				var publisherMeta = document.head.querySelector('meta[name="ST.publisher"]')
				publisherMeta = publisherMeta.content ? publisherMeta.content : null
				if (publisherMeta) publisher = publisherMeta
				var isbnMeta = document.head.querySelector('meta[name="ST.isbn"]')
				isbnMeta = isbnMeta.content ? isbnMeta.content : null
				if (isbnMeta) isbn = isbnMeta
			} else if (itemView === 'badBookView') {
				// NOTE: jira/ANN-11
				title = item.querySelector('[data-qa="book-title"]')
				if (!title || !title.textContent) return
				title = title.textContent.trim()
				var authorsEls = item.querySelectorAll('.contrib-type-author')
				if (authorsEls.length > 0) {
					authors = Array.prototype.map.call(authorsEls, function (i) {
						return i.textContent.trim()
					})
				}
				var editorsEls = item.querySelectorAll('.contrib-type-editor')
				if (editorsEls.length > 0) {
					editors = Array.prototype.map.call(editorsEls, function (i) {
						return i.textContent.replace(/edited by/i, '').trim()
					})
				}
				var dateEl = item.querySelector('.published_date')
				if (dateEl) {
					date = dateEl.textContent.replace(/\D/g, ' ').trim()
				}
				var publisherEl = item.querySelector('.publisher')
				if (publisherEl) {
					publisher = publisherEl.textContent.replace(/\n/g, ' ').replace(/.*:/, '').trim()
				}
				var pagesEl = item.querySelector('.count')
				if (pagesEl) {
					pages = pagesEl.textContent.replace(/\n/g, ' ').replace(/.*:/, '').trim()
				}
				var editionEl = item.querySelector('.book-edition')
				if (editionEl) {
					edition = editionEl.textContent.replace(/\n/g, ' ').replace(/.*:/, '').trim()
				}
				referenceType = 'BOOK'
				// console.log(title, authors, date, publisher, pages, edition)
			} else {
				title = item.querySelector('.title')
				if (!title || !title.textContent) return;
				title = title.textContent.trim()
				var authorsRaw = item.querySelector('.contrib') ||
					item.querySelector('.contributors') ||
					document.body.querySelector('.authorInfo .indent')
				if (authorsRaw && authorsRaw.textContent) {
					var lastAuthor = null
					authorsRaw = authorsRaw.textContent.replace(/FOREWORD[\W\w]*/gi, '').split(' and ')
					if (authorsRaw.length > 1) lastAuthor = authorsRaw.pop()
					authorsRaw = authorsRaw[0].split(',')
					if (authorsRaw.length && lastAuthor) authorsRaw.push(lastAuthor)
					if (authorsRaw && authorsRaw.length > 0) authors = authorsRaw
				}
				journal = item.querySelector('.journal')
				journal = journal && journal.textContent ? journal.textContent.trim() : null
				publisher = item.querySelector('.publisher')
				publisher = publisher && publisher.textContent ? publisher.textContent.trim() : null
				if (publisher) publisher = publisher.replace(/published by\:/gi, '')
				date = item.querySelector('.src, .mbl')
				if (date && date.textContent) date = date.textContent.replace(/.*\(/, '').replace(/\).*/, '').replace(/[,.]/g, '')
				if (!date) {
					date = item.querySelector('.pubDate')
					date = date && date.textContent ? date.textContent.split(':') : null
					date = date && date.length && date.length > 1 ? date[1] : null
				}
				if (itemView === 'journalView') {
					var footInfo = document.querySelector('#articleFoot')
					if (footInfo && footInfo.textContent) {
						var footInfo_journal = footInfo.querySelector('cite')
						if (footInfo_journal && footInfo_journal.textContent) journal = footInfo_journal.textContent
						footInfo = footInfo.textContent
						date = footInfo.match(/\d{4}/)
						date = date && date.length && date[0] ? date[0] : null
						if (date) {
							publisher = footInfo.slice(footInfo.indexOf(date) + 4, footInfo.length)
							publisher = publisher && publisher.length && publisher.length > 3 ? publisher : null
						}
					}
				}
				if (itemView === 'bookView') {
					isbn = item.querySelector('.eisbn')
					isbn = isbn && isbn.textContent ? isbn.textContent.replace(/.*\:/, '') : null
					isbn = isbn.replace(/\-/g, '')
					isbn = isbn.trim()
					isbn = isbn ? isbn : null
					referenceType = 'BOOK'
				}
			}
			var addInfo = document.querySelector('.src.mbl')
			if (addInfo && addInfo.textContent) {
				addInfo = addInfo.textContent
				volume = addInfo.match(/\s*vol\D*(\d+)\D/i)
				volume = volume && volume[1] ? volume[1] : null
				issue = addInfo.match(/\s*no\D*(\d+)\D/i)
				issue = issue && issue[1] ? issue[1] : null
				pages = addInfo.match(/\s*pp\D*(\d+-?\d+)/i)
				pages = pages && pages[1] ? pages[1] : null
			}
			if (!journal && publisher) {
				journal = publisher.replace(/\(.+\)/, '')
			}
			if (!date && publisher) {
				var pubDate = publisher.match(/\((.+\d\d\d\d)\)/)
				if (pubDate && pubDate[1]) {
					date = pubDate[1]
				}
			}
			// Dominant
			this.dominant = {
				id: id || title,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				journal: journal,
				authors: authors,
				editors: editors,
				publisher: publisher,
				date: date,
				isbn: isbn,
				referenceType: referenceType,
				volume: volume,
				issue: issue,
				pages: pages,
				edition: edition
			};
			this.pageType = 'ARTICLE'
			// related articles
			if (itemView === 'articleView') {
				var relatedScanner = F1000Global.pageObjectIdsHandlers.genericIdsScanner
				relatedScanner.scan()
				if (relatedScanner.list.length > 0) this.list = relatedScanner.list
			}
		} else {
			// fallback to generic scraper
			pageObjectIds = F1000Global.pageObjectIdsHandlers.genericIdsScanner
			pageObjectIds.scan()
		}
	}
}
// Amazon Book - can be internationalized using ors in the match regexp
F1000Global.pageObjectIdsHandlers.htmlContentScanner_amazonBook = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	ignoreListCount: true,
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = null
		var title = document.title || (document.location.host + document.location.pathname)
		var referrer = document.referrer
		var authors = null
		var editors = null
		var date = null
		var publisher = null
		var journal = null
		var isbn = null
		var referenceType = 'BOOK'
		var articleAbstract = null
		var edition = null
		// Environment
		var kindleStore = false
		if (document.title.match(/: Kindle Store$/)) kindleStore = true
		if (document.querySelector('a.breadcrumb-link') &&
			document.querySelector('a.breadcrumb-link').textContent.indexOf('Kindle') !== -1) kindleStore = true
		// this is not really true, sometimes productDescription is found on classic store
		if (typeof productDescription !== 'undefined') kindleStore = true
		if (typeof btAsinTitle !== 'undefined' && btAsinTitle.textContent && btAsinTitle.textContent.indexOf('[Kindle') !== -1) kindleStore = true
		//console.log(kindleStore)
		// scraping
		var details = null
		if (window.productTitle && window.productTitle.textContent) {
			title = window.productTitle.textContent
		} else {
			title = document.title.replace(/\s.book:.*/i, '')
		}
		var detailsLabel = [].filter.call(document.querySelectorAll('h2'), function (i) {
			return i.textContent && i.textContent.match(/Product\s*details/i)
		})
		if (detailsLabel[0] && detailsLabel[0].parentElement) {
			details = detailsLabel[0].parentElement.querySelectorAll('li')
		}
		if (details && details.length > 0) {
			;[].forEach.call(details, function (r) {
				var value
				var label = r.querySelector('b')
				var value = r.textContent ? r.textContent.split(':') : null
				if (label && label.textContent &&
					value && value[1]) {
					label = label.textContent
					value = value[1]
					if (label.match(/Publisher/i)) {
						value = value.trim()
						if (value) {
							var d = value.match(/\((.*)\)/)
							date = d && d[1] ? d[1] : null
							var p = value.match(/([\w\s]*)/)
							publisher = p && p[1] ? p[1] : null
							var ed = value.match(/;(.*?)edition/i)
							edition = ed && ed[1] ? ed[1] : null
						}
					} else if (label.match(/^ISBN/i)) {
						value = value.trim().replace(/-/g, '')
						isbn = value ? value : null
					}
				}
			})
		}
		// authors are a mess on amazon, amazon is a mess
		var authorsHTML = document.querySelectorAll('.author')
		//console.log(authorsHTML)
		if (authorsHTML.length > 0) {
			authors = []
			editors = []
			Array.prototype.filter.call(authorsHTML, function (i) {
				if (!i.textContent) return
				if (i.textContent.match(/editor/i)) editors.push(i)
				else authors.push(i)
			})
			authors = authors.map(function (i) {
				var name = i.querySelector('a.contributorNameID') || i.querySelector('a')
				return name && name.textContent ? name.textContent : false
			}).filter(function (i) { return i })
			editors = editors.map(function (i) {
				var name = i.querySelector('a.contributorNameID') || i.querySelector('a')
				return name && name.textContent ? name.textContent : false
			}).filter(function (i) { return i })
		}
		//console.log(authors, editors)
		if (!authors || authors.length === 0) {
			var a = kindleStore ? document.title.match(/([\s\w.,]*):\s*?Amazon.*?:/i) : document.title.match(/Amazon.*?:(.*?):/i)
			if (a && a[1]) authors = a[1].split(',')
		}
		//console.log(authors, editors)
		// data from publication matedata element
		if (typeof pubdatevalue !== 'undefined' && pubdatevalue.textContent && pubdatevalue.textContent.length > 3) {
			date = pubdatevalue.textContent
		}
		// cleans any date
		if (date) date = date.replace(/[.,]/g, '')
		// scrape articleAbstract
		function scrapeAbstract() {
			var synopsis
			synopsis = document.querySelector('#postBodyPS')
			if (synopsis && synopsis.childNodes && synopsis.childNodes.length > 0) {
				synopsis = [].filter.call(synopsis.childNodes, function (i) {
					return i.textContent ? true : false
				})
					.map(function (i) { return i.textContent })
					.join('\n\n')
				articleAbstract = synopsis ? synopsis : null
			} else {
				if (window.bookDesc_iframe &&
					window.bookDesc_iframe.contentWindow &&
					window.bookDesc_iframe.contentWindow.document)
					synopsis = window.bookDesc_iframe.contentWindow.document.querySelector('#iframeContent')
				if (!synopsis) {
					if (window['product-description-iframe'] &&
						window['product-description-iframe'].contentWindow &&
						window['product-description-iframe'].contentWindow.document)
						synopsis = window['product-description-iframe'].contentWindow.document.querySelector('.productDescriptionWrapper')
				}
				if (synopsis && synopsis.childNodes && synopsis.childNodes.length > 0) {
					synopsis = [].filter.call(synopsis.childNodes, function (i) {
						return i.textContent ? true : false
					})
						.map(function (i) { return i.textContent })
						.join('\n')
					articleAbstract = synopsis ? synopsis : null
				}
			}
		}
		scrapeAbstract()
		if (articleAbstract) setTimeout(function () {
			scrapeAbstract()
			if (articleAbstract) pageObjectIds.dominant.articleAbstract = articleAbstract
		}, 1000)
		if (edition) edition = F1000Global.parseWordNumber(edition)
		// Dominant
		this.dominant = {
			id: id || title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: journal,
			authors: authors,
			editors: editors,
			publisher: publisher,
			date: date,
			isbn: isbn,
			referenceType: referenceType,
			articleAbstract: articleAbstract,
			edition: edition
		};
		this.pageType = 'ARTICLE'
	}
}
// Voyager Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_voyagerArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = null
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		var authors = []
		var date = null
		var publisher = null
		var journal = null
		var isbn = null
		var referenceType = null
		// scraping
		var title = document.querySelector('#divBibTitle')
		if (title && title.textContent) title = title.textContent.replace(/\(Online\).*/gi, '').trim().replace(/\W*$/g, '')
		var infos = document.querySelectorAll('.bibTag')
		if (infos && infos.length > 0) {
			;[].forEach.call(infos, function (i) {
				var label = i.querySelector('.fieldLabelSpan')
				var value = i.querySelector('.subfieldData')
				if (label && value && label.textContent && value.textContent) {
					label = label.textContent
					value = value.textContent
					//console.log(label, value)
					if (label.match(/authors/i)) {
						var aa = value.split('\n')
						aa.forEach(function (aai) {
							aai = aai.replace(/\(.*\)|[^\w\s]|[\d]/g, '').trim()
							if (aai) authors.push(aai)
						})
					} else if (label.match(/author/i)) {
						var a = value.replace(/\(.*\)|[^\w\s]|[\d]/g, '').trim()
						if (a) authors.push(a)
					} else if (label.match(/publication|publisher/i)) {
						var d = value.match(/\d{4,}/)
						if (d && d[0]) {
							date = d[0]
							value = value.replace(date, '')
						}
						var p = value.split(';')
						if (p && p[0]) {
							p = p[0]
							p = p.replace(/\W*$/g, '').replace(' :', '').replace(/\[.*\]/g, '').trim()
							publisher = p
						}
					} else if (label.match(/isbn/i)) {
						isbn = value.trim()
						referenceType = 'BOOK'
					}
				}
			})
		}
		//console.log(title, authors, date, publisher, isbn)
		// Dominant
		this.dominant = {
			id: id || title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: journal,
			authors: authors,
			publisher: publisher,
			date: date,
			isbn: isbn,
			referenceType: referenceType
		};
		this.pageType = 'ARTICLE'
	}
}
// Primo /libweb Search/Detail
F1000Global.pageObjectIdsHandlers.htmlContentScanner_primoLibweb = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		primoLibweb: {
			item: {
				query: '.EXLResult'
			},
			infos: {
				query: '.EXLResultFourthLine'
			},
			authors: {
				query: '.EXLResultAuthor'
			},
			uri: {
				query: '.EXLResultTitle a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.EXLResultTitle'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		var rules = this.rules[this.domain]
		var scrapeItem = this._scrapeItem
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Generic Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		var isSearch = document.body.querySelector('#exlidResultsTable')
		if (isSearch) {
			// Matches
			var type = rules.type
			var items = document.querySelectorAll(rules.item.query)
			this.list = Array.prototype.map.call(items, function (i) {
				return scrapeItem(i, rules, type, title, pageURI, referrer)
			}).filter(function (i) {
				return !!i
			})
			this.pageType = 'REFERENCES'
			return
		}
		var detailItem = document.querySelector(rules.item.query)
		if (detailItem) {
			var type = rules.type
			var scrapedDetail = scrapeItem(detailItem, rules, type, title, pageURI, referrer)
			if (scrapedDetail) {
				delete scrapedDetail.resolved
				this.dominant = scrapedDetail
				// it we didn't build a permaLink manually extract the outside links from the content shoulder
				var PERMALINK_PATH = '/NHAU:books_and_more:'
				if (!this.dominant.uri ||
					this.dominant.uri.indexOf(PERMALINK_PATH) === -1) {
					var stableLink = document.querySelector('.EXLFullDetailsOutboundLink')
					if (stableLink &&
						stableLink.href) {
						this.dominant.uri = stableLink.href
					}
				}
				// extra info
				var extraInfo = detailItem.textContent
				if (extraInfo) {
					var hasDOI = extraInfo.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
					if (hasDOI) {
						this.dominant.id = hasDOI[0]
						this.dominant.type = 'DigitalObjectId'
					} else {
						var hasISBN = extraInfo.match(/isbn:?\s+?[\d-]{1,}/i)
						if (hasISBN) {
							this.dominant.isbn = hasISBN[0].replace(/isbn:?\s+?/i, '').trim()
							this.dominant.referenceType = 'BOOK'
						} else {
							if ((this.dominant.id + this.dominant.pageTitle)
								.match(/:\sbook|-\sbook|\/\sbook|:\sספר|-\sספר|\/\sספר/i)) {
								this.dominant.referenceType = 'BOOK'
							}
						}
						var hasISSN = extraInfo.match(/issn:?\s+?[\d-]{1,}/i)
						if (hasISSN) {
							this.dominant.issn = hasISSN[0].replace(/issn:?\s+?/i, '').trim()
						}
					}
				}
			}
		}
		this.pageType = 'ARTICLE'
		return
	},
	_scrapeItem: function (item, rules, type, pageTitle, pageURI, referrer) {
		var referenceType = null
		if (item.className) {
			if (item.className.match(/book/i)) referenceType = 'BOOK'
			else if (item.className.match(/article/i)) referenceType = 'RESEARCH_ARTICLE'
			else if (item.className.match(/journal/i)) referenceType = 'RESEARCH_ARTICLE'
		}
		var uri = item.querySelector(rules.uri.query) || item.querySelector('.coverImageDiv a')
		uri = uri ? uri[rules.uri.attr] : null
		if (!uri) uri = pageURI
		var permalinkId = uri.match(/doc=(.*?)&|docId=(.*?)&|recIds=(.*?)&|doc=(.*?)$|docId=(.*?)$|recIds=(.*?)$/i)
		if (permalinkId) {
			permalinkId = permalinkId.reduce(function (acc, cur, index) {
				return !acc && index > 0 ? cur : acc
			}, null)
			if (permalinkId) {
				var PERMALINK_PATH = '/NHAU:books_and_more:'
				uri = location.origin + PERMALINK_PATH + permalinkId
			}
		}
		var title = item.querySelector(rules.title.query)
		if (title && title.textContent) {
			title = (title.innerText || title.textContent).replace(/¬.*|\s\/.*|\n.*/g, '').trim()
			if (!title) title = pageTitle
		}
		var authors = null
		var authorsRaw = item.querySelector(rules.authors.query)
		if (authorsRaw && authorsRaw.textContent) {
			authorsRaw = authorsRaw.textContent
			// NOTE: try to keep in sync for primo-libweb/primo-explore scrapers
			authors = authorsRaw
				.replace(/\(.*?\)/g, '')
				.split(';')
				.map(function (a) {
					return a
						.replace(/\W-\s?\w+\s?$/, '')
						.trim()
				})
				.filter(function (a) { return !!a })
				.map(function (a) {
					return a
						.split(',')
						.map(function (a) {
							return a
								.replace(/\d|\-\s?$|[\_\,\;\(\)]/g, '')
								.trim()
						})
						.filter(function (a) {
							return !!a
						})
				})
				.map(function (a) {
					return a
						.reduce(function (acc, cur, index) {
							if (index % 2 === 1) {
								acc[acc.length - 1] = acc[acc.length - 1] + ', ' + cur
							} else {
								acc.push(cur)
							}
							return acc
						}, [])
				})
				.reduce(function (acc, cur) {
					return acc.concat(cur)
				}, [])
				.filter(function (i) {
					return i.length > 1 || i.match(/\w/)
				})
		}
		var date = null
		var publisher = null
		var publicationPlace = null
		var infos = item.querySelector(rules.infos.query)
		if (infos && infos.textContent) {
			infos = infos.textContent
			date = infos.match(/1\d{3,}|2\d{3,}/)
			if (date) {
				date = date[0]
				infos = infos.replace(date, '').trim()
				if (date && date.length > 4) {
					date = date.substr(0, 4)
				}
			}
			if (infos) {
				publisher = infos.split && infos.split(':')
				if (publisher &&
					publisher.length > 0) {
					if (publisher.length > 1) {
						publicationPlace = publisher[0]
						publicationPlace = publicationPlace.replace(/\s\-|[\(\)\:\;]|c\d{1,4}|\sc$/g, '').trim()
						publisher = publisher[publisher.length - 1]
					} else {
						publisher = publisher[0]
					}
					publisher = publisher.replace(/\s\-|[\(\)\:\;]|c\d{1,4}|\sc$/g, '').trim()
				}
			}
		}
		// console.log('%cprimoLibweb scraper START', 'background: yellow; color: black;')
		// console.log('referenceType', referenceType)
		// console.log('title', title)
		// console.log('authors', authors)
		// console.log('date', date)
		// console.log('publisher', publisher)
		// console.log('publicationPlace', publicationPlace)
		// console.log('uri', uri)
		// console.log('%cprimoLibweb scraper END\n', 'background: yellow; color: black;')
		return {
			// Exporting Type Specific
			authors: authors,
			journal: null,
			date: date,
			publisher: publisher,
			publicationPlace: publicationPlace,
			referenceType: referenceType,
			// Exporting
			id: title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			resolved: {
				id: title,
				pageTitle: title,
				type: type,
				uri: uri
			}
		}
	}
}
// Primo /libweb Search/Detail for Merhav
// NOTE: this is an improved libweb scraper, can become the generic one after proper testing
F1000Global.pageObjectIdsHandlers.htmlContentScanner_primoLibweb_Merhav = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		primoLibweb_Merhav: {
			item: {
				query: '.EXLResult'
			},
			infos: {
				query: '.EXLResultFourthLine'
			},
			authors: {
				query: '.EXLResultAuthor'
			},
			uri: {
				query: '.EXLResultTitle a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: '.EXLResultTitle'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		console.log('%cMerhav scraper', 'background: blue; color: white;')
		var rules = this.rules[this.domain]
		var scrapeItem = this._scrapeItem
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Generic Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		var isSearch = document.body.querySelector('#exlidResultsTable')
		if (isSearch) {
			// Matches
			var type = rules.type
			var items = document.querySelectorAll(rules.item.query)
			this.list = Array.prototype.map.call(items, function (i) {
				return scrapeItem(i, rules, type, title, pageURI, referrer)
			}).filter(function (i) {
				return !!i
			})
			this.pageType = 'REFERENCES'
			return
		}
		var detailItem = document.querySelector(rules.item.query)
		if (detailItem) {
			var type = rules.type
			var scrapedDetail = scrapeItem(detailItem, rules, type, title, pageURI, referrer)
			if (scrapedDetail) {
				delete scrapedDetail.resolved
				this.dominant = scrapedDetail
				// if we didn't build a permaLink manually extract the outside links from the content shoulder
				var PERMALINK_PATH = '/primo_library/libweb/action/dlDisplay.do?docId='
				if (!this.dominant.uri ||
					this.dominant.uri.indexOf(PERMALINK_PATH) === -1) {
					var stableLink = document.querySelector('.EXLFullDetailsOutboundLink')
					if (stableLink &&
						stableLink.href) {
						this.dominant.uri = stableLink.href
					}
				}
				// extra info
				var extraInfo = detailItem.textContent
				if (extraInfo) {
					var hasDOI = extraInfo.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
					if (hasDOI) {
						this.dominant.id = hasDOI[0]
						this.dominant.type = 'DigitalObjectId'
					} else {
						var hasISBN = extraInfo.match(/isbn:?\s{0,}[\d-]{1,}/i)
						if (hasISBN) {
							this.dominant.isbn = hasISBN[0].replace(/isbn:?\s{0,}/i, '').trim()
							this.dominant.referenceType = 'BOOK'
						} else {
							if ((this.dominant.id + this.dominant.pageTitle)
								.match(/:\sbook|-\sbook|\/\sbook|:\sספר|-\sספר|\/\sספר/i)) {
								this.dominant.referenceType = 'BOOK'
							}
						}
						var hasISSN = extraInfo.match(/issn:?\s{0,}[\d-]{1,}/i)
						if (hasISSN) {
							this.dominant.issn = hasISSN[0].replace(/issn:?\s{0,}/i, '').trim()
						}
					}
				}
			}
		}
		this.pageType = 'ARTICLE'
		return
	},
	_scrapeItem: function (item, rules, type, pageTitle, pageURI, referrer) {
		var referenceType = null
		if (item.className) {
			if (item.className.match(/book/i)) referenceType = 'BOOK'
			else if (item.className.match(/article/i)) referenceType = 'RESEARCH_ARTICLE'
			else if (item.className.match(/journal/i)) referenceType = 'RESEARCH_ARTICLE'
			else referenceType = 'BOOK'
		}
		var uri = item.querySelector(rules.uri.query) || item.querySelector('.coverImageDiv a')
		uri = uri ? uri[rules.uri.attr] : null
		if (!uri) uri = pageURI
		var permalinkId = uri.match(/doc=(.*?)&|docId=(.*?)&|recIds=(.*?)&|doc=(.*?)$|docId=(.*?)$|recIds=(.*?)$/i)
		if (permalinkId) {
			permalinkId = permalinkId.reduce(function (acc, cur, index) {
				return !acc && index > 0 ? cur : acc
			}, null)
			if (permalinkId) {
				var PERMALINK_PATH = '/primo_library/libweb/action/dlDisplay.do?docId='
				uri = location.origin + PERMALINK_PATH + permalinkId
			}
		}
		var title = item.querySelector(rules.title.query)
		if (title && title.textContent) {
			title = (title.innerText || title.textContent).replace(/¬.*|\s\/.*|\n.*/g, '').trim()
			if (!title) title = pageTitle
		}
		var authors = null
		var _authorLineDate = null
		var authorsRaw = item.querySelector(rules.authors.query)
		if (authorsRaw && authorsRaw.textContent) {
			authorsRaw = authorsRaw.textContent
			// NOTE: try to keep in sync for primo-libweb/primo-explore scrapers
			authors = authorsRaw
				.replace(/\(.*?\)/g, '')
				.split(';')
				.map(function (a) {
					return a
						.replace(/\W-\s?\w+\s?$/, '')
						.trim()
				})
				.filter(function (a) { return !!a })
				.map(function (a) {
					return a
						.split(',')
						.map(function (a) {
							return a
								.replace(/\d|\-\s?$|[\_\,\;\(\)\?]/g, '')
								.trim()
						})
						.filter(function (a) {
							return !!a
						})
				})
				.map(function (a) {
					return a
						.reduce(function (acc, cur, index) {
							if (index % 2 === 1) {
								acc[acc.length - 1] = acc[acc.length - 1] + ', ' + cur
							} else {
								acc.push(cur)
							}
							return acc
						}, [])
				})
				.reduce(function (acc, cur) {
					return acc.concat(cur)
				}, [])
				.filter(function (i) {
					return i.length > 1 || i.match(/\w\w/)
				})
			// refine found
			if (Array.isArray(authors)) {
				// extra clean up [-/]
				authors = authors.map(function (a) {
					return a.replace(/[-/]/g, ' ')
				})
				// extra clean up titles
				authors = authors.map(function (a) {
					return a.replace(/editor|author|creator|עורך|מחבר|יוצר/gi, '')
				})
				// discard istitutions
				authors = authors.filter(function (a) {
					return !a.match(/date|universi|archive|ארכיון|תשס"ח|שנה|אוניברסיט/i)
				})
			}
			// try to collect author line date as a fallback date
			if (typeof authorsRaw === 'string') {
				authorsRaw = authorsRaw.trim()
				var _ardate = authorsRaw.match(/[^-](\d\d\d\d)$/)
				if (_ardate && _ardate[1]) {
					_authorLineDate = _ardate[1]
				}
			}
		}
		// info line
		var date = null
		var publisher = null
		var publicationPlace = null
		var infos = item.querySelector(rules.infos.query)
		if (infos && infos.textContent) {
			infos = infos.textContent
			date = infos.match(/1\d\d\d|2\d\d\d/)
			if (date) {
				date = date[0]
				infos = infos.replace(new RegExp('c?' + date, i), '').trim()
			}
			if (infos) {
				publisher = infos.split && infos.split(':')
				if (publisher &&
					publisher.length > 0) {
					if (publisher.length > 1) {
						publicationPlace = publisher[0]
						publicationPlace = publicationPlace.replace(/\s\-|[\(\)\:\;]|c\d{1,4}|\sc$/g, '').trim()
						publisher = publisher[publisher.length - 1]
					} else {
						publisher = publisher[0]
					}
					publisher = publisher.trim().replace(/\s\-|-$|[\(\)\:\;]/g, '').trim()
				}
			}
		}
		// extra info line
		var pages = null
		var volume = null
		var issue = null
		var extraInfos = item.querySelector('.EXLResultDetails')
		if (extraInfos && extraInfos.textContent) {
			extraInfos = extraInfos.textContent
			if (!publisher) {
				var _publisher = extraInfos.match(/^[^-,\d]+/)
				if (_publisher) {
					publisher = _publisher[0]
				}
			}
			if (!date) {
				var _date = extraInfos.match(/1\d\d\d|2\d\d\d/)
				if (_date) {
					date = _date[0]
				}
			}
			var _pages = extraInfos.match(/\d+-\d+/)
			if (_pages) {
				pages = _pages[0]
			}
			var _volume = null
			_volume = extraInfos.match(/Vol\.(\d+)/i)
			if (_volume) {
				volume = _volume[1] ? _volume[1] : null
			}
			if (!volume) {
				_volume = extraInfos.match(/(\d+),\d/)
				if (_volume && _volume[1]) {
					volume = _volume[1]
				}
			}
			if (!volume) {
				_volume = extraInfos.match(/\d{1,3}\s/)
				if (_volume) {
					volume = _volume[0]
				}
			}
			var _issue = null
			_issue = extraInfos.match(/Vol\.\d+\((\d+)\)/i)
			if (_issue) {
				issue = _issue[1] ? _issue[1] : null
			}
			if (!issue) {
				_issue = extraInfos.match(/\d+,(\d+)\s/)
				if (_issue && _issue[1]) {
					issue = _issue[1]
				}
			}
		}
		// abstract
		var articleAbstract = null
		var abstractRow =
			document.getElementById('תקציר/הערה1') ||
			document.getElementById('תקציר/הערה-1') ||
			document.getElementById('תקציר1') ||
			document.getElementById('תקציר-1') ||
			document.getElementById('Description1') ||
			document.getElementById('Description-1') ||
			document.getElementById('Abstract1') ||
			document.getElementById('Abstract-1')
		if (abstractRow) {
			var abstractContent = abstractRow.querySelector('td.left')
			if (abstractContent) {
				articleAbstract = abstractContent.textContent.trim()
			}
		}
		// date from creation date
		if (!date) {
			var dateRow =
				document.getElementById('שנה1') ||
				document.getElementById('שנה-1') ||
				document.getElementById('Creation Date1') ||
				document.getElementById('Creation Date-1')
			if (dateRow) {
				var dateContent = dateRow.querySelector('td.left')
				if (dateContent) {
					date = dateContent.textContent.replace(/[^\s\d-]/g, '').trim()
				}
			}
		}
		// date from author, last cause a bit risky
		if (!date) {
			if (_authorLineDate) {
				date = _authorLineDate
			}
		}
		// clean up date
		if (date) {
			date = date.replace(/^\D|\D$/g, '')
		}
		// console.log('%cprimoLibweb marhev scraper START', 'background: yellow; color: black;')
		// console.log('referenceType', referenceType)
		// console.log('title', title)
		// console.log('authors', authors)
		// console.log('date', date)
		// console.log('publisher', publisher)
		// console.log('publicationPlace', publicationPlace)
		// console.log('uri', uri)
		// console.log('pages', pages)
		// console.log('volume', volume)
		// console.log('issue', issue)
		// console.log('articleAbstract', articleAbstract)
		// console.log('%cprimoLibweb marhev scraper END\n', 'background: yellow; color: black;')
		return {
			// Exporting Type Specific
			authors: authors,
			journal: null,
			date: date,
			publisher: publisher,
			publicationPlace: publicationPlace,
			referenceType: referenceType,
			pages: pages,
			volume: volume,
			issue: issue,
			articleAbstract: articleAbstract,
			// Exporting
			id: title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			resolved: {
				id: title,
				pageTitle: title,
				type: type,
				uri: uri
			}
		}
	}
}
// Primo -explore Search/Detail
F1000Global.pageObjectIdsHandlers.htmlContentScanner_primoExplore = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		primoExplore: {
			item: {
				query: '.result-item-text'
			},
			infos: {
				query: '.item-detail'
			},
			uri: {
				query: 'h3 > a',
				content: 'attr',
				attr: 'href',
				clean: null
			},
			title: {
				query: 'h3 span'
			},
			referenceType: {
				query: '.media-content-type'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		// SPA supported by matching whitelister
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
			this.known = [];
		}
		var rules = this.rules[this.domain]
		var scrapeItem = this._scrapeItem
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Generic Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// handles search search-detail detail
		var fullViewContainer = document.querySelector('.full-view-container')
		var isSearch = (location.pathname || location.href).indexOf('/search') !== -1
		// console.log('pageObjectIds.scan: isSearch', isSearch)
		if (isSearch) {
			// Matches
			var type = rules.type
			var items = document.querySelectorAll(rules.item.query)
			this.list = Array.prototype.map.call(items, function (i) {
				return scrapeItem(i, rules, type, title, pageURI, referrer)
			}).filter(function (i) {
				return !!i
			})
			this.pageType = 'REFERENCES'
			return
		}
		var detailItem = (fullViewContainer ? fullViewContainer : document).querySelector(rules.item.query)
		if (detailItem) {
			var type = rules.type
			var scrapedDetail = scrapeItem(detailItem, rules, type, title, pageURI, referrer)
			if (scrapedDetail) {
				delete scrapedDetail.resolved
				this.dominant = scrapedDetail
				// extra info
				var extraInfoEl = document.querySelector('#item-details')
				if (extraInfoEl) {
					var extraInfo = extraInfoEl.textContent
					// doi
					var hasDOI = extraInfo.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
					if (hasDOI) {
						this.dominant.id = hasDOI[0]
						this.dominant.type = 'DigitalObjectId'
					} else {
						// books isbn/issn
						var hasISBN = extraInfo.match(/isbn\s+?:?\s+?[\d-]{1,}/i)
						if (hasISBN) {
							this.dominant.isbn = hasISBN[0].replace(/isbn\s+?:?\s+?/i, '').trim()
							this.dominant.referenceType = 'BOOK'
						} else {
							var contentHintEl = document.querySelector('.media-content-type')
							var contentHint = contentHintEl ? contentHintEl.textContent : ''
							if ((contentHint + this.dominant.id + this.dominant.pageTitle)
								.match(/:\sbook|-\sbook|\/\sbook|:\sספר|-\sספר|\/\sספר/i)) {
								this.dominant.referenceType = 'BOOK'
							}
						}
						var hasISSN = extraInfo.match(/issn:?\s+?[\d-]{1,}/i)
						if (hasISSN) {
							this.dominant.issn = hasISSN[0].replace(/issn:?\s+?/i, '').trim()
						}
						// thesis
						var isThesis = document.querySelector('prm-full-view span[translate="mediatype.thesis"]')
						if (isThesis) this.dominant.referenceType = 'THESIS'
					}
					// details
					this._mergeDetails(this.dominant, extraInfoEl)
				}
			}
		}
		this.pageType = 'ARTICLE'
		return
	},
	_mergeDetails: function (dominant, detailsEl) {
		function toObject(el) {
			var detailsRow = el.querySelectorAll('.layout-row')
			var data = {}
			Array.prototype.forEach.call(detailsRow, function (i) {
				var kEl = i.querySelector('span')
				var k = kEl && kEl.title
				var valueEls = i.querySelectorAll('prm-highlight')
				var values = Array.prototype.map.call(valueEls, function (i) {
					return i.textContent.trim()
				}).reduce(function (acc, i) {
					if (acc.indexOf(i) === -1) acc.push(i)
					return acc
				}, [])
				data[k] = values.length === 0 ?
					null : values.length === 1 ?
						values[0] :
						values
			})
			return data
		}

		function normalize(o) {
			// console.log('normalize', o)
			var normalized = {
				authors: o['Author'] || o['Authors'] || o['Author/Creator'] || o['מחבר/יוצר'] || o['מחבר/עורך'],
				editors: o['Editor'] || o['Editors'] || o['Attribution'] || o['Statement of Responsibility'] || o['אחריות'],
				date: o['Date'] || o['Creation Date'] || o['Publication Date'] || o['Publication year'] || o['שנת פרסום'] || o['שנה'],
				publisher: o['Publisher'] || o['מוציא לאור'],
				journal: o['In'] || o['מתוך'],
				articleAbstract: o['Abstract'] || o['Summary'] || o['Description'] || o['Contents/Description'] || o['תקציר']
			}
			// console.log('normalized', normalized)
			return normalized
		}

		function cleanName(str) {
			var r = typeof str === 'string' ?
				str
					.replace(/authored by|authors?|מחבר/i, '')
					.replace(/edited by|editors?|עורך|המערכת/i, '')
					.replace(/honouree/i, '')
					.replace(/\(.*\)/g, '')
					.replace(/\d.*/g, '')
					.replace(/[\(\)]/g, '')
					.replace(/\.$/, '')
					.replace(/,?\s?approximately/g, '')
					.replace(/\:/g, '')
					.replace(/^-/g, '')
					.replace(/-$/g, '')
					.trim()
					.replace(/\s{0,}\,$/, '') :
				''
			// WORKAROUND: FCORE-12673
			if (r.match(/\W-|-\W/g)) {
				r = r.replace(/-/g, ' ')
			}
			return r
		}

		function deduplicate(d) {
			return d.filter(function (i, index, self) { return self.indexOf(i) === index })
		}

		function toNamesArray(d) {
			return deduplicate(
				d
					.map(cleanName)
					.filter(function (i) { return !!i })
			)
		}

		function validateNameEntries(d) {
			function isDiscardable(i) {
				return i.match(/ on | of | for |illustrat|university|אוניברסיט/i)
			}

			function appearsIn(list, s) {
				var listStr = list.join(' ')
				var meaningfulMatch = s.match(/[^\s\,\.\;]{4,}/g)
				var found = false
				if (meaningfulMatch) meaningfulMatch.forEach(function (i) {
					if (listStr.indexOf(i) !== -1) found = true
				})
				return found
			}

			var isLonelyAuthor = Array.isArray(d.authors) && d.authors.length === 1

			d.authors = d.authors.filter(function (i) {
				if (typeof i === 'string') {
					if (isDiscardable(i) && !isLonelyAuthor) {
						return false
					}
					var isEditor = i.match(/edited|editor|עורך/i)
					var isExplicitAuthor = i.match(/author|מחבר/i)
					// sure editor, possible author
					if (isEditor) {
						if (!appearsIn(d.editors, i)) {
							d.editors.push(cleanName(i))
						}
						return isExplicitAuthor ? true : false
					}
					// possible author
					if (!appearsIn(d.editors, i)) {
						return true
					} else if (isExplicitAuthor) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			})

			d.editors = d.editors.filter(function (i) { return !isDiscardable(i) })
		}

		function findEditors(d) {
			if (Array.isArray(d.editors)) {
				d.editors = d.editors.join(', ')
			}
			if (typeof d.editors === 'string') {
				var _editors = d.editors.trim()
				var _m = _editors.match(/;(.*)editor|;(.*)עורך/i) ||
					_editors.match(/(^\S.*)edit|(^\S.*)עורך/i) ||
					_editors.match(/edited by(.*);?/i)
				// console.log('findEditors/_matches:', _m)
				// NOTE: rember to check all catches
				var m = _m && (_m[1] || _m[2])
				if (m) {
					var s = m.split(/and/i)
					s = s.reduce(function (a, i) {
						return a.concat(i.split(','))
					}, [])
					d.editors = s
				} else {
					d.editors = []
				}
			}
		}

		function enforceArray(d, key) {
			if (!Array.isArray(d[key])) {
				d[key] = d[key] ? [d[key]] : []
			}
		}

		function format(d) {
			findEditors(d)
			enforceArray(d, 'authors')
			enforceArray(d, 'editors')
			validateNameEntries(d)
			d.authors = toNamesArray(d.authors)
			d.editors = toNamesArray(d.editors)
			// console.log('authors', d.authors)
			// console.log('editors', d.editors)
			if (typeof d.date === 'string') {
				d.date = d.date.trim().replace(/^c|^©|-$/gi, '')
			}
			if (d.publisher) {
				if (Array.isArray(d.publisher)) {
					d.publisher = d.publisher[0]
				}
				if (typeof d.publisher === 'string') {
					var publisherSplit = d.publisher.split(' :').map(function (i) { return i.trim() })
					if (publisherSplit.length > 1) {
						d.publisher = publisherSplit[1]
						d.publicationPlace = publisherSplit[0]
					}
				}
			}
			if (d.journal) {
				d.journal = d.journal.replace(/,.*/, '').trim()
			}
			if (Array.isArray(d.articleAbstract)) {
				d.articleAbstract = d.articleAbstract.join('\n')
			}
			return d
		}

		function merge(a, b) {
			Object.keys(b).forEach(function (k) { a[k] = b[k] })
		}

		try {
			merge(dominant, format(normalize(toObject(detailsEl))))
		} catch (e) {
			// console.log('F1000Annotator: Error: pageObjectIds._mergeDetails', e)
		}

		// console.log('_mergeDetails: dominant:', pageObjectIds.dominant)
	},
	_scrapeItem: function (item, rules, type, pageTitle, pageURI, referrer) {
		var uri = item.querySelector(rules.uri.query)
		uri = uri ? uri[rules.uri.attr] : null
		if (!uri) uri = pageURI
		var title = item.querySelector(rules.title.query)
		if (title && title.textContent) {
			title = (title.innerText || title.textContent).replace(/¬.*|\s\/.*|\n.*/g, '').trim()
			if (!title) title = pageTitle
		}
		var referenceType = null
		var referenceTypeEl = item.querySelector(rules.referenceType.query)
		if (referenceTypeEl) {
			var referenceTypeRaw = referenceTypeEl.textContent
			if (referenceTypeRaw.match(/book|ספר/i)) referenceType = 'BOOK'
			else if (referenceTypeRaw.match(/article|מאמר/i)) referenceType = 'RESEARCH_ARTICLE'
			else if (referenceTypeRaw.match(/journal|כתב עת/i)) referenceType = 'RESEARCH_ARTICLE'
		}
		var authors = null
		var date = null
		var publisher = null
		var publicationPlace = null
		var journal = null
		var infos = Array.prototype.map.call(item.querySelectorAll(rules.infos.query), function (i) {
			return i.textContent
		}).filter(function (i) { return !!i })
		// console.log('infos', infos)
		if (infos && infos.length > 0) {
			var authorsRaw = null
			var publicationRaw = null
			var journalRaw = null
			if (infos.length === 1) {
				publicationRaw = infos[0]
			} else {
				authorsRaw = infos[0]
				publicationRaw = infos[1]
				journalRaw = infos[2]
			}
			if (typeof authorsRaw === 'string') {
				// NOTE: try to keep in sync for primo-libweb/primo-explore scrapers
				authors = authorsRaw
					.replace(/\(.*?\)/g, '')
					.split(';')
					.map(function (a) {
						return a
							.replace(/\W-\s?\w+\s?$/, '')
							.trim()
					})
					.filter(function (a) { return !!a })
					.map(function (a) {
						return a
							.split(',')
							.map(function (a) {
								return a
									.replace(/\d|\-\s?$|[\_\,\;\(\)]/g, '')
									.trim()
							})
							.filter(function (a) {
								return !!a
							})
					})
					.map(function (a) {
						return a
							.reduce(function (acc, cur, index) {
								if (index % 2 === 1) {
									acc[acc.length - 1] = acc[acc.length - 1] + ', ' + cur
								} else {
									acc.push(cur)
								}
								return acc
							}, [])
					})
					.reduce(function (acc, cur) {
						return acc.concat(cur)
					}, [])
					.filter(function (i) {
						return i.length > 1 || i.match(/\w/)
					})
			}
			if (publicationRaw) {
				date = publicationRaw.match(/1\d{3,}|2\d{3,}/)
				if (date) {
					date = date[0]
					publicationRaw = publicationRaw.replace(date, '').trim()
					if (date && date.length > 4) {
						date = date.substr(0, 4)
					}
				}
				if (publicationRaw) {
					publisher = publicationRaw.split && publicationRaw.split(':')
					if (publisher &&
						publisher.length > 0) {
						if (publisher.length > 1) {
							publicationPlace = publisher[0]
							publicationPlace = publicationPlace.replace(/\s\-|[\(\)\:\;]|c\d{1,4}|\sc$/g, '').trim()
							publisher = publisher[publisher.length - 1]
						} else {
							publisher = publisher[0]
						}
						publisher = publisher.replace(/\s\-|[\(\)\:\;]|c\d{1,4}|\sc$/g, '').trim()
					}
				}
			}
			if (journalRaw) {
				journal = journalRaw.replace(/,.*/, '').trim()
			}
		}
		// console.log('referenceType', referenceType)
		// console.log('title', title)
		// console.log('authors', authors)
		// console.log('date', date)
		// console.log('publisher', publisher)
		// console.log('publicationPlace', publicationPlace)
		// console.log('journal', journal)
		// console.log('uri', uri)
		return {
			// Exporting Type Specific
			authors: authors,
			journal: journal,
			date: date,
			publisher: publisher,
			publicationPlace: publicationPlace,
			referenceType: referenceType,
			// Exporting
			id: title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			resolved: {
				id: title,
				pageTitle: title,
				type: type,
				uri: uri
			}
		}
	}
}
// Primo -beta Detail
F1000Global.pageObjectIdsHandlers.htmlContentScanner_primoBetaDetail = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		primoBetaDetail: {
			item: {
				query: '.item-text-content'
			},
			infos: {
				query: '.item-text-content > li'
			},
			uri: null,
			title: null,
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		// SPA supported by matching whitelister
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
			this.known = [];
		}
		var rules = this.rules[this.domain]
		var type = rules.type
		// Generic Infos
		var pageURI = window.location.href
		var referrer = document.referrer
		// scraper
		var title = document.title.replace(/¬.*|\s\/.*|\n.*| – הספרייה הלאומית/g, '').trim()
		if (!title) title = document.title || (document.location.host + document.location.pathname)
		var uri = pageURI
		this.dominant = {
			// Exporting
			id: title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			resolved: {
				id: title,
				pageTitle: title,
				type: type,
				uri: uri
			}
		}
		// extra info
		var extraInfoElList = document.querySelectorAll(rules.infos.query)
		if (extraInfoElList.length < 1) {
			return
		} else {
			var extraInfo = extraInfoElList[0].parentNode.textContent
			if (extraInfo) {
				// doi
				var hasDOI = extraInfo.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
				if (hasDOI) {
					this.dominant.id = hasDOI[0]
					this.dominant.type = 'DigitalObjectId'
				} else {
					// books isbn/issn
					var hasISBN = extraInfo.match(/isbn\s{0,4}:?\s{0,4}[\d-]{1,}/i)
					if (hasISBN) {
						this.dominant.isbn = hasISBN[0].replace(/isbn\s{0,4}:?\s{0,4}/i, '').trim()
						this.dominant.referenceType = 'BOOK'
					}
					var hasISSN = extraInfo.match(/issn:?\s{0,4}[\d-]{1,}/i)
					if (hasISSN) {
						this.dominant.issn = hasISSN[0].replace(/issn:?\s{0,4}/i, '').trim()
					}
				}
			}
			var href = location.href
			var referenceType = null
			if (href.indexOf('/books/') !== -1) referenceType = 'BOOK'
			else if (href.indexOf('/dissertations/') !== -1) referenceType = 'THESIS'
			else if (href.indexOf('/articles/') !== -1) referenceType = 'RESEARCH_ARTICLE'
			else if (href.indexOf('/journals/') !== -1) referenceType = 'RESEARCH_ARTICLE'
			if (referenceType) this.dominant.referenceType = referenceType
			this.pageType = 'ARTICLE'
			// details
			this._mergeDetails(this.dominant, extraInfoElList)
		}
	},
	_mergeDetails: function (dominant, extraInfoElList) {
		function toObject(rawRows) {
			// console.log(rawRows)
			var result = {}
			Array.prototype.forEach.call(rawRows, function (i) {
				var key = i.querySelector('div')
				var value = i.querySelector('ul')
				// console.log(key, value)
				if (key.textContent && value.textContent) {
					var k = key.textContent.trim()
					var v = value.textContent.trim()
					if (v.indexOf('\n') !== -1) {
						v = v.split('\n').map(function (i) {
							return i.trim()
						}).filter(function (i) {
							return !!i
						})
					}
					if (result[k]) {
						if (!Array.isArray(result[k])) {
							result[k] = [result[k]]
						}
						result[k].push(v)
					} else {
						result[k] = v
					}
				}
			})
			return result
		}

		function normalize(o) {
			// console.log('normalize', o)
			var normalized = {
				authors: o['Author'] || o['Authors'] || o['Author/Creator'] || o['מחבר/יוצר'] || o['מחבר/עורך'],
				editors: o['Editor'] || o['Editors'] || o['Attribution'] || o['Statement of Responsibility'] || o['אחריות'],
				date: o['Date'] || o['Creation Date'] || o['Publication Date'] || o['Publication year'] || o['שנת פרסום'] || o['שנה'],
				publisher: o['Publisher'] || o['מוציא לאור'],
				journal: o['In'] || o['מתוך'],
				articleAbstract: o['Abstract'] || o['Summary'] || o['Description'] || o['Contents/Description'] || o['תקציר']
			}
			// console.log('normalized', normalized)
			return normalized
		}

		function cleanName(str) {
			var r = typeof str === 'string' ?
				str
					.replace(/authored by|authors?|מחבר/i, '')
					.replace(/edited by|editors?|עורך|המערכת/i, '')
					.replace(/honouree/i, '')
					.replace(/\(.*\)/g, '')
					.replace(/\d.*/g, '')
					.replace(/[\(\)]/g, '')
					.replace(/\.$/, '')
					.replace(/,?\s?approximately/g, '')
					.replace(/\:/g, '')
					.replace(/^-/g, '')
					.replace(/-$/g, '')
					.trim()
					.replace(/\s{0,}\,$/, '') :
				''
			// WORKAROUND: FCORE-12673
			if (r.match(/\W-|-\W/g)) {
				r = r.replace(/-/g, ' ')
			}
			return r
		}

		function deduplicate(d) {
			return d.filter(function (i, index, self) { return self.indexOf(i) === index })
		}

		function toNamesArray(d) {
			return deduplicate(
				d
					.map(cleanName)
					.filter(function (i) { return !!i })
			)
		}

		function validateNameEntries(d) {
			function isDiscardable(i) {
				return i.match(/ on | of | for |illustrat|university|אוניברסיט/i)
			}

			function appearsIn(list, s) {
				var listStr = list.join(' ')
				var meaningfulMatch = s.match(/[^\s\,\.\;]{4,}/g)
				var found = false
				if (meaningfulMatch) meaningfulMatch.forEach(function (i) {
					if (listStr.indexOf(i) !== -1) found = true
				})
				return found
			}

			var isLonelyAuthor = Array.isArray(d.authors) && d.authors.length === 1

			d.authors = d.authors.filter(function (i) {
				if (typeof i === 'string') {
					if (isDiscardable(i) && !isLonelyAuthor) {
						return false
					}
					var isEditor = i.match(/edited|editor|עורך/i)
					var isExplicitAuthor = i.match(/author|מחבר/i)
					// sure editor, possible author
					if (isEditor) {
						if (!appearsIn(d.editors, i)) {
							d.editors.push(cleanName(i))
						}
						return isExplicitAuthor ? true : false
					}
					// possible author
					if (!appearsIn(d.editors, i)) {
						return true
					} else if (isExplicitAuthor) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			})

			d.editors = d.editors.filter(function (i) { return !isDiscardable(i) })
		}

		function findEditors(d) {
			if (Array.isArray(d.editors)) {
				d.editors = d.editors.join(', ')
			}
			if (typeof d.editors === 'string') {
				var _editors = d.editors.trim()
				var _m = _editors.match(/;(.*)editor|;(.*)עורך/i) ||
					_editors.match(/(^\S.*)edit|(^\S.*)עורך/i) ||
					_editors.match(/edited by(.*);?/i)
				// console.log('findEditors/_matches:', _m)
				// NOTE: rember to check all catches
				var m = _m && (_m[1] || _m[2])
				if (m) {
					var s = m.split(/and/i)
					s = s.reduce(function (a, i) {
						return a.concat(i.split(','))
					}, [])
					d.editors = s
				} else {
					d.editors = []
				}
			}
		}

		function enforceArray(d, key) {
			if (!Array.isArray(d[key])) {
				d[key] = d[key] ? [d[key]] : []
			}
		}

		function format(d) {
			// console.log('format', JSON.stringify(d, 1, '  '))
			findEditors(d)
			enforceArray(d, 'authors')
			enforceArray(d, 'editors')
			validateNameEntries(d)
			d.authors = toNamesArray(d.authors)
			d.editors = toNamesArray(d.editors)
			// console.log('authors', d.authors)
			// console.log('editors', d.editors)
			if (typeof d.date === 'string') {
				d.date = d.date.trim().replace(/^c|^©|-$/gi, '')
			}
			if (d.publisher) {
				if (Array.isArray(d.publisher)) {
					d.publisher = d.publisher[0]
				}
				if (typeof d.publisher === 'string') {
					var publisherSplit = d.publisher.split(' :').map(function (i) { return i.trim() })
					if (publisherSplit.length > 1) {
						d.publisher = publisherSplit[1]
						d.publicationPlace = publisherSplit[0]
					}
				}
			}
			if (d.journal) {
				d.journal = d.journal.replace(/,.*/, '').trim()
			}
			if (Array.isArray(d.articleAbstract)) {
				d.articleAbstract = d.articleAbstract.join('\n')
			}
			return d
		}

		function merge(a, b) {
			Object.keys(b).forEach(function (k) { a[k] = b[k] })
		}

		try {
			merge(dominant, format(normalize(toObject(extraInfoElList))))
		} catch (e) {
			// console.log('F1000Annotator: Error: pageObjectIds._mergeDetails', e)
		}

		// console.log('_mergeDetails: dominant:', pageObjectIds.dominant)
	}
}
// Nature Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_natureSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		natureSearch: {
			item: {
				query: 'ol.clean-list > li'
			},
			authors: {
				query: 'li > span.js-separator',
				content: 'nextSibling'
			},
			journal: {
				query: 'div > div > div > a',
				content: 'textContent'
			},
			date: {
				query: 'p time',
				content: 'textContent'
			},
			uri: {
				query: 'h2 a',
				content: 'href'
			},
			title: {
				query: 'h2 a',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		// Reset
		if (reset) {
			this.pageType = null
			this.dominant = null
			this.ignoreListCount = false
			this.list = []
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			var journalRaw = item.querySelector(rules.journal.query)
			var journal = journalRaw && journalRaw.textContent ? journalRaw.textContent : null
			var volume = journalRaw && journalRaw.nextSibling ? journalRaw.nextSibling : null
			var issue = null
			var pages = volume && volume.nextSibling ? volume.nextSibling : null
			if (volume && volume.textContent) volume = volume.textContent
			if (pages && pages.textContent) pages = pages.textContent.replace(',', '').trim()
			var date = item.querySelector(rules.date.query)
			if (date && date.textContent) date = date.textContent
			var authors = item.querySelectorAll(rules.authors.query)
			authors = Array.prototype.map.call(authors, function (a) {
				var result = a[rules.authors.content]
				return result && result.textContent ? result.textContent : ''
			})
			//console.log(journal, volume, issue, pages, authors)
			var publisher = null
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				volume: volume,
				issue: issue,
				pages: pages,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// citeseer Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_citeseerSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		citeseerSearch: {
			item: {
				query: '.result'
			},
			authors: {
				query: '.authors',
				content: 'textContent'
			},
			journal: {
				query: '.pubvenue',
				clean: /^\W\s/
			},
			date: {
				query: '.pubyear',
				content: 'textContent'
			},
			uri: {
				query: 'a',
				content: 'href'
			},
			title: {
				query: 'a',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.trim()
			var journal = item.querySelector(rules.journal.query)
			if (journal && journal.textContent) {
				journal = journal.textContent.replace(rules.journal.clean, '')
			}
			var authors = item.querySelector(rules.authors.query)
			if (authors) {
				authors = authors.textContent.trim().replace(/^by/i, '')
				authors = authors.split(',').map(function (a) { return a.trim() })
			}
			var date = item.querySelector(rules.date.query)
			if (date) date = date.textContent.replace(/\D/g, '')
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: null,
				volume: null,
				issue: null,
				pages: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// emberPreprint Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_emberPreprintSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		emberPreprintSearch: {
			item: {
				query: '.search-result'
			},
			authors: {
				query: '.comma-list',
			},
			date: {
				query: '.pubyear',
				content: 'textContent'
			},
			uri: {
				query: 'h4 a',
				content: 'href'
			},
			title: {
				query: 'h4 a',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		// Reset
		if (reset) {
			this.pageType = null
			this.dominant = null
			this.ignoreListCount = false
			this.list = []
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.trim()
			var authors = item.querySelector(rules.authors.query)
			if (authors) {
				var etAli = authors.nextElementSibling
				authors = authors.querySelectorAll('li')
				authors = Array.prototype.map.call(authors, function (a) { return a.textContent })
				if (etAli && etAli.className && etAli.className.indexOf('text-muted') !== -1) {
					authors.push('et al.')
				}
			}
			var date = item.textContent.match(/edited:\s{0,}([\d-]+)/)
			date = date && date[1] ? date[1] : null
			var id = title
			// console.log(uri, title, authors, date)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: null,
				date: date,
				publisher: null,
				volume: null,
				issue: null,
				pages: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// espacenet Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_espacenetArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	scanDeferred: 1000,
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = null
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		var authors = []
		var date = null
		var publisher = null
		var journal = null
		var isbn = null
		var referenceType = null
		var articleAbstract = null
		// Patented
		var assignees = null
		var priorityNumber = null
		var applicationNumber = null
		var patentNumber = null
		var fillingDate = null
		var issuingAuthority = null
		// defaults
		referenceType = 'PATENT'
		// scraping
		var infos = document.querySelector('#pagebody')
		if (infos) {
			var numberDate = infos.querySelector('h1')
			numberDate = numberDate && numberDate.textContent
			if (numberDate) {
				var number = numberDate.match(/:([\s\S]*)―/)
				if (number && number[1]) {
					patentNumber = number[1].trim()
				}
				var publishingDate = numberDate.match(/―(.*)/)
				if (publishingDate && publishingDate[1]) {
					date = publishingDate[1].trim()
				}
			}
			var titleEl = infos.querySelector('h3')
			if (titleEl && titleEl.textContent) id = title = titleEl.textContent.trim()
			var infoRows = infos.querySelectorAll('tr')
			if (infoRows) {
				Array.prototype.forEach.call(infoRows, function (i) {
					if (!i.children || i.children.length < 2) return;
					var name = i.children[0] && i.children[0].textContent && i.children[0].textContent.trim()
					if (!name) return;
					var value = i.children[1]
					if (!value) return;
					if (name.match(/bookmark/i)) {
						var urlEl = value && value.querySelector('a')
						uri = urlEl && urlEl.href
					} else if (name.match(/inventor/i)) {
						var inventors = value.querySelector('span')
						if (inventors) {
							inventors = inventors.textContent.replace(/\s{2,}/g, '').replace(/\[.*\]/g, '').split(';')
						}
						authors = inventors
					} else if (name.match(/applicant/i)) {
						/*var applicant = value.querySelector('span')
						if (applicant && applicant.textContent) assignees = applicant.textContent.trim()*/
					} else if (name.match(/application.*number/i)) {
						var applicationNumberFillingDate = value && value.textContent && value.textContent.trim()
						if (applicationNumberFillingDate) {
							applicationNumberFillingDate = applicationNumberFillingDate.split(' ')
							applicationNumber = applicationNumberFillingDate[0]
							fillingDate = applicationNumberFillingDate[1]
						}

					} else if (name.match(/priority.*number/i)) {
						priorityNumber = value && value.querySelectorAll('span')
						if (priorityNumber) priorityNumber = Array.prototype.map.call(priorityNumber, function (i) {
							return i.textContent && i.textContent.trim()
						}).join(' ')
					}
				})
				// console.log(assignees, applicationNumber, priorityNumber, fillingDate)
			}
			var abstractEl = infos.querySelector('.printAbstract')
			if (abstractEl && abstractEl.textContent) {
				articleAbstract = abstractEl.textContent.trim()
			}
			// console.log(articleAbstract)
		}
		// console.log(id, uri, title, authors, date)
		// Dominant
		this.dominant = {
			id: id || title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: journal,
			authors: authors,
			publisher: publisher,
			date: date,
			isbn: isbn,
			referenceType: referenceType,
			articleAbstract: articleAbstract,
			// Patented
			assignees: assignees,
			applicationNumber: applicationNumber,
			priorityNumber: priorityNumber,
			patentNumber: patentNumber,
			fillingDate: fillingDate,
			issuingAuthority: issuingAuthority
		};
		this.pageType = 'ARTICLE'
		if (this.scanDeferred) {
			setTimeout(F1000Global.deferredInit, this.scanDeferred)
			this.scanDeferred = 0
		}
	}
}
// espacenet Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_espacenetSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		espacenetSearch: {
			item: {
				query: '.titleRowClass'
			},
			uri: {
				query: 'a.publicationLinkClass',
				content: 'href'
			},
			title: {
				query: 'a.publicationLinkClass',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scanDeferred: 1000,
	scan: function () {
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.trim()

			var itemChildrenIndex = Array.prototype.indexOf.call(item.parentElement.children, item)
			var infos = item.parentElement.children[itemChildrenIndex + 1]
			//console.log(infos)

			var authors = null
			var date = null
			var assignees = null
			var applicationNumber = null
			var priorityNumber = null
			var patentNumber = null
			var fillingDate = null
			var issuingAuthority = null

			if (infos) {
				var isCompactView = window.location.href.indexOf('compact=true') !== -1
				if (isCompactView) {
					var infoNodes = infos.querySelectorAll('td')
					var $patentNumber = infoNodes[2]
					var $date = infoNodes[3]
					if ($patentNumber && $patentNumber.textContent) patentNumber = $patentNumber.textContent.trim()
					if ($date && $date.textContent) date = $date.textContent.trim()
				} else {
					var inventors = infos.querySelector('.inventorColumn')
					if (inventors) {
						inventors = inventors.querySelector('span')
						if (inventors && inventors.textContent) {
							inventors = inventors.textContent.split('\n').map(function (i) {
								return i.replace(/\[.*\]/, '').trim()
							}).filter(function (i) {
								return i
							})
							if (inventors) authors = inventors
						}
					}
					/*var applicant = infos.querySelector('.applicantColumn')
					if (applicant) {
						applicant = applicant.querySelector('span')
						if (applicant && applicant.textContent) {
							applicant = applicant.textContent.split('\n').map(function (i) {
								return i.replace(/\[.*\]/, '').trim()
							}).filter(function (i) {
								return i
							})
							if (applicant) assignees = applicant
						}
					}*/
					var publicationInfo = infos.querySelector('.publicationInfoColumn')
					if (publicationInfo) {
						publicationInfo = publicationInfo.childNodes
						var $patentNumber = publicationInfo[2]
						var $date = publicationInfo[4]
						if ($patentNumber && $patentNumber.textContent) patentNumber = $patentNumber.textContent.trim()
						if ($date && $date.textContent) date = $date.textContent.trim()
					}
				}
			}
			var referenceType = 'PATENT'
			var id = title
			//console.log(id, uri, title, authors, assignees, date, patentNumber)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: null,
				date: null,
				publisher: null,
				volume: null,
				issue: null,
				pages: null,
				referenceType: referenceType,
				// Patented
				assignees: assignees,
				applicationNumber: applicationNumber,
				priorityNumber: priorityNumber,
				patentNumber: patentNumber,
				fillingDate: fillingDate,
				issuingAuthority: issuingAuthority,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
		if (this.scanDeferred) {
			setTimeout(F1000Global.deferredInit, this.scanDeferred)
			this.scanDeferred = 0
		}
	}
}
// SSRN Article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_ssrnArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	pageType: 'ARTICLE',
	scan: function () {
		this.alreadyRunned = true
		var generic = F1000Global.pageObjectIdsHandlers.genericIdsScanner
		generic.scan()
		this.list = generic.list
		F1000Global.ignoreListCount = true
		var dominant = generic.dominant
		// fill in data if not found in head
		var journal = null
		var volume = null
		var issue = null
		var pages = null
		var date = null
		var dateSuggested = null
		var extra = document.querySelector('.reference-info')
		if (extra) {
			extra = extra.textContent.trim()
			if (extra.indexOf(',') !== -1) {
				var extraSplit = extra.split(',')
				var journalRaw = extraSplit[0].trim()
				if (journalRaw) {
					journal = journalRaw
				}
			} else {
				var extraSplit = extra.split(' ')
				var journalRaw = extraSplit[0].trim()
				if (journalRaw) {
					journal = journalRaw
				}
			}
			var volumeRaw = extra.match(/vol\.?u?m?e?\s+(\d+)/i)
			if (volumeRaw && volumeRaw[1]) {
				volume = volumeRaw[1]
			}
			var issueRaw = extra.match(/no\.\s+(\d+)/i) || extra.match(/issue\s+(\d+)/i)
			if (issueRaw && issueRaw[1]) {
				issue = issueRaw[1]
			}
			var pagesRaw = extra.match(/pp?a?g?e?s?\.\s+([\d-]+)/i)
			if (pagesRaw && pagesRaw[1]) {
				pages = pagesRaw[1]
			}
			var dateSuggestedRaw = extra.match(/^\(\d\d\d\d\)|\d\d\d\d$/)
			if (dateSuggestedRaw && dateSuggestedRaw[0]) {
				dateSuggested = dateSuggestedRaw[0]
			}
		}
		date = dateSuggested
		dominant.journal = dominant.journal || journal
		dominant.volume = dominant.volume || volume
		dominant.issue = dominant.issue || issue
		dominant.pages = dominant.pages || pages
		dominant.date = dominant.date || date
		this.dominant = dominant
	}
}
// SSRN Search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_ssrnSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		ssrnSearch: {
			item: {
				query: '.results > .tbody > .trow > .description'
			},
			uri: {
				query: 'a',
				content: 'href'
			},
			title: {
				query: 'a',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function () {
		var rules = this.rules[this.domain]
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// console.log(item)
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.trim()
			var authors = item.querySelectorAll('.authors-list a')
			if (authors) {
				authors = Array.prototype.map.call(authors, function (i) { return i.textContent.trim() })
			}
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var dateSuggested = null
			var extra = item.querySelector('i')
			if (extra) {
				extra = extra.textContent.trim()
				// console.log(extra)
				if (extra.indexOf(',') !== -1) {
					var extraSplit = extra.split(',')
					var journalRaw = extraSplit[0].trim()
					if (journalRaw) {
						journal = journalRaw
					}
				} else {
					var extraSplit = extra.split(' ')
					var journalRaw = extraSplit[0].trim()
					if (journalRaw) {
						journal = journalRaw
					}
				}
				var volumeRaw = extra.match(/vol\.?u?m?e?\s+(\d+)/i)
				if (volumeRaw && volumeRaw[1]) {
					volume = volumeRaw[1]
				}
				var issueRaw = extra.match(/no\.\s+(\d+)/i) || extra.match(/issue\s+(\d+)/i)
				if (issueRaw && issueRaw[1]) {
					issue = issueRaw[1]
				}
				var pagesRaw = extra.match(/pp?a?g?e?s?\.\s+([\d-]+)/i)
				if (pagesRaw && pagesRaw[1]) {
					pages = pagesRaw[1]
				}
				var dateSuggestedRaw = extra.match(/^\(\d\d\d\d\)|[\s-]\d\d\d\d$/)
				if (dateSuggestedRaw && dateSuggestedRaw[0]) {
					dateSuggested = dateSuggestedRaw[0]
				}
			}
			var date = null
			if (dateSuggested) {
				date = dateSuggested
			} else {
				var dateEl = item.querySelector('.note')
				if (dateEl) {
					var dateRaw = dateEl.textContent
					dateRaw = dateRaw.match(/revised:(.*)/i) || dateRaw.match(/posted:(.*)/i)
					if (dateRaw && dateRaw[1]) {
						date = dateRaw[1].trim()
					}
				}
			}
			var keywords = null
			var keywordsEl = item.querySelector('.keywords')
			if (keywordsEl) {
				var keywordsRaw = keywordsEl.textContent
				if (keywordsRaw.length > 3) {
					keywords = keywordsRaw
						.replace(/keywords?:?/i, '')
						.replace(/,?\s{0,}\.\.\./i, '')
						.trim()
				}
			}
			// console.log(title, authors, journal, volume, issue, pages, date, keywords)
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: null,
				volume: volume,
				issue: issue,
				pages: pages,
				keywords: keywords,
				referenceType: null,
				// Patentednull
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// hdasNice
F1000Global.pageObjectIdsHandlers.htmlContentScanner_hdasNice = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		hdasNice: {
			item: {
				query: '.result-container'
			},
			uri: {
				query: '.result-heading a',
				content: 'href'
			},
			title: {
				query: '.result-heading a',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset, optionsObject) {
		var options = optionsObject || { isSearch: false, root: document.body }
		var rules = this.rules[this.domain]
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		// grabs both article and search, we will normalize later
		var items = options.root.querySelectorAll(rules.item.query)
		if (!options.isSearch && items[0]) {
			items = [items[0]]
		}
		for (var i = 0; i < items.length; i++) {
			var type = rules.type
			var item = items[i]
			if (options.isSearch) {
				var uri = item.querySelector(rules.uri.query)
				uri = uri ? uri[rules.uri.content] : null
			} else {
				var uri = location.href
			}
			if (!uri) continue;
			if (options.isSearch) {
				var title = item.querySelector(rules.title.query)
				title = title ? title[rules.title.content] : null
			} else {
				var title = item.querySelector('h3')
				title = title ? title.textContent : null
			}
			if (!title) continue;
			title = title.trim().replace(/^\d+\./, '').trim()
			var authors = null
			var authorsRaw = ''
			var authorsAll = item.querySelector('.result-row[data-field="authors"]')
			if (authorsAll) {
				authorsRaw = authorsAll.textContent.replace(/author\(?s?\)?:?/i, '').trim()
			} else {
				var authorsPartial = item.querySelector('.partial-author-list')
				authorsRaw = authorsPartial ? authorsPartial.textContent : ''
				var authorsExtended = item.querySelector('.complete-author-list')
				if (authorsExtended) {
					authorsRaw += ';' + authorsExtended.textContent
				}
			}
			if (authorsRaw.length > 0) {
				authors = authorsRaw.split(';').map(function (i) { return i.replace(/\./g, ' ').trim() })
			}
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var articleAbstract = null
			var keywords = null
			var doi = null
			var sourceEl = item.querySelector('.result-row[data-field="source"]')
			if (sourceEl && sourceEl.textContent.length > 2) {
				var sourceRaw = sourceEl.textContent
				var journalMatch = sourceRaw.replace(/[\n\t]/g, ' ').match(/(^.*?);/)
				if (journalMatch && journalMatch[1]) {
					journal = journalMatch[1].replace(/source:?/i, '').trim()
				}
				var volumeMatch = sourceRaw.match(/vol\.\s{0,}([\d]+)/)
				if (volumeMatch && volumeMatch[1]) {
					volume = volumeMatch[1]
				}
				var issueMatch = sourceRaw.match(/no\.\s{0,}([\d]+)/)
				if (issueMatch && issueMatch[1]) {
					issue = issueMatch[1]
				}
				var pagesMatch = sourceRaw.match(/p\.\s{0,}([\d-]+)/)
				if (pagesMatch && pagesMatch[1]) {
					pages = pagesMatch[1]
				}
			}
			var dateEl = item.querySelector('.result-row[data-field="publicationdate"]')
			if (dateEl) {
				var dateRaw = dateEl.innerHTML.replace(/.*>/, '').trim()
				if (dateRaw && dateRaw.length > 0) {
					date = dateRaw
				}
			}
			var abstractEl =
				item.querySelector('.abstract-content p') ||
				item.querySelector('.result-row[data-field="abstract"] p')
			if (abstractEl) {
				var abstractRaw = abstractEl.textContent.replace(/^abstract:?/i, '').trim()
				if (abstractRaw.length > 0) {
					articleAbstract = abstractRaw
				}
			}
			var keywordsEl = item.querySelector('[data-field="subjectterms"] .result-detail-text')
			if (keywordsEl) {
				var keywordsRaw = keywordsEl.textContent
				if (keywordsRaw.length > 0) {
					keywords = keywordsRaw.trim().replace(/;/g, ',')
				}
			}
			var doiEl = item.querySelector('.result-row[data-field="doi"] a')
			if (doiEl) {
				var doiRaw = doiEl.textContent.trim()
				if (doiRaw.length > 5) {
					doi = doiRaw
				}
			}
			var id = title
			if (doi) {
				id = doi
				type = 'DigitalObjectId'
			}
			// console.log(title, authors, journal, volume, issue, pages, date, articleAbstract, doi, keywords)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: null,
				volume: volume,
				issue: issue,
				pages: pages,
				keywords: keywords,
				articleAbstract: articleAbstract,
				referenceType: null,
				// Patentednull
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		if (options.isSearch) {
			this.pageType = 'REFERENCES'
		} else {
			if (this.list.length > 0) {
				this.dominant = this.list[0]
				this.list = []
				this.pageType = 'ARTICLE'
			}
		}
	}
}
// ovid search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_ovidSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		ovidSearch: {
			item: {
				query: 'tr .titles-record'
			},
			uri: {
				query: '.titles-title a',
				content: 'href'
			},
			title: {
				query: '.titles-title',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var options = { isSearch: true, root: document.body }
		var rules = this.rules[this.domain]
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// scraper
		var items = options.root.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			// console.log(item)
			var type = rules.type
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.trim().replace(/opens external.*/i, '').replace(/\[.*\]/g, '').trim()
			var authors = null
			var authorsRaw = ''
			var authorsAll = item.querySelector('.article-authors')
			if (authorsAll) {
				authorsRaw = authorsAll.textContent
				if (authorsRaw.length > 2) {
					if (authorsRaw.indexOf(';') !== -1) {
						authors = authorsRaw.split(';').map(function (i) { return i.replace(/\./, '').trim() })
					} else {
						authors = authorsRaw.split(', ').map(function (i) { return i.replace(/\./, '').trim() })
					}
				}
			}
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var sourceEl = item.querySelector('.titles-source')
			if (sourceEl && sourceEl.textContent.length > 2) {
				var sourceRaw = sourceEl.textContent
				var journalMatch = sourceRaw.match(/(^.*?)\./)
				if (journalMatch && journalMatch[1]) {
					journal = journalMatch[1].replace(/source:?/i, '').trim()
				}
				var volumeMatch = sourceRaw.match(/\.\s(\d+)/)
				if (volumeMatch && volumeMatch[1]) {
					volume = volumeMatch[1]
				}
				var issueMatch = sourceRaw.match(/\.\s\d+\((\d+)\)/)
				if (issueMatch && issueMatch[1]) {
					issue = issueMatch[1]
				}
				var pagesMatch = sourceRaw.match(/\:([\d-]+)/)
				if (pagesMatch && pagesMatch[1]) {
					pages = pagesMatch[1]
				}
				var dateMatch = sourceRaw.match(/,([\d-\s]*).?$/) || sourceRaw.match(/publication:\D+(\d+).$/i)
				if (dateMatch && dateMatch[1]) {
					date = dateMatch[1]
				}
			}
			var id = title
			// console.log(title, authors, journal, volume, issue, pages, date)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: null,
				volume: volume,
				issue: issue,
				pages: pages,
				keywords: null,
				articleAbstract: null,
				referenceType: null,
				// Patentednull
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// uspto_gov Article
//
// NOTE: Doesn't work: used CSS paths are arbitrary to this document, will fails almost everywhere else:
// http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=2&f=G&l=50&co1=AND&d=PTXT&s1=energy&OS=energy&RS=energy
//
/*F1000Global.pageObjectIdsHandlers.htmlContentScanner_uspto_govArticle = {
	alreadyRunned: false,
	dominant: {},
	list: [],
	scan: function () {
		// fallback
		var type = "CompositeArticleId"
		var id = null
		var uri = document.location.href
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		var authors = []
		var date = null
		var publisher = null
		var journal = null
		var isbn = null
		var referenceType = null
		var articleAbstract = null
		// Patented
		var assignees = null
		var priorityNumber = null
		var applicationNumber = null
		var patentNumber = null
		var fillingDate = null
		var issuingAuthority = null
		// defaults
		referenceType = 'PATENT'
		// scraping
		var $issuingAuthority = document.querySelector('body > table:nth-child(5) > tbody > tr:nth-child(1) > td:nth-child(1)')
		if ($issuingAuthority && $issuingAuthority.textContent) issuingAuthority = $issuingAuthority.textContent.trim()
		var $patentNumber = document.querySelector('body > table:nth-child(5) > tbody > tr:nth-child(1) > td:nth-child(2)')
		if ($patentNumber && $patentNumber.textContent) patentNumber = $patentNumber.textContent.trim()
		var $title = document.querySelector('body > font')
		if ($title && $title.textContent) title = $title.textContent.trim()
		var $date = document.querySelector('body > table:nth-child(5) > tbody > tr:nth-child(2) > td:nth-child(2) > b')
		if ($date && $date.textContent) date = $date.textContent.trim()
		var $articleAbstract = document.querySelector('body > hr:nth-child(11)')
		if ($articleAbstract && $articleAbstract.nextSibling) {
			articleAbstract = ''
			while ($articleAbstract.nextSibling &&
				!($articleAbstract.nextSibling.nodeName.match(/hr/i))) {
				$articleAbstract = $articleAbstract.nextSibling
				if ($articleAbstract && $articleAbstract.textContent) {
					articleAbstract += ' ' + $articleAbstract.textContent.trim()
				}
			}
			articleAbstract.replace('CLAIM ', '')
		}
		var $authors = document.querySelectorAll('body > table:nth-child(14) > tbody > tr:nth-child(1) > td b')
		if ($authors && $authors.length > 0) {
			authors = Array.prototype.filter.call($authors, function (a) {
				return a && a.textContent
			}).map(function (a) {
				return a.textContent.trim().replace(', ', '')
			})
		}
		var $fillingDate = document.querySelector('body > table:nth-child(14) > tbody > tr:nth-child(5) > td > b')
		if ($fillingDate && $fillingDate.textContent) fillingDate = $fillingDate.textContent.trim()
		var $assignees = document.querySelector('body > table:nth-child(14) > tbody > tr:nth-child(3) > td > b')
		if ($assignees && $assignees.textContent) assignees = $assignees.textContent.trim()
		var $applicationNumber = document.querySelector('body > table:nth-child(14) > tbody > tr:nth-child(4) > td > b')
		if ($applicationNumber && $applicationNumber.textContent) applicationNumber = $applicationNumber.textContent.trim()
		// That's all folks
		var id = title
		//console.log(id, uri, title, authors, date)
		// Dominant
		this.dominant = {
			id: id || title,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: journal,
			authors: authors,
			publisher: publisher,
			date: date,
			isbn: isbn,
			referenceType: referenceType,
			articleAbstract: articleAbstract,
			// Patented
			assignees: assignees,
			applicationNumber: applicationNumber,
			priorityNumber: priorityNumber,
			patentNumber: patentNumber,
			fillingDate: fillingDate,
			issuingAuthority: issuingAuthority
		};
		this.pageType = 'ARTICLE'
	}
}*/
// cochranelibrary search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_cochranelibrarySearch = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		cochranelibrarySearch: {
			item: {
				query: '.search-results-item-body'
			},
			uri: {
				query: '.result-title a',
				content: 'href'
			},
			title: {
				query: '.result-title',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		// external flag
		this.alreadyRunned = true
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Scrape results
		this.pageType = 'REFERENCES'
		var resultsCountInfo = document.querySelector('.results-count')
		var isTrialsTab = resultsCountInfo && resultsCountInfo.textContent.match(/trials/i)
		// by ids
		if (!isTrialsTab) {
			var generic = F1000Global.pageObjectIdsHandlers.genericIdsScanner
			generic.scan(reset)
			this.dominant = generic.dominant
			this.list = generic.list
			return
		}
		// by metadata
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.trim()
			var authors = null
			var authorsRaw = item.querySelector('.search-result-authors')
			if (authorsRaw) {
				var _authors = authorsRaw.textContent.split(', ')
					.map(function (a) {
						return a.trim()
					}).filter(function (a) {
						return ~a.indexOf(' ')
					})
				if (_authors.length > 0) {
					authors = _authors
				}
			}
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var metadataEl = item.querySelector('.search-result-metadata-item')
			var metadataRaw = metadataEl && metadataEl.textContent
			if (metadataRaw) {
				var _journal = metadataRaw.match(/(.*?), \d/)
				if (_journal && _journal[1]) {
					_journal = _journal[1].split('(')
					journal = _journal[0].trim()
				}
				var _date = metadataRaw.match(/, (\d\d\d\d)/)
				if (_date && _date[1]) {
					date = _date[1]
				}
			}
			// console.log(title, authors, journal, volume, issue, pages, date)
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: null,
				volume: volume,
				issue: issue,
				pages: pages,
				keywords: null,
				referenceType: null,
				// Patented
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
	}
}
// Agricola search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_agricolaSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		agricolaSearch: {
			item: {
				query: '#resultList > div'
			},
			uri: {
				query: '.line1Link a',
				content: 'href'
			},
			title: {
				query: '.line1Link',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		// external flag
		this.alreadyRunned = true
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Scrape results
		this.pageType = 'REFERENCES'
		var type = rules.type
		var items = document.querySelectorAll(rules.item.query)
		for (var i = 0; i < items.length; i++) {
			console.log(item)
			var item = items[i]
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.replace(/\/.*/, '').trim()
			var authors = null
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var authorsEl = item.querySelector('.line3Link')
			if (authorsEl) {
				var _authors = authorsEl.textContent
					.replace(/\(.*/, '')
					.replace(/\d/g, '')
					.trim()
					.replace(/[,\s-]*$/g, '')
					.trim()
				if (_authors.length > 3) {
					authors = [_authors]
				}
			}
			var dateEl = item.querySelector('.line2Link')
			if (dateEl) {
				var _date = dateEl.textContent.match(/\d\d\d\d/)
				if (_date && _date[0]) {
					date = _date[0]
				}
			}
			// console.log(title, authors, journal, volume, issue, pages, date)
			var referenceType = 'BOOK'
			var id = title
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: null,
				volume: volume,
				issue: issue,
				pages: pages,
				keywords: null,
				referenceType: referenceType,
				// Patented
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
	}
}
// Agricola detail
F1000Global.pageObjectIdsHandlers.htmlContentScanner_agricolaDetail = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		agricolaDetail: {
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		var type = rules.type
		// external flag
		this.alreadyRunned = true
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var uri = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// by metadata
		var item = document.querySelector('#divbib ul')
		if (!item) {
			return
		}
		this.pageType = 'ARTICLE'
		var rows = item.querySelectorAll('li')
		var data = Array.prototype.reduce.call(rows, function (acc, i) {
			var _label = i.querySelector('.fieldLabelSpan')
			var _content = i.querySelector('.subfieldData')
			var label = _label && _label.textContent.trim()
			var content = _content && _content.textContent.trim()
			if (label) {
				label = label.toLowerCase().replace(':', '').trim()
			}
			if (label && content) {
				acc[label] = content
			}
			return acc
		}, {})
		// console.log(data)
		if (data.title) {
			var _title = data.title.replace(/\/.*/, '').trim()
			if (title.length > 3) title = _title
		}
		var authors = null
		if (data.author) {
			var _author = data.author.replace(/,$/, '')
			if (_author.length > 3) authors = [_author]
		}
		var abstract = data.abstract || null
		var keywords = null
		if (data.subjects) {
			keywords = data.subjects.split('.').map(function (i) {
				return i.trim()
			}).filter(function (i) {
				return !!i.trim()
			}).join(', ')
		}
		var isbn = null
		if (data.isbn) {
			var _isbn = data.isbn.split(' ')
			isbn = _isbn[0].trim()
		}
		var referenceType = 'BOOK'
		var id = title
		this.dominant = {
			id: id,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: null,
			authors: authors,
			publisher: null,
			date: null,
			isbn: isbn,
			keywords: keywords,
			articleAbstract: abstract,
			referenceType: referenceType
		}
	}
}
// EBSCOHOST search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_ebscohost_search = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		ebscohost_search: {
			uri: {
				query: 'a',
				content: 'href'
			},
			title: {
				query: 'a',
				content: 'textContent'
			},
			type: 'CompositeArticleId'
		}
	},
	pageType: 'REFERENCES',
	scan: function (reset) {
		var rules = this.rules[this.domain]
		var referrer = document.referrer
		if (reset) {
			this.dominant = {}
			this.list = []
		}
		pageObjectIds.dominant = {
			authors: null,
			date: null,
			id: document.title,
			isbn: null,
			journal: null,
			pageTitle: document.title,
			publisher: null,
			referrer: document.referrer,
			type: 'PageTitle',
			uri: location.href
		}
		// scrape
		var items = document.body.querySelectorAll('.result-list-record')
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// console.log(item)
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.replace(/\/.*/, '').trim()
			var type = rules.type
			var id = title
			var authors = null
			var publisher = null
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var isbn = null
			var issn = null
			var keywords = null
			var referenceType = null
			var iconEl = item.querySelector('.record-icon')
			if (iconEl && iconEl.textContent.match(/book/i)) {
				referenceType = 'BOOK'
			}
			var infoEl = item.querySelector('.display-info')
			if (infoEl) {
				var infoRaw = infoEl.textContent
				// NOTE: only 9/10 of authors are catched cause otherwise we collect garbage
				var authorsRaw = infoRaw.match(/by:?(.*?)\./i)
				if (authorsRaw && authorsRaw[1]) {
					authorsRaw = authorsRaw[1]
					var _authors = authorsRaw.split(';')
					authors = _authors
						.map(function (i) { return i.trim() })
						.filter(function (i) { return !i.match(/[\(\[]|\.$/) })
						.filter(function (i) { return i.match(/\s/) })
				}

			}
			var amplitudeMetas = null
			try {
				amplitudeMetas =
					item.dataset &&
					item.dataset.amplitude &&
					JSON.parse(item.dataset.amplitude)
			} catch (e) {
				// console.log(e)
			}
			// console.log(amplitudeMetas)
			if (amplitudeMetas) {
				if (amplitudeMetas.doi) {
					id = amplitudeMetas.doi
					type = 'DigitalObjectId'
				}
				if (amplitudeMetas.title) title = amplitudeMetas.title
				if (amplitudeMetas.publisher) publisher = amplitudeMetas.publisher
				if (amplitudeMetas.pub_year) date = amplitudeMetas.pub_year
				if (amplitudeMetas.subjects) {
					keywords = amplitudeMetas.subjects.join(', ')
				}
				if (amplitudeMetas.bkinfo) {
					var bkinfo = amplitudeMetas.bkinfo
					if (bkinfo.isbn && bkinfo.isbn.length && bkinfo.isbn.length > 0) {
						isbn = bkinfo.isbn[bkinfo.isbn.length - 1]
					}
					if (bkinfo.issn && bkinfo.issn.length && bkinfo.issn.length > 0) {
						issn = bkinfo.issn[bkinfo.issn.length - 1]
					}
				}
			}
			// console.log(referenceType, id, title, authors, journal, volume, issue, pages, date)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				volume: volume,
				issue: issue,
				pages: pages,
				isbn: isbn,
				issn: issn,
				keywords: keywords,
				referenceType: referenceType,
				// Patented
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
	}
}
// EBSCOHOST article
F1000Global.pageObjectIdsHandlers.htmlContentScanner_ebscohost_article = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		ebscohost_article: {}
	},
	scan: function (reset) {
		var genericScanner = F1000Global.pageObjectIdsHandlers.genericIdsScanner
		genericScanner.scan(reset)
		this.dominant = JSON.parse(JSON.stringify(genericScanner.dominant))
		// Refine
		var mainCitationEl = document.querySelector('.citation-wrapping-div')
		if (mainCitationEl) {
			pageObjectIds.pageType = 'ARTICLE'
			pageObjectIds.dominant.type = 'CompositeArticleId'
			// Enjoy some manual data for starter
			var details = document.querySelectorAll('dt')
			// book
			var isBook = false
			var publicationTypeLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/publication type|resource type/i)
			})[0]
			var publicationTypeValue = publicationTypeLabel && publicationTypeLabel.nextSibling
			if (publicationTypeValue && publicationTypeValue.textContent) {
				if (publicationTypeValue.textContent.match(/book/i)) {
					isBook = true
				}
			}
			var isbnLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/isbn/i)
			})[0]
			var issnLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/issn/i)
			})[0]
			if (isbnLabel || issnLabel) {
				var isbn = null
				var issn = null
				var isbnValue = isbnLabel && isbnLabel.nextSibling
				if (isbnValue && isbnValue.innerHTML) {
					var _isbn = isbnValue.innerHTML.match(/([\d-]+)/)
					if (_isbn && _isbn[1]) isbn = _isbn[1]
				}
				var issnValue = issnLabel && issnLabel.nextSibling
				if (issnValue && issnValue.innerHTML) {
					var _issn = issnValue.innerHTML.match(/([\d-]+)/)
					if (_issn && _issn[1]) issn = _issn[1]
				}
				if (isbn || issn) {
					isBook = true
					pageObjectIds.dominant.isbn = isbn
					pageObjectIds.dominant.issn = issn
				}
			}
			if (isBook) {
				pageObjectIds.dominant.referenceType = 'BOOK'
			}
			// title
			var titleEl = document.querySelector('.citation-title')
			if (titleEl && titleEl.textContent) {
				pageObjectIds.dominant.pageTitle =
					pageObjectIds.dominant.title =
					pageObjectIds.dominant.id =
					titleEl.textContent.replace(/\/.*/, '').trim()
			}
			var authors = null
			// authors
			var authorsLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/author/i)
			})[0]
			var authorsValue = authorsLabel && authorsLabel.nextSibling
			if (authorsValue) {
				var authorsAnchors = authorsValue.querySelectorAll('a')
				authors = Array.prototype.map.call(authorsAnchors, function (i) {
					return i.textContent
				}).filter(function (i) {
					return i.length > 2
				})
				if (authors.length > 0) {
					pageObjectIds.dominant.authors = authors
				}
			}
			// infos
			var date = null
			var publisher = null
			var volume = null
			var pages = null
			var infos = null
			var infosLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/^source/i)
			})[0]
			var infosValue = infosLabel && infosLabel.nextSibling
			if (infosValue && infosValue.textContent) infos = infosValue.textContent
			if (infos) {
				infos = infos.split(/\.|,|;/)
				publisher = infos[0]
				if (publisher) pageObjectIds.dominant.publisher = publisher.trim()
				date = infos[1]
				if (date) {
					var _date = date.match(/(\d\d\d\d)/)
					if (_date && _date[1]) {
						pageObjectIds.dominant.date = _date[1]
					}
				}
				volume = infos[2]
				if (volume) pageObjectIds.dominant.volume = volume.replace(/\D/g, ' ').trim()
				pages = infos[3]
				if (pages) pageObjectIds.dominant.pages = pages.replace(/[^\d-]/g, '').trim()
			} else {
				var publicationInfoLabel = Array.prototype.filter.call(details, function (i) {
					return i.textContent && i.textContent.match(/^publication info/i)
				})[0]
				var publicationInfoValue = publicationInfoLabel && publicationInfoLabel.nextSibling
				if (publicationInfoValue) {
					var publicationInfoRaw = publicationInfoValue.textContent
					var _date = publicationInfoRaw.match(/(\d\d\d\d)/)
					if (_date && _date[1]) {
						pageObjectIds.dominant.date = _date[1]
					}
					var _publicationPlace = publicationInfoRaw.match(/^(.*?):/)
					if (_publicationPlace && _publicationPlace[1]) {
						pageObjectIds.dominant.publicationPlace = _publicationPlace[1].trim()
					}
					var _publisher = publicationInfoRaw.match(/:(.*?),/)
					if (_publisher && _publisher[1]) {
						pageObjectIds.dominant.publisher = _publisher[1].trim()
					}
				}
			}
			var articleAbstractLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/abstract/i)
			})[0]
			var articleAbstractValue = articleAbstractLabel && articleAbstractLabel.nextSibling
			if (articleAbstractValue && articleAbstractValue.textContent) {
				pageObjectIds.dominant.articleAbstract = articleAbstractValue.textContent.trim()
			}
			if (!pageObjectIds.dominant.date) {
				var dateLabel = Array.prototype.filter.call(details, function (i) {
					return i.textContent && i.textContent.match(/date/i)
				})[0]
				var dateLabelValue = dateLabel && dateLabel.nextSibling
				if (dateLabelValue && dateLabelValue.textContent) {
					pageObjectIds.dominant.date = dateLabelValue.textContent.trim()
				}
			}
			if (!pageObjectIds.dominant.date) {
				var copyright = document.body.textContent.match(/Copyright:.*?(\d[\d-]+)/i)
				if (copyright && copyright[1]) {
					pageObjectIds.dominant.date = copyright[1].trim()
				}
			}
			// keywords
			var keywords = null
			var keywordsLabel = Array.prototype.filter.call(details, function (i) {
				return i.textContent && i.textContent.match(/subject terms/i)
			})[0]
			var keywordsValue = keywordsLabel && keywordsLabel.nextSibling
			if (keywordsValue) {
				var _keywords = keywordsValue.querySelectorAll('a')
				if (_keywords) {
					keywords = Array.prototype.map.call(_keywords, function (i) {
						return i.textContent.trim()
					})
					pageObjectIds.dominant.keywords = keywords.join(', ')
				}
			}
			// doi
			var supposedDOI = mainCitationEl.innerHTML.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
			if (supposedDOI && supposedDOI[0]) {
				supposedDOI = supposedDOI[0]
				if (supposedDOI.length > 5) {
					pageObjectIds.dominant.id = supposedDOI.replace('/full', '')
					pageObjectIds.dominant.type = 'DigitalObjectId'
					pageObjectIds.dominant.matchType = null
				}
			}
			if (pageObjectIds.dominant.uri.indexOf('#') !== -1) {
				// try to make a stable url, this mocks the url loaded by "permanet link" button
				pageObjectIds.dominant.uri = (
					'http://search.ebscohost.com/login.aspx?direct=true&' +
					pageObjectIds.dominant.uri.replace(/.*#/, '')
				)
			}
			// references
			var supposedCitations = mainCitationEl.textContent.match(/PMID:\D*(\d+)/gi)
			if (Array.isArray(supposedCitations)) {
				supposedCitations = supposedCitations.map(function (id) {
					return {
						authors: null,
						date: null,
						id: id.replace(/[\D:]/g, ''),
						isbn: null,
						journal: null,
						marginalDistance: 1,
						pageTitle: document.title,
						position: 1,
						publisher: null,
						referrer: document.referrer,
						type: "PubMedId",
						uri: location.href
					}
				})
				pageObjectIds.list = supposedCitations
			}
		}
	}
}
// ElsevierHealth search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_elsevierhealth_search = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		elsevierhealth_search: {
			uri: {
				query: 'a',
				content: 'href'
			},
			title: {
				query: 'a',
				content: 'title'
			},
			type: 'CompositeArticleId'
		}
	},
	pageType: 'REFERENCES',
	scan: function (reset) {
		var rules = this.rules[this.domain]
		var referrer = document.referrer
		if (reset) {
			this.dominant = {}
			this.list = []
		}
		pageObjectIds.dominant = {
			authors: null,
			date: null,
			id: document.title,
			isbn: null,
			journal: null,
			pageTitle: document.title,
			publisher: null,
			referrer: document.referrer,
			type: 'PageTitle',
			uri: location.href
		}
		// scrape
		var items = document.body.querySelectorAll('.product-box')
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// console.log(item)
			var uri = item.querySelector(rules.uri.query)
			uri = uri ? uri[rules.uri.content] : null
			if (!uri) continue;
			var title = item.querySelector(rules.title.query)
			title = title ? title[rules.title.content] : null
			if (!title) continue;
			title = title.replace(/\/.*/, '').trim()
			var type = rules.type
			var id = title
			var authors = null
			var publisher = null
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var isbn = null
			var issn = null
			var keywords = null
			var referenceType = null
			var iconEl = item.querySelector('.covertypelist')
			if (iconEl && iconEl.textContent.match(/book/i)) {
				referenceType = 'BOOK'
			}
			var authorEl = item.querySelector('.author')
			if (authorEl && authorEl.textContent) {
				authors = [authorEl.textContent.trim()]
			}
			var dateEl = item.querySelector('.pub_date')
			if (dateEl && dateEl.textContent) {
				date = dateEl.textContent.trim()
			}
			// console.log(referenceType, id, title, authors, journal, volume, issue, pages, date)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				volume: volume,
				issue: issue,
				pages: pages,
				isbn: isbn,
				issn: issn,
				keywords: keywords,
				referenceType: referenceType,
				// Patented
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
	}
}
// ElsevierHealth detail
F1000Global.pageObjectIdsHandlers.htmlContentScanner_elsevierhealth_detail = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		elsevierhealth_detail: {
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		var type = rules.type
		// external flag
		this.alreadyRunned = true
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var uri = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// by metadata
		var item = document.querySelector('.product-collateral')
		if (!item) {
			return
		}
		this.pageType = 'ARTICLE'
		var titleEl = document.body.querySelector('h1')
		if (titleEl) {
			title = titleEl.textContent.trim()
		}
		var date = null
		var dateMatch = item.textContent.match(/date[\s\w]+(\d\d\d\d)/i)
		if (dateMatch && dateMatch[1]) {
			date = dateMatch[1]
		}
		var authors = null
		var authorsEls = (
			document.body.querySelector('.product-specifications') ||
			document.body
		).querySelectorAll('.product-specifications .short-description-des a')
		if (authorsEls.length > 0) {
			authors = Array.prototype.map.call(authorsEls, function (i) {
				return i.textContent.trim()
			})
		}
		var abstract = null
		var panel1 = item.querySelector('#panel1')
		if (panel1) {
			abstract = panel1.textContent.replace(/author info[\w\W]*/i, '').trim()
		}
		var isbn = null
		var isbnMatch = item.textContent.match(/isbn\s+(\d+)/i)
		if (isbnMatch && isbnMatch[1]) {
			isbn = isbnMatch[1].trim()
		}
		var isBook = item.textContent.match(/producttype\s+e?book/i)
		if (isBook) {
			var referenceType = 'BOOK'
		}
		var id = title
		this.dominant = {
			id: id,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: null,
			authors: authors,
			publisher: null,
			date: date,
			isbn: isbn,
			keywords: null,
			articleAbstract: abstract,
			referenceType: referenceType
		}
		// console.log(this.dominant)
	}
}
// Elsevier books
F1000Global.pageObjectIdsHandlers.htmlContentScanner_elsevier_books = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	rules: {
		elsevier_books: {
			type: 'CompositeArticleId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		var type = rules.type
		// external flag
		this.alreadyRunned = true
		// Reset
		if (reset) {
			this.pageType = null;
			this.dominant = null;
			this.ignoreListCount = false;
			this.list = [];
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var uri = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// by metadata
		var item = document.querySelector('.book-intro-content')
		console.log(item)
		if (!item) {
			return
		}
		this.pageType = 'ARTICLE'
		var titleEl = item.querySelector('h1')
		if (titleEl) {
			title = titleEl.textContent.trim()
		}
		var edition = null
		var editionEl = item.querySelector('h2')
		if (editionEl) {
			edition = editionEl.textContent.trim()
		}
		var date = null
		var dateMatch = item.textContent.match(/date:[\s\w]+(\d\d\d\d)/i)
		if (dateMatch && dateMatch[1]) {
			date = dateMatch[1]
		}
		var authors = null
		var authorsEls = document.body.querySelectorAll('.contributor-content > header')
		if (authorsEls.length === 0) {
			authorsEls = document.body.querySelectorAll('.contributor-content > div > header')
		}
		if (authorsEls.length > 0) {
			authors = Array.prototype.map.call(authorsEls, function (i) {
				return i.textContent.replace(/serial.*|editor.*|author.*/i, '').trim()
			})
		}
		var abstract = null
		var descriptionEl = document.body.querySelector('#description p')
		if (descriptionEl) {
			abstract = descriptionEl.textContent.trim()
		}
		var isbn = null
		var isbnMatch = item.textContent.match(/isbn:?\s+(\d+)/i)
		if (isbnMatch && isbnMatch[1]) {
			isbn = isbnMatch[1].trim()
		}
		var referenceType = 'BOOK'
		var id = title
		this.dominant = {
			id: id,
			type: type,
			uri: uri,
			pageTitle: title,
			referrer: referrer,
			// Metadata
			journal: null,
			authors: authors,
			publisher: null,
			date: date,
			isbn: isbn,
			keywords: null,
			articleAbstract: abstract,
			referenceType: referenceType,
			edition: edition
		}
		// console.log(this.dominant)
	}
}
// researchGate search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_researchGateSearch = {
	alreadyRunned: false,
	domain: null,
	dominant: {},
	list: [],
	// rules: {
	// 	researchGateSearch: {
	// 		uri: {
	// 			query: 'a',
	// 			content: 'href'
	// 		},
	// 		title: {
	// 			query: 'a',
	// 			content: 'title'
	// 		},
	// 		type: 'CompositeArticleId'
	// 	}
	// },
	pageType: 'REFERENCES',
	scan: function (reset) {
		// var rules = this.rules[this.domain]
		var referrer = document.referrer
		if (reset) {
			this.dominant = {}
			this.list = []
		}
		pageObjectIds.dominant = {
			authors: null,
			date: null,
			id: document.title,
			isbn: null,
			journal: null,
			pageTitle: document.title,
			publisher: null,
			referrer: document.referrer,
			type: 'PageTitle',
			uri: location.href
		}
		// scrape
		var items = document.body.querySelectorAll('.search-box__result-item')
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			// console.log(item)
			var uri = item.querySelector('.nova-v-publication-item__title a')
			uri = uri ? uri.href : null
			if (!uri) continue;
			var title = item.querySelector('.nova-v-publication-item__title')
			title = title ? title.textContent : null
			if (!title) continue;
			title = title.replace(/\/.*/, '').trim()
			var type = 'CompositeArticleId'
			var id = title
			var authors = null
			var publisher = null
			var journal = null
			var volume = null
			var issue = null
			var pages = null
			var date = null
			var isbn = null
			var issn = null
			var keywords = null
			var referenceType = null
			var articleAbstract = null
			var abstractEl = item.querySelector('.nova-v-publication-item__description')
			if (abstractEl && abstractEl.textContent.trim().length > 3) {
				articleAbstract = abstractEl.textContent.trim()
			}
			var authorElList = item.querySelectorAll('.gtm-profile-item')
			if (authorElList.length > 0) {
				authors = Array.prototype.map.call(authorElList, function (i) { return i.textContent.trim() })
			}
			var metadataElList = item.querySelectorAll('.publication-item-meta-items__meta-data-item')
			if (metadataElList.length > 0) {
				date = metadataElList[0].textContent.trim()
				if (metadataElList[1]) {
					journal = metadataElList[1].textContent.trim()
				}
			}
			var referenceTypeEl = item.querySelector('.nova-v-publication-item__type')
			if (referenceTypeEl && referenceTypeEl.textContent) {
				var referenceTypeRaw = referenceTypeEl.textContent
				if (referenceTypeRaw.match(/book/i)) referenceType = 'BOOK'
				if (referenceTypeRaw.match(/chapter/i)) referenceType = 'BOOK'
			}
			// console.log(referenceType, uri, title, authors, journal, volume, issue, pages, date)
			this.list.push({
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				// Metadata
				authors: authors,
				journal: journal,
				date: date,
				publisher: publisher,
				volume: volume,
				issue: issue,
				pages: pages,
				isbn: isbn,
				issn: issn,
				keywords: keywords,
				referenceType: referenceType,
				articleAbstract: articleAbstract,
				// Patented
				assignees: null,
				applicationNumber: null,
				priorityNumber: null,
				patentNumber: null,
				fillingDate: null,
				issuingAuthority: null,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
	}
}
// Generic *rxiv.org search
F1000Global.pageObjectIdsHandlers.htmlContentScanner_genericRxivSearch = {
	recommendationsSupport: {
		getConfig: function () {
			return {
				targetSelector: '.highwire-cite',
				labelStyles: 'margin: 10px 15px 0 0; float: left;'
			}
		}
	},
	alreadyRunned: false,
	domain: null,
	dominant: null,
	libraryItemId: null,
	list: [],
	rules: {
		genericRxivSearch: {
			item: {
				query: '.highwire-article-citation'
			},
			type: 'DigitalObjectId'
		}
	},
	scan: function (reset) {
		var rules = this.rules[this.domain]
		// Reset
		if (reset) {
			this.dominant = null
			this.list = []
		}
		// Generic Infos
		var title = document.title || (document.location.host + document.location.pathname)
		var pageURI = window.location.href
		var referrer = document.referrer
		// Dominant
		this.dominant = {
			id: title,
			type: "PageTitle",
			uri: pageURI,
			pageTitle: title,
			referrer: referrer,
			journal: null,
			authors: null
		}
		// Scrape
		var items = document.querySelectorAll(rules.item.query)
		// console.log(items)
		for (var i = 0; i < items.length; i++) {
			var item = items[i]
			var titleEl = item.querySelector('.highwire-cite-title a')
			if (!titleEl) continue
			var uri = titleEl.href
			var title = titleEl.textContent.replace(/\n/g, '').trim()
			var doiEl = item.querySelector('.highwire-cite-metadata-doi')
			if (!doiEl) continue
			var _doi = doiEl.textContent.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?![\"&\'<>;])\S)+)\b/gi)
			if (!_doi || !_doi[0]) continue
			var doi = _doi[0]
			var id = doi
			var type = rules.type
			var authors = null
			var _authors = item.querySelectorAll('.highwire-citation-author')
			if (_authors.length > 0) {
				authors = Array.prototype.map.call(_authors, function (i) {
					return i.textContent.trim()
				})
			}
			// console.log(title, uri, id, authors)
			this.list.push({
				$el: item,
				// Exporting Type Specific
				authors: authors,
				journal: null,
				date: null,
				publisher: null,
				// Exporting
				id: id,
				type: type,
				uri: uri,
				pageTitle: title,
				referrer: referrer,
				resolved: {
					id: id,
					pageTitle: title,
					type: type,
					uri: uri
				}
			})
		}
		this.pageType = 'REFERENCES'
	}
}
// Noop
F1000Global.pageObjectIdsHandlers.noop = {
	alreadyRunned: false,
	dominant: {
		type: -1
	},
	list: [],
	rules: {},
	scan: function () { }
}
// Select domain scanner
// NOTE: blacklisted domain are handled later by generic.scan
var pageObjectIds = (function () {
	// console.time('pageObjectIds boot')
	// iframe, nothing to do here (this applies only to old safari content_scripts by now)
	if (F1000Global.isInIframe) {
		return F1000Global.pageObjectIdsHandlers.noop
	}
	// Domain based scanner
	var domain = null
	var host = document.location.host
	var href = document.location.href
	// Search only
	if (host.indexOf('scholar.google') === 0) domain = "googleScholar"
	if (host.indexOf('nih.gov') !== -1) {
		if (document.querySelector('.result_count')) {
			domain = "pubmedSearch"
		} else if (document.querySelector('#search-page')) {
			// labs
			domain = "pubmedSearch2019"
		}
	}
	if (host.indexOf('europepmc.') !== -1 &&
		document.querySelector('.results_list')) domain = "pubmedEuropeSearch"
	if (host.indexOf('.sciencedirect.') !== -1) {
		if (document.querySelector('ol.results')) domain = "scienceDirectSearch"
		if (document.querySelector('ol.search-result-wrapper')) domain = "scienceDirectSearch2017"
	}
	if (host.indexOf('academic.research.microsoft') === 0 &&
		document.body.querySelector('.paper-item')) domain = "academicResearchMicrosoft"
	if (host.indexOf('rxiv.') !== -1) {
		if (host.indexOf('arxiv.') === 0 &&
			document.title.match(/search/gi)) {
			// the physics search
			domain = "arxivSearch"
		} else if (href.match(/\/search|\/content\/early\/recent|\/collection\/.+|\/archive/gi)) {
			// the multiple biomed searches
			domain = "genericRxivSearch"
		}
	}
	if (host.indexOf('highwire.stanford') !== -1 &&
		href.indexOf('searchresults') !== -1) domain = 'highwireSearch'
	if (host.indexOf('dl.acm') !== -1 &&
		document.title.search(/results/i) === 0) domain = 'ACMDigitalLibrarySearch'
	if (host.indexOf('.scopus.') !== -1) {
		if (document.querySelector('#documentListUl')) domain = 'scopusSearch'
		else if (document.querySelector('#resultsBody')) domain = 'scopusSearch2017'
	}
	if (host.indexOf('.nature.') !== -1 &&
		href.indexOf('/search') !== -1 &&
		document.querySelector('ol.clean-list')) domain = 'natureSearch'
	if (host.indexOf('citeseerx') !== -1 &&
		href.indexOf('/search') !== -1 &&
		document.querySelector('#result_list')) domain = 'citeseerSearch'
	if ((host.indexOf('ovidsp.') === 0 || host.indexOf('ovidsp-') === 0) &&
		document.title.search(/search\sform/i) !== -1) domain = 'ovidSearch'
	// Search and detail
	if (host.indexOf('academic.microsoft.') === 0) domain = "academicMicrosoft2018"
	if (host.indexOf('.webofknowledge.') !== -1) {
		if (document.body.querySelector('.title')) domain = "webofknowledgeArticle"
		else if (document.body.querySelector('.search-results-item')) domain = "webofknowledgeSearch"
	}
	if (host.indexOf('search.proquest.') === 0) {
		if (document.body.querySelector('.resultItems')) domain = "proQuestSearch"
		else if (document.body.querySelector('.docViewFullCitation')) domain = "proQuestArticle"
	}
	if (host.indexOf('.worldcat.') !== -1) {
		if (document.body.querySelector('.table-results')) domain = "worldcatSearch"
		else if (document.body.querySelector('#microdatabox')) domain = "worldcatArticle"
	}
	if (host.indexOf('nih.gov') !== -1) {
		if (document.body.querySelector('.briefCitRow')) domain = "nihLibrarySearch"
		else if (document.body.querySelector('.bibInfoEntry')) domain = "nihLibraryArticle"
	}
	if (host.indexOf('.jstor.') !== -1) {
		if (document.body.querySelector('.list-searchResults')) domain = "jstorSearch"
		else if (href.indexOf('/stable/') !== -1 && href.indexOf('/pdf/') === -1) domain = "jstorArticle"
	}
	if (host.indexOf('.amazon.') !== -1) {
		var amazonBookHint = document.querySelector('.a-list-item')
		amazonBookHint = amazonBookHint && amazonBookHint.textContent && amazonBookHint.textContent.match(/book/i)
		if (amazonBookHint ||
			document.title.match(/: Books$/) ||
			document.title.match(/: Kindle Store$/)) domain = "amazonBook"
	}
	if (href.indexOf('/vwebv/search') !== -1) {
		if (document.body.querySelector('#divbib')) domain = "voyagerArticle"
		//else if (document.body.querySelector('#resultList')) domain = "voyagerSearch"
	}
	if (host.indexOf('.espacenet.') !== -1) {
		if (href.indexOf('/biblio') !== -1) domain = "espacenetArticle"
		else if (href.indexOf('/searchResults') !== -1) domain = "espacenetSearch"
	}
	if (host.indexOf('.ssrn.') !== -1) {
		if (href.indexOf('/papers.cfm') !== -1 ||
			href.indexOf('/Papers.cfm') !== -1) {
			domain = "ssrnArticle"
		} else if (href.indexOf('/results.cfm') !== -1 ||
			href.indexOf('/Results.cfm') !== -1) {
			domain = "ssrnSearch"
		}
	}
	// if (host.indexOf('patft.uspto.') === 0) {
	// 	if (href.indexOf('netacgi/nph-Parser') !== -1) domain = 'uspto_govArticle'
	// }
	// Search and detail monotonic
	if (host.indexOf('hdas.nice.') !== -1) {
		domain = 'hdasNice'
	}
	if (href.indexOf('/primo_library/libweb/') !== -1) {
		if (document.body.querySelector('.EXLDetailsContent') ||
			document.body.querySelector('#exlidResultsTable')) {
			if (host.indexOf('merhav.') !== -1) {
				domain = "primoLibweb_Merhav"
			} else {
				domain = "primoLibweb"
			}
		}
	}
	if (host.indexOf('beta.nli.org.il') !== -1) {
		domain = "primoBetaDetail"
	}
	if (href.indexOf('/primo-explore/') !== -1) {
		if (location.pathname.indexOf('/primo-explore/') === 0) domain = "primoExplore"
	}
	if (host.indexOf('.exlibrisgroup.') !== -1) {
		if (href.indexOf('/discovery/') !== -1) domain = "primoExplore"
	}
	if (host.indexOf('search.library.ucdavis.edu') !== -1) {
		if (href.indexOf('/discovery/') !== -1) domain = "primoExplore"
	}
	if (host.indexOf('librarysearch.cardiff.ac.uk') !== -1) {
		if (href.indexOf('/discovery/') !== -1) domain = "primoExplore"
	}
	if (host.indexOf('cochranelibrary.') !== -1) {
		if (location.pathname.indexOf('/advanced-search') === 0) domain = "cochranelibrarySearch"
	}
	if (host.indexOf('agricola.') === 0) {
		if (location.pathname.indexOf('/search') !== -1) domain = "agricolaSearch"
		else if (href.indexOf('bibId=') !== -1) domain = "agricolaDetail"
	}
	if (host.indexOf('.ebscohost.') !== -1) {
		if (href.indexOf('/detail/') !== -1) domain = 'ebscohost_article'
		else if (href.indexOf('/results') !== -1) domain = 'ebscohost_search'
	}
	if (host.indexOf('.elsevierhealth.') !== -1) {
		if (href.indexOf('search/') !== -1) domain = 'elsevierhealth_search'
		else domain = 'elsevierhealth_detail'
	}
	if (host.indexOf('.elsevier.') !== -1) {
		if (href.indexOf('/books/') !== -1) domain = 'elsevier_books'
	}
	if (host.indexOf('researchgate.net') !== -1) {
		if (href.indexOf('/search.Search.html') !== -1) domain = 'researchGateSearch'
	}
	// console.timeEnd('pageObjectIds boot')
	// console.log('pageObjectIds domain', domain)
	if (domain) {
		var scanner = F1000Global.pageObjectIdsHandlers['htmlContentScanner_' + domain]
		scanner.domain = domain
		return scanner
	} else {
		// Domain based twicks to genericIdsScanner
		if (host.indexOf('authorea.com') !== -1) {
			F1000Global.pageObjectIdsHandlers.genericIdsScanner.blacklist.push('10.1016/j.physletb.2012.08.020')
		}
		return F1000Global.pageObjectIdsHandlers.genericIdsScanner;
	}
})();
