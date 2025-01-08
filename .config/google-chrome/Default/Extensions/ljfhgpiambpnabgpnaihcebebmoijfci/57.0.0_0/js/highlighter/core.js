"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

//
// Lazy setup of highlights event handlers
//
f1kat.hl.hlEventName = 'mouseover'
f1kat.hl.hlMouseOverTimeout = null
f1kat.hl.hlMouseOver = function (e) {
	if (typeof e.f1katIgnore !== 'undefined') return;
	if (!content_script.highlighterEnabled) return;

	e.f1katIgnore = true
	var target = e.target || e.srcElement
	target.onclick = f1kat.hl.uiStateComments
	target.onmouseout = f1kat.hl.hlMouseOut
	f1kat.hl.hlMouseOverTimeout = setTimeout(f1kat.hl.uiStateComments.bind(e), 1000)
}
f1kat.hl.hlMouseOut = function () {
	if (f1kat.hl.hlMouseOverTimeout) clearTimeout(f1kat.hl.hlMouseOverTimeout)
}

//
// Paints a selection
//
// XN A slightly more efficient painting can be written starting from the commonAncestor of the start/end elements,
// flattening only once, moving the caret from flat.indexOf(the first childNode of the elements), splitting in place
// and having a special case when start and end are the same element.
f1kat.hl.paintSelection = function (annotation) {
	var hl = f1kat.hl
	// console.log('PAINT/begin', annotation)
	// checks we are not within the attached UI (needed since show notes)
	var uiRoot = F1000Global.getUIRoot()
	if (uiRoot.contains(annotation.selection.anchorNodeParent) ||
		uiRoot.contains(annotation.selection.focusNodeParent)) {
		return false
	}
	// doubles checks we are in target if any, mainly workbench itemDetail mode
	if (f1kat.highlighterTarget) {
		var anchorValid = f1kat.highlighterTarget.contains(annotation.selection.anchorNodeParent)
		var focusValid = f1kat.highlighterTarget.contains(annotation.selection.focusNodeParent)
		if (!anchorValid || !focusValid) {
			//console.log('PAINT TARGET FAILURE')
			return false
		}
	}
	// split always the end first
	var endNode = hl.caret2Node(annotation.selection.focusNodeParent, annotation.selection.focusOffset)
	var startNode = hl.caret2Node(annotation.selection.anchorNodeParent, annotation.selection.anchorOffset)
	if (!startNode || !endNode) {
		//console.log('%cPAINT FAILURE ' + annotation.id, 'background: yellow; color: black', startNode, endNode)
		return false
	}
	// Annotation class colorClass offClass
	var spanClassName = 'f1kat-hl ' + hl.getColorClass(annotation)
	if (state.highlighter.on === false) {
		spanClassName += ' f1kat-hl-off'
	}
	if (annotation.author && state.filterNotes.id !== 'all') {
		if (annotation.author.id !== state.filterNotes.id) {
			spanClassName += ' f1kat-hl-filter-out'
		}
	}
	// Paint
	var flat = hl.flatten(hl.commonAncestor(startNode, endNode))
	//console.log('paintSelection flat', flat)
	//console.log(' indexOf start', flat.indexOf(startNode), startNode)
	//console.log(' indexOf end', flat.indexOf(endNode), endNode)
	var node, span;
	var spans = [];
	for (var i = flat.indexOf(startNode), l = flat.indexOf(endNode); i < l; i++) {
		node = flat[i];
		//console.log('paintSelection loop/node', node)
		// if ever on IE9: try replace spaces instead of trim if failing
		if (node.textContent.trim().length !== 0) {
			span = document.createElement('SPAN')
			span.className = spanClassName
			span.dataset['f1kat_hl_id'] = annotation.id
			span.textContent = node.textContent
			node.parentNode.replaceChild(span, node)
			span.addEventListener(hl.hlEventName, hl.hlMouseOver, true)
			spans.push(span)
			//console.log('paintSelection loop/span', span, spanClassName)
		}
	}
	annotation.spans = spans
	// console.log('PAINT/done', annotation)
}

//
// Deserialize a selection range xpath
//
f1kat.hl.deserializeSelection = function (annotation) {
	var hl = f1kat.hl

	var range = annotation.ranges[0];
	//console.log('deserializeSelection range', range)
	var startSelector = hl.xPath2cssPath(range.start)
	var startEl = document.querySelector(startSelector)
	//console.log('deserializeSelection start', startSelector, startEl)
	if (!startEl) return false;
	var endSelector = hl.xPath2cssPath(range.end)
	var endEl = document.querySelector(endSelector)
	//console.log('deserializeSelection end', endSelector, endEl)
	if (!endEl) return false;

	annotation.selection = {
		anchorNodeParent: startEl,
		anchorOffset: range.startOffset,
		focusNodeParent: endEl,
		focusOffset: range.endOffset,
	}

	return true;
}

//
// This just exist because explorer may fail badly while deserializing
//
f1kat.hl.instanceSelection = function (a) {
	var result = false

	try {
		result = f1kat.hl.deserializeSelection(a)
	} catch (error) {
		//console.log('%cUNRESOLVABLE CSS PATHS ' + a.id, 'color: white; background: black;')
		//console.log(error)
	}

	return result
}

//
// Async Rescan
//
f1kat.hl.asyncRescanWorker = {
	worker: null,
	timeout: null,
	start: function () {
		this.timeout = clearTimeout(this.timeout)
		this.terminate()
		this.worker = new Worker(quoteScanWorkerScript())
		return this.worker
	},
	terminate: function () {
		this.timeout = clearTimeout(this.timeout)
		if (this.worker) {
			this.worker.terminate()
			this.worker = null
		}
	}
}
f1kat.hl.asyncRescan = function (annotations, cb) {
	//var rescanStartTime = Date.now()
	var hl = f1kat.hl
	var worker = hl.asyncRescanWorker.start()
	// callback
	worker.onmessage = function (e) {
		//console.log('asyncRescan time to answer', Date.now() - rescanStartTime)
		// Dispose the worker
		hl.asyncRescanWorker.terminate()
		// Backup page status
		var scrollRestore = hl.scrollBackup()
		var activeElement = document.activeElement
		if (activeElement && activeElement.blur) activeElement.blur()
		// Instantiate rescanned annotations
		var pathsCacheOn = F1000Global.whitelistedPathsCacheOn
		var matched = e.data.matched
		var paintingAnnotations = []
		var updatableAnnotations = []
		var cachablePathsAnnotations = []
		findShim.ready = false // EDGE: findShim invalidate textContent indexing
		// console.log(matched.length + ' to FIND from rescanned annotations')
		// console.time('time find')
		for (var i = 0; i < matched.length; i++) {
			var rescanData = matched[i]
			var a = hl.annotations.getById(rescanData.id)
			if (hl.selectionScan(a, rescanData)) {
				paintingAnnotations.push(a)
				// updates ranges in same domain (never on whitelisted domains)
				if (a.inSameDomain && !F1000Global.whitelisted) updatableAnnotations.push(a)
				// updates cache, whitelisted domain do not update by same domain so no duplicates here
				if (pathsCacheOn) cachablePathsAnnotations.push(a)
			}
		}
		// console.timeEnd('time find')
		// console.log(paintingAnnotations.length + ' FOUND as paintable annotations')
		// Reset the selection we used troughout in selectionScan
		if (false && F1000Global.platform === 'ios') {
			// ios would mess up scroll on first text selection if we collapse to body 0
			document.getSelection().collapse()
		} else {
			// some browsers won't accept a collapse without arguments, body 0 is just safe
			document.getSelection().collapse(document.body, 0)
		}
		// Restore page status
		hl.scrollBackup(scrollRestore)
		if (activeElement && activeElement.focus) activeElement.focus()
		// Paint
		paintingAnnotations.forEach(hl.paintSelection)
		// Callback
		if (cb) {
			cb()
			cb = null
		}
		// Update annotations
		// XN to avoid losing annotation due to false rescans: should first check the highlighterTarget xpath is contained in the new xpaths
		updatableAnnotations.forEach(hl.annotations.put)
		// Update annotations pathCache
		cachablePathsAnnotations.forEach(hl.pathsCache.put)
	}
	// start
	worker.postMessage({
		annotations: annotations.map(function (a) {
			return {
				id: a.id,
				quote: a.quote,
				quoteContext: a.quoteContext
			}
		}),
		config: quoteScanWorkerConfig(),
		content: hl.getRescanContent()
	})
	// safeguard, there's no use in limiting the force kill times as in pdf rescan
	// come with different sets of annotations and on a webpage we only run once
	var safeguardTime = annotations.length * 500
	//console.log('asyncRescan safeguardTime ', safeguardTime)
	hl.asyncRescanWorker.timeout = setTimeout(function () {
		hl.asyncRescanWorker.terminate()
		if (cb) cb()
	}, safeguardTime)
}

//
// Setup an array of annotations, instance the selection then paints or batch async rescan
//
f1kat.hl.setupAnnotations = function (annotations, cb) {
	var hl = f1kat.hl
	//console.log('\nsetupAnnotations', annotations)
	if (!annotations || !annotations.length) return
	//console.log('setupAnnotations: whitelistedReady', F1000Global.whitelistedReady)
	if (F1000Global.whitelisted && !F1000Global.whitelistedReady) return
	// use xPaths from cache
	var pathsCacheOn = F1000Global.whitelistedPathsCacheOn
	// results
	var paintingAnnotations = [];
	var rescanningAnnotations = [];
	// Instance Selection or batch for async rescan
	for (var i = 0; i < annotations.length; i++) {
		var a = annotations[i];
		// make sure pathsCache is ready
		if (pathsCacheOn && !a.pathsCacheOn) hl.pathsCache.instantiate(a)
		// Try to deserialize then paint or rescan
		if (hl.instanceSelection(a)) {
			// console.log('paint queue:', a.id)
			paintingAnnotations.push(a)
		} else if (!a.pathsCacheOn) {
			// console.log('rescan queue:', a.id)
			rescanningAnnotations.push(a)
		}
	}
	// Paint
	paintingAnnotations.forEach(hl.paintSelection)
	// Rescan
	if (rescanningAnnotations.length > 0) {
		// console.log('rescan/call', rescanningAnnotations)
		hl.asyncRescan(rescanningAnnotations, cb)
	} else if (cb) {
		cb()
	}
}

//
// Init
//
f1kat.hl.init = function (pageInfos) {
	var hl = f1kat.hl
	console.log('f1kat.hl.init', pageInfos)
	hl.pageInfos = pageInfos
	if (!hl.uiReady) hl.uiAttach()
	// give page a breath, test case: http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2810111/
	setTimeout(hl.annotations.fetch, 0) //false ? 0 : 200)
}
