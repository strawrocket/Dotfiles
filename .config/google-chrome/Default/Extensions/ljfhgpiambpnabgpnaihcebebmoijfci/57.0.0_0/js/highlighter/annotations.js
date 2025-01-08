"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

f1kat.hl.annotations = {}
f1kat.hl.annotations.all = [];

// MOB-353: Orrible mobile hack for pdf on orientationChange (part 1/2)
f1kat.hl.annotations.mobileSafeSerializeSelectionRange = function (annotation) {
	var serialized;
	try {
		serialized = f1kat.hl.annotations.serializeSelectionRange(annotation, true)
	} catch (e) {
		if (F1000Global.whitelistedPathsCacheDomain) {
			var contextRange = JSON.parse(annotation.quoteContext)
			if (contextRange && contextRange.cachedPaths) {
				var cachedPaths = contextRange.cachedPaths[F1000Global.whitelistedPathsCacheDomain]
				if (cachedPaths && cachedPaths.range) {
					serialized = cachedPaths.range
				}
			}
		}
	}
	return serialized
}

f1kat.hl.annotations.serializeSelectionRange = function (annotation, tainted) {
	if (!tainted && false) {
		return f1kat.hl.annotations.mobileSafeSerializeSelectionRange(annotation)
	}

	var hl = f1kat.hl
	var s = annotation.selection

	return {
		start: hl.cssPath2xPath(hl.getCssPath(s.anchorNodeParent)),
		startOffset: s.anchorOffset,
		end: hl.cssPath2xPath(hl.getCssPath(s.focusNodeParent)),
		endOffset: s.focusOffset
	}
}

f1kat.hl.annotations.serialize = function (annotation) {
	var hl = f1kat.hl

	// Filter data for the server
	var serialized = {
		author: annotation.author,
		color: annotation.color || 'e',
		comments: annotation.comments,
		created: annotation.created,
		id: annotation.id,
		idInfo: hl.pageInfos,
		images: annotation.quoteImages,
		inSameDomain: annotation.inSameDomain,
		publicAccess: annotation.publicAccess,
		quote: annotation.quote,
		quoteContext: annotation.quoteContext,
		text: annotation.text,
		uri: hl.pageInfos.uri
	}

	// LibraryItemId
	if (pageObjectIds.libraryItemId) serialized.libraryItemId = pageObjectIds.libraryItemId

	// Ranges
	if (annotation.selection && annotation.inSameDomain !== false) {
		serialized.ranges = [hl.annotations.serializeSelectionRange(annotation)]
	} else {
		// when range_original is present restores from backup field for original ranges, used by PathsCache
		serialized.ranges = annotation.range_original ? annotation.range_original : annotation.ranges
	}

	return serialized
}

f1kat.hl.annotations.fetch = function () {
	var hl = f1kat.hl
	// console.log('annotations fetch')
	if (F1000Global.preventAnnotationsGET && !state.workbenchMode) return;

	// optimization for new users without annotations on normal webpages
	if (!F1000Global.ignoreHasAnyAnnotationsRule) {
		// leave the triple equals as the anyAnnotations flag me be not present at all
		if (content_script.session.user.hasAnyAnnotations === false) {
			var isWebPage = typeof pageObjectIds.dominant === 'object' &&
				pageObjectIds.dominant.pageType === 'PageTitle'
			var isNotWorkspace = typeof state.workbenchMode === 'undefined' ||
				state.workbenchMode !== 'manuscript'
			if (isWebPage && isNotWorkspace) {
				return
			}
		}
	}
	//console.log('/find payload', hl.pageInfos)
	F1000Global.request('POST', getBaseURL() + '/annotator/find', hl.pageInfos, 'json',
		function (d) {
			//console.log('/find response', d)
			// libraryItemdId & articleId
			pageObjectIds.libraryItemId = d.libraryItemId || null
			pageObjectIds.articleId = d.articleId || null
			// tags
			popup.tags.init()
			// annotations
			hl.annotations.all = d.annotations
			// this overrides HighlighterPreference
			if (hl.annotations.all.length > 0) content_script.highlighterState(true)
			// popup, XN: needed since logout managment, may cause the UI to double update after sessionHandler
			if (popup.active) popup.update()
			// Itegrated UI have counters outside popup
			if (F1000Global.integratedUI) F1000Global.integratedUI()
			// cached data
			if (F1000Global.whitelistedPagesInfoCacheOn) {
				pagesInfo.instantiate()
				// NOTE: this will already be attempted at annotation setup time but
				// we now use caches as well for pageInfo + index notes ordering
				if (F1000Global.whitelistedPathsCacheOn) {
					hl.annotations.all.forEach(hl.pathsCache.instantiate)
				}
				// we avoid the generic all annotations setup since we have pagesInfo
				F1000Global.whitelistedResetup && F1000Global.whitelistedResetup()
				// mobile sync
				if (false) WV.syncAnnotations()
				return
			}
			// finally, all annotations setup
			hl.setupAnnotations(hl.annotations.all)
			// mobile sync
			if (false) WV.syncAnnotations()
		},
		content_script.unauthorized
	)
}

// NOTE: refresh is only used by Manuscripts in F1000 Workspace,
// would need some rework to be general purpose: both on the setup callback and the UI locking.
f1kat.annotationsRefreshPending = false
f1kat.hl.annotations.refresh = function () {
	var hl = f1kat.hl
	// user is busy
	if (f1kat.hl.state !== 'closed') {
		// closing the highlighter later will imperatively call refresh again
		return f1kat.annotationsRefreshPending = true
	}
	// user is now free
	f1kat.annotationsRefreshPending = false
	// performs a normal /find and diffs the response by ids against the actual annotation.all
	F1000Global.request('POST', getBaseURL() + '/annotator/find', hl.pageInfos, 'json',
		function (d) {
			var res = d.annotations
			var resIds = res.map(function (i) { return i.id })
			var actual = hl.annotations.all.map(function (i) { return i.id })
			var posted = res.filter(function (i) { return actual.indexOf(i.id) === -1 })
			var deleted = hl.annotations.all.filter(function (i) { return resIds.indexOf(i.id) === -1 })
			if (posted.length) {
				hl.annotations.all = hl.annotations.all.concat(posted)
				hl.setupAnnotations(posted)
			}
			if (deleted.length) {
				deleted.forEach(function (i) {
					// This is the same as the callback of an annotation['delete']
					hl.annotations.all.splice(hl.annotations.all.indexOf(i), 1)
					// Unwrap the dom spans
					hl.annotations.remove(i)
				})
			}
			// Notes
			state.notesUpdatePending = true
			// mobile sync
			if (false) WV.syncAnnotations()
		},
		content_script.unauthorized
	)
}

f1kat.hl.annotations.post = function (annotation) {
	var hl = f1kat.hl

	if (!annotation) return;
	var payload = hl.annotations.serialize(annotation)

	var endpoint = getBaseURL() + '/annotator/annotations'
	if (!pageObjectIds.libraryItemId &&
		content_script.session.collectionId &&
		content_script.session.collectionId.id) endpoint += '?collectionId=' + content_script.session.collectionId.id

	if (!pageObjectIds.libraryItemId) popup.preventInteraction()

	content_script.highlighterPreferenceColor(annotation.color)

	F1000Global.request('POST', endpoint, payload, 'json',
		function (d) {
			if (!(d instanceof Object)) return;
			// libraryItemId && articleId
			if (!pageObjectIds.libraryItemId && d.libraryItemId) {
				pageObjectIds.libraryItemId = d.libraryItemId || null
				pageObjectIds.articleId = d.articleId || null
				// tags
				popup.tags.init()
				// reset preventInteraction
				state.preventInteractionLayerActive = false
				if (popup.active) popup.update()
				// auto upload pdf
				if (state.session.preferences.autoImportAlternatePDF) {
					popup.references.autoImportAlternatePDF()
				}
			}
			// anyAnnotations
			if (!content_script.session.user.hasAnyAnnotations) content_script.anyAnnotations(true)
			// reflect the changes locally
			annotation.spans.forEach(function (i) { i.dataset['f1kat_hl_id'] = d.id })
			// preserve instanced fields
			d.spans = annotation.spans
			if (annotation.pagesInfo) d.pagesInfo = annotation.pagesInfo
			// swap
			annotation = d
			if (hl.annotations.all.indexOf(annotation) === -1) hl.annotations.all.push(annotation)
			// always addDomain when first annotation on a normal webPage
			if (f1kat.hl.annotations.all.length === 1 && pageObjectIds.dominant.type === "PageTitle") content_script.addVisitedURL()
			// side effects for whitelisted pages, ex. the pdf viewer post of images
			if (F1000Global.whitelistedAnnotationSaved) F1000Global.whitelistedAnnotationSaved(d, 'post')
			// Notes
			state.notesUpdatePending = true
			// Itegrated UI have counters outside popup
			if (F1000Global.integratedUI) F1000Global.integratedUI()
			// Mobile
			if (false) {
				// MOB-353: Orrible mobile hack for pdf on orientationChange (part 2/2)
				var shouldResetup = !document.contains(annotation.spans[0])
				if (shouldResetup) hl.setupAnnotations([annotation])
				// sync
				WV.syncAnnotations()
			}
		},
		content_script.unauthorized
	)
}

f1kat.hl.annotations.put = function (annotation) {
	var hl = f1kat.hl

	if (!annotation || !annotation.id) return;
	var payload = hl.annotations.serialize(annotation)

	content_script.highlighterPreferenceColor(annotation.color)

	F1000Global.request('PUT', getBaseURL() + '/annotator/annotations/' + annotation.id, payload, 'json',
		function (d) {
			// side effects for whitelisted pages, ex. the pdf viewer post of images
			if (F1000Global.whitelistedAnnotationSaved) F1000Global.whitelistedAnnotationSaved(d, 'put')
			// Notes
			state.notesUpdatePending = true
			// mobile sync
			if (false) WV.syncAnnotations()
		},
		content_script.unauthorized
	)
}

f1kat.hl.annotations['delete'] = function (annotation) {
	var hl = f1kat.hl

	if (!annotation || !annotation.id) return;
	F1000Global.request('DELETE', getBaseURL() + '/annotator/annotations/' + annotation.id, {}, 'json',
		function (d) {
			hl.annotations.all.splice(hl.annotations.all.indexOf(annotation), 1)
			if (F1000Global.whitelistedAnnotationSaved) F1000Global.whitelistedAnnotationSaved(d, 'delete')
			// Notes
			state.notesUpdatePending = true
			// mobile sync
			if (false) WV.syncAnnotations()
		},
		content_script.unauthorized
	)
}

f1kat.hl.annotations.getById = function (id) {
	var hl = f1kat.hl

	return hl.annotations.all.filter(function (i) { return i.id === id })[0]
}

f1kat.hl.annotations.make = function (persist, useEditorData) {
	var hl = f1kat.hl

	if (persist) {
		if (!hl.annotations.current) return
		// Prepare
		var editorData = useEditorData || hl.uiEditorGet()
		hl.annotations.current.text = editorData.comment
		// Persist
		hl.annotations.post(hl.annotations.current)
		// Reset
		hl.annotations.current = null
		// Reset Filters
		state.filterNotes.id = 'all'
		f1kat.hl.filterAnnotations(['all'])
		return
	}
	// Grab Selection
	hl.annotations.current = hl.grabSelection()
	// Paint temporary
	if (hl.annotations.current) hl.paintSelection(hl.annotations.current)
}

f1kat.hl.annotations.cancel = function () {
	var hl = f1kat.hl
	// Reset Current Annotation
	if (!hl.annotations.current) return;
	var spans = hl.annotations.current.spans || []
	for (var i = spans.length - 1; i >= 0; i--) hl.unwrap(spans[i])
	hl.annotations.current = null
}

f1kat.hl.annotations.remove = function (annotation) {
	var hl = f1kat.hl
	if (!annotation || !annotation.id) return;
	var spans = document.querySelectorAll('[data-f1kat_hl_id="' + annotation.id + '"]')
	for (var i = spans.length - 1; i >= 0; i--) hl.unwrap(spans[i])
}
