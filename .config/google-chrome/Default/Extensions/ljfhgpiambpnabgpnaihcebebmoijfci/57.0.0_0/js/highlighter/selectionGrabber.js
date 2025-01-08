"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

// XN when a selection ends on an img or special tag we get undefined not to paint;
// we should exploit this to move the selection to the closest text node so it will be rescan friendly.
// actually the textNode should be in the direction of the other node, both of the may be empty?
// to test: remove this to test caret2Node: if (!node) return false;
// actually it is stopping at childNodes2FlatArray returning an empty array.

f1kat.hl.getRangeImages = function (range) {
	var imgs = range.querySelectorAll('img')
	var images = [];
	for (var i = 0; i < imgs.length; i++) {
		var el = imgs[i];
		if (el.width * el.height > 1024) {
			var attributes = el.attributes
			var src = el.src
			// If there is any more src it's probably a full size version of the image
			var secondarySrc = src
			for (var j = 0; j < attributes.length; j++) {
				var name = attributes[j].name
				if (name && (name.length > 3) && (name !== "srcset") && name.match(/src/gi)) secondarySrc = attributes[name].value
			}
			// Normalize src to absolute path.
			var addSlash = ''
			if (secondarySrc.indexOf('data:image') !== 0) {
				addSlash = (secondarySrc.indexOf('/') === 0) ? '' : '/'
				if (secondarySrc.match(/^\/\/|:\/\//) === null) secondarySrc = F1000Global.getOrigin(window) + addSlash + secondarySrc
			}
			images.push({ src: src, full: secondarySrc })
		}
	}
	return images;
}

f1kat.hl.grabSelection = function () {
	function textContextInFlatElement(flatElement, node, offset, textBefore, store, wantedLength) {
		store.containerText = node.textContent
		store.offset = offset
		var missingLength = wantedLength - store.containerText.length
		if (missingLength > 0) {
			// EXPAND BACKWARD
			if (textBefore.length > missingLength)
				textBefore = textBefore.substr((textBefore.length - missingLength), textBefore.length);
			store.containerText = textBefore + store.containerText
			store.offset = textBefore.length + store.offset
			// EXPAND FORWARD
			missingLength = wantedLength - store.containerText.length
			if (missingLength > 0) {
				var textAfter = ""
				for (var i = flatElement.indexOf(node) + 1; i < flatElement.length; i++) textAfter += flatElement[i].textContent;
				if (textAfter.length > missingLength) textAfter = textAfter.substr(0, missingLength);
				store.containerText = store.containerText + textAfter
			}
		} else if (missingLength < 0) {
			// DISCARD
			if (store.offset <= wantedLength) {
				store.containerText = store.containerText.substr(0, wantedLength)
			} else {
				store.containerText = store.containerText.substr(store.offset - wantedLength, wantedLength)
				store.offset = wantedLength
			}
		}
	}

	var hl = f1kat.hl

	var s = getSelection()
	if (s.isCollapsed) {
		if (false) {
			if (f1kat.hl.grabSelectionCache) {
				s = f1kat.hl.grabSelectionCache
			} else {
				return;
			}
		} else {
			return;
		}
	}

	var annotation = {}
	var context = {
		v: "1",
		start: { containerText: null, offset: null },
		end: { containerText: null, offset: null }
	}

	// Quote
	annotation.quote = s.toString()

	// Images
	annotation.quoteImages = hl.getRangeImages(s.getRangeAt(0).cloneContents())

	// Cache Selection
	var startNode = s.anchorNode
	var startNodeOffset = s.anchorOffset
	var endNode = s.focusNode
	var endNodeOffset = s.focusOffset
	s.removeAllRanges()

	// Backward Selections
	if ((startNode.compareDocumentPosition(endNode) === 2) ||
		((startNode === endNode) && (startNodeOffset > endNodeOffset))) {
		// BACKWARD SELECTION
		startNode = [endNode, endNode = startNode][0];
		startNodeOffset = [endNodeOffset, endNodeOffset = startNodeOffset][0];
	}

	// Workaround Selections with not textNode extremes (Edge mostly)
	var useSelectionElement_start = null
	if (startNode.nodeType !== 3) {
		useSelectionElement_start = startNode
		// console.log('useSelectionElement_start', useSelectionElement_start, useSelectionElement_start.textContent.length)
		startNodeOffset = useSelectionElement_start.textContent.length
	}
	var useSelectionElement_end = null
	if (endNode.nodeType !== 3) {
		useSelectionElement_end = endNode
		// console.log('useSelectionElement_end', useSelectionElement_end, useSelectionElement_end.textContent.length)
		endNodeOffset = useSelectionElement_end.textContent.length
	}

	// Nodes > parentElements
	var startEl = useSelectionElement_start || hl.getParentIgnoring(startNode, 'SPAN')
	var endEl = useSelectionElement_end || hl.getParentIgnoring(endNode, 'SPAN')

	// Offset in parent element and Context
	var flat, textContentBefore;
	// START
	flat = hl.flatten(startEl)
	textContentBefore = ""
	for (var i = 0; i < flat.indexOf(startNode); i++) textContentBefore += flat[i].textContent;
	var startElOffset = textContentBefore.length + startNodeOffset
	textContextInFlatElement(flat, startNode, startNodeOffset, textContentBefore, context.start, 64)
	// END
	flat = hl.flatten(endEl)
	textContentBefore = ""
	for (var i = 0; i < flat.indexOf(endNode); i++) textContentBefore += flat[i].textContent;
	var endElOffset = textContentBefore.length + endNodeOffset
	textContextInFlatElement(flat, endNode, endNodeOffset, textContentBefore, context.end, 64)

	// Selection Instance
	annotation.selection = {
		anchorNodeParent: startEl,
		anchorOffset: startElOffset,
		focusNodeParent: endEl,
		focusOffset: endElOffset
	}
	//console.log('selectionGrabber selection', annotation.selection)
	// Context Serialized
	hl.trimSpecialChars(context.start)
	hl.trimSpecialChars(context.end)

	// Caches in context without serializing
	var useCache = F1000Global.whitelistedPathsCacheOn || F1000Global.whitelistedPagesInfoCacheOn
	if (useCache) {
		// Common
		var xPathRange = hl.annotations.serializeSelectionRange(annotation)
		// Paths
		if (F1000Global.whitelistedPathsCacheOn) {
			context = hl.pathsCache.makeCacheEntry(xPathRange, annotation, context)
			// If needed on resetup it will be instantiated by core/setupAnnotations
		}
		// Pages
		if (F1000Global.whitelistedPagesInfoCacheOn) {
			var pages = pagesInfo.getPagesByXPathRange(xPathRange)
			context = pagesInfo.makeCacheEntry(pages, annotation, context)
			// We can instantiate this immediately
			annotation.pagesInfo = pages
		}
	}

	// Stores quoteContext
	annotation.quoteContext = stringify(context)
	//console.log('selectionGrabber annotation', annotation)
	return annotation
}
