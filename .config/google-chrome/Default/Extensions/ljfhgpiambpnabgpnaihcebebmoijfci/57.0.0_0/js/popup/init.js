'use strict';
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

var state = {
	column: 1,
	demoMode: null,
	filterNotes: {
		id: 'all'
	},
	highlighter: {
		auto: false,
		color: 'e',
		currentEditingAnnotation: null,
		on: false,
		revertColorChange: null
	},
	login: {
		betaRestriction: false,
		rememberMePreference: true,
		tainted: false
	},
	notesUpdatePending: false,
	preventInteractionLayerActive: false,
	primeContribution: null,
	references: {
		resolving: false
	},
	save2Module: false,
	session: {
		user: false
	},
	showNotes: {
		message404: 'Sorry no access to this content, please find it in the article.'
	},
	tags: {
		filter: '',
		item: [],
		private: []
	},
	workbenchMode: undefined
}

function inheritStateFromDocument() {
	function inheritReferencesSelection() {
		var checkedReferences = document.querySelectorAll('.rprt input[type="checkbox"]')
		checkedReferences = Array.prototype.forEach.call(checkedReferences, function (i, index) {
			if (i.checked) {
				state.pageObjectIds.list[index]._checkedInDocument = true
			}
		})
	}

	try {
		if (state.pageObjectIds &&
			state.pageObjectIds.domain === 'pubmedSearch') {
			inheritReferencesSelection()
		}
	} catch (e) {
		// console.error('F1000Annotator/inheritStateFromDocument/error', e)
	}
}

var popup = function () {
	var module = {}

	module.active = false
	module.display = false
	module.popupRootEl = null

	//
	// Update
	//
	module.hasPendingUpdate = false
	module.update = function () {
		//console.log('POPUP update')
		if (module.hasPendingUpdate) return;
		if (!content_script.session) return;
		if (!module.active) {
			inheritStateFromDocument()
			module.active = true
			module.session = content_script.session
			var frag = jsonML2Dom(templates.popup(), handlers)
			if (!module.display) frag.style.display = "none"
			if (state.preventInteractionLayerActive) {
				state.preventInteractionLayerActive = false
				frag.querySelector('#f1000-at-popup #f1kat-preventInteraction').style.display = 'block'
			}
			F1000Global.getUIRoot().appendChild(frag)
			module.popupRootEl = frag
			return
		}
		var listScrollRestore = module.listScrollBackup()
		//console.time('jsonML popup')
		var markup = templates.popup()
		//console.timeEnd('jsonML popup')
		//console.time('jsonML2Dom popup')
		var frag = jsonML2Dom(markup, handlers)
		//console.timeEnd('jsonML2Dom popup')
		if (!module.display) frag.style.display = "none"
		//console.time('DOM popup replace')
		F1000Global.getUIRoot().replaceChild(frag, module.popupRootEl)
		//console.timeEnd('DOM popup replace')
		module.popupRootEl = frag
		module.dynamicStyles()
		module.listScrollBackup(listScrollRestore)
	}

	//
	// Toggle
	//
	module.toggleHook = null
	module.toggle = function (e) {
		if (e) e.preventDefault()
		if (module.display) {
			// Hide
			module.display = false
			F1000Global.collectionSelect.close()
			module.popupRootEl.style.display = "none"
			handlers.popup.closeMenu()
			if (F1000Global.onPopupClose) F1000Global.onPopupClose(false)
		} else {
			// Show
			module.display = true
			if (!module.active) module.update()
			content_script.closeHighlighterEditor()
			F1000Global.collectionSelect.close()
			// ensure we are attached
			F1000Global.getUIRoot()
			module.popupRootEl.style.display = "block"
			if (state.notesUpdatePending) handlers.notes.update()
			module.dynamicStyles()
			if (F1000Global.onPopupOpen) F1000Global.onPopupOpen(true)
		}
		// Hook
		if (module.toggleHook) module.toggleHook()
	}

	//
	// Height of popup
	//
	module.dynamicStyles = function () {
		// expected distance from bottom of viewport
		var marginBottom = 32
		// fixed heights
		var isREFERENCES = state.pageObjectIds && state.pageObjectIds.pageType === 'REFERENCES' ? true : false
		var save2ModuleH = isREFERENCES ? 180 : 140
		var highlighterModuleH = isREFERENCES && F1000Global.blacklistedHighlighter ? 0 : 48
		// available (given we cannot touch anything else) for the lists to grow Y
		var availableH = window.innerHeight - highlighterModuleH - marginBottom
		if (state.column === 2) {
			// column2/notes/list
			var notesList = document.querySelector('#f1000-at-popup #f1kat-notes-list')
			if (notesList) {
				var NLClientTop = notesList.getBoundingClientRect().top
				var NLMaxH = availableH - NLClientTop
				notesList.style.maxHeight = NLMaxH + 'px'
			}
			// column2/tags/list
			var tagsList = document.querySelector('#f1000-at-popup #f1kat-tags-list')
			if (tagsList) {
				var TLClientTop = tagsList.getBoundingClientRect().top
				var TLMaxH = availableH - TLClientTop
				tagsList.style.maxHeight = TLMaxH + 'px'
			}
		} else {
			// column1/list
			var referencesList = document.querySelector('#f1000-at-popup .references #list')
			if (referencesList) {
				var RLClientTop = referencesList.getBoundingClientRect().top
				var RLMaxH = availableH - RLClientTop
				if (state.save2Module) {
					// console.log('dynamicStyles save2 present')
					RLMaxH -= save2ModuleH
				}
				referencesList.style.maxHeight = RLMaxH + 'px'
			}
		}
	}

	//
	// ListScrollBackup
	//
	module.listScrollBackup = function (restore) {
		var list = document.querySelector('#f1000-at-popup #list')
		if (!list) return;
		if (restore) list.scrollTop = restore
		else return list.scrollTop
	}

	//
	// Prevent Intercation Layer - Loading Spinner
	//
	module.preventInteraction = function () {
		if (!module.active) return state.preventInteractionLayerActive = true;
		var preventInteractionLayer = document.querySelector('#f1000-at-popup #f1kat-preventInteraction')
		if (preventInteractionLayer) preventInteractionLayer.style.display = 'block'
	}

	//
	// welcome Balloon
	//
	module.showWelcomeBalloon = function (domain) {
		// XN: FCORE-13989 fix user interaction since chrome 69
		if (domain === 'browserPDF') return;

		// mobile only
		if (false) return;
		// ie only
		if (detectBrowser().browser === 'ie') {
			// no on native pdf (standalone or framed)
			if (domain === 'browserPDF') return;
			// f1000 pdf viewer, only workaround to have the preference
			if (localStorage && localStorage.preferences) {
				var ieLocalPref = JSON.parse(localStorage.preferences)
				if (typeof ieLocalPref['welcomeBalloon_' + domain] !== undefined &&
					ieLocalPref['welcomeBalloon_' + domain] === false) {
					return
				}
			}
		}
		// embedded only
		if (false) {
			// no on native pdf (standalone or framed)
			if (domain === 'browserPDF') return;
		}
		// default
		var preference = state.session.preferences['welcomeBalloon_' + domain]
		if (preference === false) return;
		state.welcomeBalloonDomain = domain
		if (!document.querySelector('.f1kat-balloon')) {
			F1000Global.getUIRoot().appendChild(jsonML2Dom(templates.welcomeBalloon(domain), handlers))
		}
	}

	//
	// References
	//
	module.references = {
		resolve: function () {
			F1000Global.request("post", getBaseURL() + '/annotator/objectids/resolver', pageObjectIds.list, 'json',
				function (d) {
					for (var i = 0; i < pageObjectIds.list.length; i++) {
						var resolved = d[i]
						if (resolved.pageTitle) resolved.pageTitle = resolved.pageTitle.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, '').trim()
						pageObjectIds.list[i].resolved = resolved
					}
					pageObjectIds.list = pageObjectIds.list.filter(function (i) {
						return i.resolved.pageTitle
					})
					if (pageObjectIds.list.length === 0) {
						state.citedArticlesEmpty = true
					}
					if (F1000Global.whitelist_forceReferencesResolve) {
						F1000Global.whitelist_forceReferencesResolve = false
					}
					popup.references.resolving = false
					popup.update()
					content_script.contentState()
				},
				content_script.unauthorized
			)
		},
		formatWorkspaceItem: function (d, forcedReferrer) {
			return {
				id: d.id,
				pageTitle: d.resolved && d.resolved.pageTitle ? d.resolved.pageTitle : d.pageTitle,
				type: d.type,
				uri: d.uri,
				referrer: forcedReferrer ? forcedReferrer : d.referrer,
				// Suggests nature for uncertain matches
				matchType: d.matchType || null,
				// Metadata
				authors: d.authors || null,
				editors: d.editors || null,
				journal: d.journal || null,
				date: d.date || null,
				publisher: d.publisher || null,
				publicationPlace: d.publicationPlace || null,
				isbn: d.isbn || null,
				issn: d.issn || null,
				referenceType: d.referenceType || null,
				volume: d.volume || null,
				issue: d.issue || null,
				pages: d.pages || null,
				edition: d.edition || null,
				articleAbstract: d.articleAbstract || null,
				// Patented
				assignees: d.assignees || null,
				applicationNumber: d.applicationNumber || null,
				priorityNumber: d.priorityNumber || null,
				patentNumber: d.patentNumber || null,
				fillingDate: d.fillingDate || null,
				issuingAuthority: d.issuingAuthority || null,
				// extra
				keywords: d.keywords || null
			}
		},
		getWanted: function (exportDominant) {
			var wanted = []
			if (exportDominant && !pageObjectIds.libraryItemId) {
				// Dominant Page
				wanted.push(this.formatWorkspaceItem(pageObjectIds.dominant))
				// Side effects
				if (pageObjectIds.dominant.type === "PageTitle") {
					// add it to the visited urls, so on next visit /find can tell us it is already saved
					content_script.addVisitedURL()
					// turn on the highlighter as it will be on next time we visit the page
					if (!content_script.highlighter) content_script.init(true)
				}
			} else if (!exportDominant && pageObjectIds.list.length > 0) {
				// Checked List
				var allChecked = document.querySelectorAll('#f1000-at-popup .references #list input[type="checkbox"]:checked')
				if (allChecked.length > 0) {
					// since We are exporting references we want the search page to be the referrer
					var forcedReferrer = window.location.href
					for (var i = 0; i < allChecked.length; i++) {
						var wantedIndex = allChecked[i].id.split('pageObjectIds-list-')[1]
						var object = pageObjectIds.list[wantedIndex]
						object.resolved.checked = true
						wanted.push(this.formatWorkspaceItem(object, forcedReferrer))
					}
				}
			}
			return wanted
		},
		updateWhenDoneForced: false,
		post: function (updateWhenDone, exportDominant) {
			var wanted = popup.references.getWanted(exportDominant)
			if (!wanted || wanted.length === 0) {
				// exits setting a flag so that the exportDominant will know to update.
				popup.progressBar.updateWhenDoneForced = true
				return;
			}
			// the spinner modal
			popup.hasPendingUpdate = true
			document.querySelector('#f1000-at-popup #f1kat-preventInteraction').style.display = 'block'
			// CollectionId
			var collectionId = content_script.session.collectionId.id
			var queryString = collectionId ? '?collectionId=' + collectionId : ''
			// Pluralize
			//var addItemLabel = wanted.length === 1 ? 'ADDING ITEM...' : 'ADDING ITEMS...'
			//document.querySelector('#f1000-at-popup .save2 #saveButton').textContent = addItemLabel
			// Post in batches
			var maxIndex = wanted.length
			//var batchLength = 50
			var batchLength = 10000
			var batchCounter = 0
			for (var index = 0; index < maxIndex; index += batchLength) {
				var payload = { identifiers: wanted.slice(index, Math.min(index + batchLength, maxIndex)) }
				F1000Global.request("POST", getBaseURL() + '/annotator/importIds' + queryString, payload, 'json',
					function (d) {
						if (d.identifiers) d = d.identifiers
						if (exportDominant) {
							var dominantId = pageObjectIds.dominant.id
							// this should reflect server side titles normalization rules
							var libraryItemId = d[dominantId] ||
								d[dominantId.toLowerCase()] ||
								d[dominantId.replace(/\s+/g, ' ').trim()] ||
								d[dominantId.replace(/\s+/g, ' ').trim().toLowerCase()];
							pageObjectIds.libraryItemId = libraryItemId
							// contributors will have the ArticleId to make a recommendation
							if (d.itemIdToArticleIdMap && pageObjectIds.libraryItemId) {
								pageObjectIds.articleId = pageObjectIds.articleId || d.itemIdToArticleIdMap[pageObjectIds.libraryItemId]
							}
							// tags
							popup.tags.init()
							// update popup
							if (popup.progressBar.updateWhenDoneForced) {
								popup.hasPendingUpdate = false
								popup.update()
							}
							// auto upload pdf
							if (state.session.preferences.autoImportAlternatePDF) {
								popup.references.autoImportAlternatePDF()
							}
						} else {
							pageObjectIds.dominant.saved = true
							for (var i = 0; i < pageObjectIds.list.length; i++) {
								var item = pageObjectIds.list[i]
								// this should reflect server side titles normalization rules
								var savedAs = d[item.id] ||
									d[item.id.toLowerCase()] ||
									d[item.id.replace(/\s+/g, ' ').trim()] ||
									d[item.id.replace(/\s+/g, ' ').trim().toLowerCase()];
								item.saved = item.saved || savedAs
								// contributors will have the ArticleId to make a recommendation
								if (d.itemIdToArticleIdMap && item.saved) {
									item.articleId = item.articleId || d.itemIdToArticleIdMap[item.saved]
								}
								// if not all items are saved then nor is the dominant
								if (!item.saved && item.resolved.pageTitle) {
									pageObjectIds.dominant.saved = false
								}
							}
						}
						batchCounter++;
						if (updateWhenDone) {
							// update popup
							if (batchCounter >= Math.ceil(maxIndex / batchLength)) {
								popup.hasPendingUpdate = false
								popup.update()
							}
						}
					}.bind(this),
					content_script.unauthorized
				)
			}
		},
		pdf: function () {
			// bootstrap DA if needed
			if (DA4pdf && !DA.ready) {
				module.preventInteraction()
				DA.connect()
				return;
			}
			// Prefetching timeout
			if (F1000Global.PDFPrefetchTimeout) clearTimeout(F1000Global.PDFPrefetchTimeout)
			// Interface Hacks
			//var addItemLabel = 'ADDING PDF...'
			//document.querySelector('#f1000-at-popup .save2 #saveButton').textContent = addItemLabel
			module.preventInteraction()
			// progress
			module.progressBar.show(true, 'pdf', false)
			module.progressBar.set(0, 1, 1)
			var collectionId = content_script.session.collectionId.id ? encodeURIComponent(content_script.session.collectionId.id) : ''
			var queryString = '?collectionId=' + collectionId
			var payload = pageObjectIds.dominant
			var pdfURI = payload.uri
			var suggestedPdfUri = payload.suggestedPdfUri
			F1000Global.request("POST", getBaseURL() + '/annotator/linkPdf' + queryString, payload, 'json',
				function (d) {
					if (d.resourceId) {
						module.progressBar.set(1, 100, 1)
						window.location = getwbURL() + '/work/item/' + d.libraryItemId + '/resources/' + d.resourceId + '/pdf'
					} else {
						module.progressBar.set(1, 45, 0)
						var libraryItemId = d.libraryItemId ? encodeURIComponent(d.libraryItemId) : ''
						queryString += '&libraryItemId=' + libraryItemId
						queryString += '&pdfURI=' + encodeURIComponent(pdfURI)
						queryString += '&pageTitle=' + pageObjectIds.dominant.pageTitle
						var referrer = pageObjectIds.dominant.referrer ? pageObjectIds.dominant.referrer : null
						if (referrer) queryString += '&referrer=' + referrer
						// with DA
						if (DA4pdf) {
							if (F1000Global.PDFPrefetchData === 'PENDING') {
								DA.ready = false
								popup.update()
								return;
							}
							var collectionId = content_script.session.collectionId.id ? encodeURIComponent(content_script.session.collectionId.id) : ''
							// FCORE-10328 3/3: uses suggestedPdfUri from referrer meta tags
							if (suggestedPdfUri) pdfURI = suggestedPdfUri
							DA.uploadFile(collectionId, libraryItemId, encodeURIComponent(pdfURI), encodeURIComponent(referrer),
								function (d) {
									if (d.itemId && d.resourceId && d.resourceId !== -1) {
										window.location = getwbURL() + '/work/item/' + d.itemId + '/resources/' + d.resourceId + '/pdf'
									} else {
										popup.references.pdfError(d)
									}
								},
								popup.references.pdfError
							)
							return
						}
						// without DA
						// handle prefetched saving
						if (F1000Global.PDFPrefetchData) {
							if (F1000Global.PDFPrefetchData === 'PENDING') {
								F1000Global.PDFPrefetchData = 'SAVING'
								popup.references.pdfQueryString = queryString
								return;
							} else {
								popup.references.pdfPOST(F1000Global.PDFPrefetchData, queryString)
								return;
							}
						}
						// handles normal saving
						var pdfHandler = new F1000Global.PDFHandler()
						pdfHandler.get(pdfURI,
							function (base64) { popup.references.pdfPOST(base64, queryString) },
							popup.references.pdfError,
							popup.progressBar.progress
						)
					}
				}.bind(this),
				popup.references.pdfError
			)
		},
		pdfPOST: function (pdfData, queryString) {
			module.progressBar.set(50, 85, 0, true)
			F1000Global.request("POST",
				getBaseURL() + '/annotator/uploadPdf' + queryString, { pdfContent: pdfData }, 'json',
				function (d) {
					if (d.resourceId) {
						module.progressBar.set(50, 100, 1)
						window.location = getwbURL() + '/work/item/' + d.libraryItemId + '/resources/' + d.resourceId + '/pdf'
					} else {
						popup.references.pdfError(d)
					}
				},
				popup.references.pdfError,
				popup.progressBar.progress
			)
		},
		pdfError: function (e) {
			var pILayerEl = document.querySelector('#f1000-at-popup #f1kat-preventInteraction')
			if (pILayerEl) pILayerEl.style.display = 'none'
			var refEl = document.querySelector('#f1000-at-popup .reference')
			if (refEl) refEl.style.display = 'none'
			var messageTargetEl = document.querySelector('#f1000-at-popup .save2')
			if (messageTargetEl) messageTargetEl.parentNode.replaceChild(jsonML2Dom(templates.pdfErrorMessage()), messageTargetEl)
		},
		autoImportAlternatePDF_middleware: {
			sciencedirect: function (pdfURI) {
				function onSuccess(d) {
					var doctypeIndex = d.indexOf('<!DOCTYPE html>')
					if (doctypeIndex !== -1 &&
						doctypeIndex < 128) {
						var uri = d.match(/URL=(.*)"/)
						if (uri &&
							uri[1] &&
							uri[1].length > 3) {
							pageObjectIds.dominant.alternatePDF = uri[1]
						}
					}
					module.references.autoImportAlternatePDF(null, true)
				}

				function onError(e, msg) {
					F1000Global.notifications.show(true, msg || 'Could not access PDF')
					setTimeout(function () {
						F1000Global.notifications.show(false)
					}, 7500)
				}

				F1000Global.request("GET", pdfURI, null, null, onSuccess, onError)
			}
		},
		autoImportAlternatePDF: function (e, tainted) {
			var pdfURI = pageObjectIds.dominant.alternatePDF
			if (!pdfURI) {
				return
			}

			if (!tainted && F1000Global.autoImportAlternatePDF_middleware) {
				var whitelister = module.references.autoImportAlternatePDF_middleware[F1000Global.autoImportAlternatePDF_middleware]
				if (whitelister) whitelister(pdfURI)
				return
			}

			function onSuccess(e) {
				F1000Global.notifications.show(true, 'PDF uploaded')
				setTimeout(function () {
					F1000Global.notifications.show(false)
				}, 1500)
			}

			function onError(e, msg) {
				// console.log('autoImportAlternatePDF error', e)
				F1000Global.notifications.show(true, msg || 'Could not access PDF')
				setTimeout(function () {
					F1000Global.notifications.show(false)
				}, 7500)
			}

			var fakeCompletionOffset = F1000Global.getRandomInt(25, 75)
			var lastProgress = 0
			var downloadLength = 0
			function onProgress(e) {
				// console.log('progress', e)
				if (!e.lengthComputable) {
					return
				}
				var progress = Math.floor(e.loaded / e.total * 100) - fakeCompletionOffset
				if (progress === 100) {
					fakeCompletionOffset = 0
				}
				if (progress > lastProgress) {
					lastProgress = progress
					F1000Global.notifications.show(true, 'PDF uploading ' + progress + '%')
				}
			}

			function checkPDF(data) {
				var minimumPdfSize = 25000
				return data.length > minimumPdfSize
			}

			var collectionId = content_script.session.collectionId.id ? encodeURIComponent(content_script.session.collectionId.id) : ''
			var queryString = '?collectionId=' + collectionId
			var payload = pageObjectIds.dominant
			F1000Global.request("POST", getBaseURL() + '/annotator/linkPdf' + queryString, payload, 'json',
				function (d) {
					if (d.resourceId) {
						return
					}
					var libraryItemId = encodeURIComponent(pageObjectIds.libraryItemId)
					queryString += '&libraryItemId=' + libraryItemId
					queryString += '&pdfURI=' + encodeURIComponent(pdfURI)
					queryString += '&pageTitle=' + pageObjectIds.dominant.pageTitle
					var referrer = pageObjectIds.dominant.referrer ? pageObjectIds.dominant.referrer : null
					if (referrer) queryString += '&referrer=' + referrer
					var pdfHandler = new F1000Global.PDFHandler()
					F1000Global.notifications.show(true, 'Getting PDF...')
					if (DA4pdf) {
						DA.uploadFile('', libraryItemId, encodeURIComponent(pdfURI), encodeURIComponent(referrer),
							onSuccess,
							onError
						)
					} else {
						pdfHandler.get(pdfURI,
							function (pdfData) {
								// we try to exclude html redirects
								var isPDF = checkPDF(pdfData)
								if (isPDF) {
									F1000Global.request("POST", getBaseURL() + '/annotator/uploadPdf' + queryString, { pdfContent: pdfData }, 'json',
										onSuccess,
										onError,
										onProgress
									)
								} else {
									onError()
								}
							},
							onError,
							onProgress
						)
					}
				}
			)
		}
	}

	//
	// Highlighter
	//
	module.highlighter = {
		applySpin: function () {
			if (!content_script.highlighter) content_script.init(true)
			var on = state.highlighter.on
			content_script.highlighterEnabled = on
			content_script.contentState()
			content_script.highlighterPreference(on)
			// XX should be in highlighter
			var hlSpans = document.querySelectorAll('.f1kat-hl')
			var should = on ? 'remove' : 'add'
			for (var i = 0; i < hlSpans.length; i++) {
				hlSpans[i].classList[should]('f1kat-hl-off')
			}
		},
		getSpin: function () {
			return state.highlighter.auto ?
				'AUTO' : state.highlighter.on ?
					'ON' : 'OFF'
		},
		setSpin: function (s) {
			switch (s) {
				case 'OFF':
					state.highlighter.on = false
					state.highlighter.auto = false
					break
				case 'ON':
					state.highlighter.on = true
					state.highlighter.auto = false
					break
				case 'AUTO':
					state.highlighter.on = true
					state.highlighter.auto = true
					break
			}
		}
	}

	//
	// Progress bar
	//
	module.progressBar = {
		$bar: undefined,
		chunkProgress: 0,
		from: 0,
		to: 0,
		toComplete: false,
		animate: function () {
			// quit raf when done
			if (popup.progressBar.v >= 100) {
				//console.log(new Date())
				return;
			}
			// to animate last chunk without progress
			var toComplete = popup.progressBar.toComplete
			if (toComplete) {
				if (toComplete === 'pending' && popup.progressBar.v >= popup.progressBar.to) {
					//console.log(new Date())
					popup.progressBar.from = popup.progressBar.v
					popup.progressBar.to = 100
					popup.progressBar.chunkProgress = 0
					popup.progressBar.toComplete = 'running'
				}
				if (toComplete === 'running') {
					// this .0001 approximately takes 2.5 minutes at 60fps
					popup.progressBar.chunkProgress = popup.progressBar.chunkProgress + 0.0001
				}
			}
			// standard chunk progress computation
			var v = popup.progressBar.from +
				(popup.progressBar.to - popup.progressBar.from) *
				popup.progressBar.chunkProgress
			popup.progressBar.v = v
			popup.progressBar.$bar.style.width = v + '%'
			requestAnimationFrame(popup.progressBar.animate)
		},
		progress: function (e) {
			popup.progressBar.chunkProgress = e.loaded / e.total;
		},
		set: function (from, to, chunkProgress, toComplete) {
			popup.progressBar.chunkProgress = chunkProgress
			popup.progressBar.from = from
			popup.progressBar.to = to
			popup.progressBar.toComplete = toComplete ? 'pending' : false
		},
		msg: {
			pdf: 'Please wait. This process should be quick but can take a bit longer if you are uploading a large file or the internet connection is slow.'
		},
		show: function (reset, msg, msgOnly) {
			if (msg) {
				var hm = document.querySelector('.highlighter.module')
				hm.style['line-height'] = '21px';
				hm.textContent = popup.progressBar.msg[msg]
			}
			if (msgOnly) return
			if (reset) popup.progressBar.set(0, 0, 0)
			var pb = document.createElement('div')
			pb.className = 'f1k-progressBar'
			popup.progressBar.$bar = pb
			var pbc = document.createElement('div')
			pbc.className = 'f1k-progressBarContainer'
			pbc.appendChild(pb)
			var spinner = document.querySelector('.annotator-spinner')
			spinner.parentNode.replaceChild(pbc, spinner)
			popup.progressBar.animate()
		}
	}

	module.tags = {
		assign: function (id, on) {
			if (on) {
				var tag = state.tags.private.filter(function (i) { return i.id === id })[0]
				state.tags.item.push(tag)
				state.tags.item = state.tags.item.sort(F1000Global.sortAlphabetically('name'))
				var qs = '?itemIds=' + state.pageObjectIds.libraryItemId + '&tagIds=' + id
				F1000Global.request('post', getBaseURL() + '/annotator/tag' + qs)
			} else {
				var tag = state.tags.item.filter(function (i) { return i.id === id })[0]
				var index = state.tags.item.indexOf(tag)
				state.tags.item.splice(index, 1)
				var qs = '?itemId=' + state.pageObjectIds.libraryItemId + '&tagId=' + id
				F1000Global.request('post', getBaseURL() + '/annotator/unTag' + qs)
			}
		},
		create: function (name) {
			var qs = '?name=' + encodeURIComponent(name)
			// "default" color
			qs += '&colour=orange'
			F1000Global.request('post', getBaseURL() + '/annotator/createTag' + qs, null, 'json',
				function (d) {
					if (d && d.id) {
						state.tags.item.push(d)
						state.tags.private.push(d)
						state.tags.item = state.tags.item.sort(F1000Global.sortAlphabetically('name'))
						state.tags.private = state.tags.private.sort(F1000Global.sortAlphabetically('name'))
						var qs = '?itemIds=' + state.pageObjectIds.libraryItemId + '&tagIds=' + d.id
						F1000Global.request('post', getBaseURL() + '/annotator/tag' + qs)
						handlers.tags.update()
					}
				}
			)
		},
		get: function () {
			F1000Global.request('get', getBaseURL() + '/annotator/tags?itemId=' + state.pageObjectIds.libraryItemId, null, 'json',
				function (d) {
					state.tags.item = d.itemTags
					state.tags.private = d.privateTags
					if (popup.active) popup.update()
				}
			)
		},
		put: function (id, reset) {
			if (id === 'CREATE') {
				popup.tags.create(state.tags.filter)
				if (reset) state.tags.filter = ''
			} else {
				if (reset) state.tags.filter = ''
				popup.tags.assign(id, true)
				handlers.tags.update()
			}
		},
		init: function () {
			if (pageObjectIds.libraryItemId) this.get()
		}
	}

	module.notificationFromBackground = function (message) {
		const json = templates.notificationFromBackground(message)
		const popup = jsonML2Dom(json, handlers)
		F1000Global.getUIRoot().appendChild(popup)
	}

	return module
}();
