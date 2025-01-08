"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

var f1kat = f1kat || {}

f1kat.hl = {}
f1kat.highlighterTarget = null
f1kat.highlighterTargetOffset = null

// NOTE: called by showNotes.update - XX WV.syncAnnotations
f1kat.hl.orderAnnotationsByPosition = function () {
	function byElement (a, b) {
		var aFirstSpan = a.spans[0]
		var bFirstSpan = b.spans[0]
		var code = aFirstSpan.compareDocumentPosition(bFirstSpan)
		switch (code) {
			case 2:
			case 8:
				return 1
			case 4:
			case 16:
				return -1
			case 1:
			case 32:
			default:
				return 0
		}
	}

	function byPagesInfo (a, b) {
		var aPage = a.pagesInfo.start
		var bPage = b.pagesInfo.start
		if (aPage !== bPage) {
			return aPage - bPage
		} else {
			var aRange = a.ranges[0]
			var bRange = b.ranges[0]
			if (aRange && aRange.startOffset &&
				bRange && bRange.startOffset) {
				var aOffset = aRange.startOffset
				var bOffset = bRange.startOffset
				return aOffset - bOffset
			} else {
				// for safety but should never happen since we slipt not found
				return 0
			}
		}	
	}

	function isFoundElement (i) {
		return i.spans && i.spans[0]
	}

	function isFoundPagesInfo (i) {
		return i.pagesInfo && i.pagesInfo.start > 0
	}

	function splitFound (all) {
		return all.reduce(function (acc, i) {
			if (isFoundCheck(i)) {
				acc.found.push(i)
			} else {
				acc.notFound.push(i)
			}
			return acc
		}, { found: [], notFound: [] })
	}

	// console.time('orderAnnotationsByPosition')
	var anyAnnotation =	f1kat.hl.annotations.all && f1kat.hl.annotations.all[0]
	var isPagesInfoAvailable = anyAnnotation && anyAnnotation.pagesInfo
	var sorter = isPagesInfoAvailable ? byPagesInfo : byElement
	var isFoundCheck = isPagesInfoAvailable ? isFoundPagesInfo : isFoundElement
	var splitted = splitFound(f1kat.hl.annotations.all)
	splitted.found.sort(sorter)
	f1kat.hl.annotations.all = splitted.found.concat(splitted.notFound)
	// console.timeEnd('orderAnnotationsByPosition')
}

f1kat.hl.getRescanContent = function () {
	// Rescan scope and content, this will reflect into the regexps and affect the find()
	var content;
	var browser = detectBrowser().browser
	if (browser === 'firefox' ||
		browser === 'edge' ||
		browser === 'ie') {
		// firefox, ie, edge legacy: see textContent in find()
		if (f1kat.highlighterTarget) {
			content = f1kat.highlighterTarget.textContent || f1kat.highlighterTarget.innerText
		} else {
			content = document.body.textContent || document.body.innerText
		}
	} else {
		// webkit browsers see innerText in find()
		if (f1kat.highlighterTarget) {
			content = f1kat.highlighterTarget.innerText || f1kat.highlighterTarget.textContent
		} else {
			content = document.body.innerText || document.body.textContent
		}
	}
	// Workarounds
	if (browser === 'edge') {
		// Normalize rescan indexes for findShim
		if (f1kat.highlighterTarget) {
			f1kat.highlighterTargetOffset = (
				document.body.textContent ||
				document.body.innerText
			).indexOf(content)
		}
	}
	return content
}

f1kat.hl.getCssPath = function (el) {
	if (!(el instanceof Element)) return;
	var path = [];
	while (el.nodeType === Node.ELEMENT_NODE) {
		var selector = el.nodeName.toLowerCase()
		var sib = el, nth = 1;
		while (sib = sib.previousElementSibling) {
			if (sib.nodeName.toLowerCase() === selector) nth++
		}
		//if (nth !== 1) selector += ":nth-of-type(" + nth + ")"
		selector += ":nth-of-type(" + nth + ")"
		path.unshift(selector)
		el = el.parentNode
	}
	path[0] = 'html'
	path[1] = 'body'
	return path.join(">");
}

f1kat.hl.xPath2cssPath = function (p) {
	p = p.replace('/', 'html>body>')
		 .replace(/\//g, '>')
		 .replace(/\[/g, ':nth-of-type(')
		 .replace(/\]/g, ')');
	return p;
}

f1kat.hl.cssPath2xPath = function (p) {
	p = p.replace('html>body>', '/')
		 .replace(/\>/g, '/')
		 .replace(/\:nth\-of\-type\(/g, '[')
		 .replace(/\)/g, ']')
	return p;
}

f1kat.hl.parents = function (node) {
	var nodes = [node];
	for (; node; node = node.parentNode) nodes.unshift(node);
	return nodes;
}

f1kat.hl.commonAncestor = function (node1, node2) {
	var hl = f1kat.hl

	if (node1 === node2) return node1;
	var parents1 = hl.parents(node1), parents2 = hl.parents(node2);
	for (var i = 0; i < parents1.length; i++) if (parents1[i] !== parents2[i]) return parents1[i - 1];
}

f1kat.hl.getParentIgnoring = function (el, ignore) {
	for (; el && ((el.nodeType === 1 && el.nodeName.toUpperCase() === ignore) || el.nodeType !== 1); el = el.parentNode);
	if (el.className.indexOf('f1000-at-ignore') !== -1) el = el.parentNode;
	return el;
}

f1kat.hl.flatten = function (node) {
	function childNodes2FlatArray(pNode) {
		if (!pNode) return;
		if (pNode.nodeType === 3) flat.push(pNode);
		else for (var i = 0; i < pNode.childNodes.length; i++) childNodes2FlatArray(pNode.childNodes[i]);
	}
	var flat = [];
	childNodes2FlatArray(node)
	return flat;
}

f1kat.hl.nodePositionInParent = function (node, parent) {
	var parentFlat = f1kat.hl.flatten(parent)
	var nodeIndex = parentFlat.indexOf(node)
	var position = 0
	for (var i = 0; i < nodeIndex; i++) position += parentFlat[i].textContent.length
	return position
}

f1kat.hl.caret2Node = function (caretElement, caretOffset) {
	var hl = f1kat.hl
																			//console.log('caret2Node element offset:', caretElement, caretOffset)
	var node, prevIndex
	var currentIndex = 0
	var flat = hl.flatten(caretElement)
																			//console.log('caret2Node flat:', flat)
	for (var i = 0; i < flat.length; i++) {
		node = flat[i];
		prevIndex = currentIndex
		currentIndex += node.textContent.length
		if (currentIndex > caretOffset) break;
	}
	caretOffset = caretOffset - prevIndex
																			//console.log('caret2Node node:', node)
	if (!node) return false;
																			//console.log('caret2Node caretOffset:', node.length, caretOffset)
	// XN what about this simple fix all?
	//if (node.length < caretOffset) caretOffset = node.length
	// can see the problem here, using the simpler non word trimmer:
	// http://www.ncbi.nlm.nih.gov/pmc/articles/PMC4155819/?report=classic
	// but how could the rescan give us an offset bigger than the real node?
	return (node.length < caretOffset) ? false : node.splitText(caretOffset)
}

f1kat.hl.trimSpecialChars = function (footprint) {
	var startingSpaces = footprint.containerText.match(/^\W+/)

	if (startingSpaces) {
		var trimBy = startingSpaces[0].length
		footprint.containerText = footprint.containerText.substr(trimBy)
		footprint.offset -= trimBy
		footprint.containerText.trim()
	}
}

f1kat.hl.highlightsInPath = function (path) {
	return [].filter.call(path, function (i) {
			return  typeof i.dataset !== "undefined" &&
					typeof i.dataset['f1kat_hl_id'] !== "undefined" &&
					i.dataset['f1kat_hl_id'] !== "undefined"
		})
}

f1kat.hl.annotationsInPath = function (path, omitClass) {
	var hl = f1kat.hl

	var annotations = []
	var hls = f1kat.hl.highlightsInPath(path)
	for (var i = 0; i < hls.length; i++) {
		var highlight = hls[i]
		if (omitClass && highlight.classList.contains(omitClass)) continue;
		var id = highlight.dataset['f1kat_hl_id'];
		var annotation = hl.annotations.getById(id)
		if (annotation) annotations.push(annotation)
	}
	return annotations
}

f1kat.hl.scrollBackup = function (restore) {
	if (restore) {
		document.documentElement.scrollLeft = document.body.scrollLeft = restore.x
		document.documentElement.scrollTop = document.body.scrollTop = restore.y
	} else {
		var x = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft
		var y = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
		return { x: x, y: y }
	}
}

f1kat.hl.caretBackup = function (element, caretPositionBackup) {
	if (!element) return
	if (element.type === 'email' || element.type === 'date' || element.type === 'number') return 0;
	if (typeof caretPositionBackup !== 'undefined') {
		element.focus()
		if (element.setSelectionRange !== undefined) element.setSelectionRange(caretPositionBackup, caretPositionBackup)
	} else {
		return element.setSelectionRange ? element.selectionStart : undefined;
	}
}

f1kat.hl.poetry = function (to_be) {
	var s = document.createElement('style')
	s.id = 'poetry_style'
	s.textContent = '.f1kat-hl { background-color: black !important; color: black !important }'
	if (to_be === 'lgbt') s.textContent = '.f1kat-hl { background-image: url("https://media0.giphy.com/media/pRIAy1YvTpyKc/200.gif"); }'
	document.body.appendChild(s)
	document.removeEventListener('mouseup', f1kat.hl.uiStateAdder)
	document.addEventListener('mouseup', function () {
		f1kat.hl.annotations.make(false)
		f1kat.hl.annotations.make(true)
	})
}

f1kat.hl.unwrap = function (element) {
	var children = element.childNodes
	var parent = element.parentNode
	if (children.length === 1) {
		// the simplest way: just replace element with the single child.
		return parent.replaceChild(children[0], element)
	}
	var document = element.ownerDocument
	var fragment = document.createDocumentFragment()
	var child
	while ((child = children[0])) {
		fragment.appendChild(child)
	}
	return parent.replaceChild(fragment, element)
}

f1kat.hl.mutateColorClass = function(annotation, color) {
	if (!annotation) return
	var newColorClass = '-color-' + color
	var matchColorClass = /-color-\S+/
	var spans = annotation.spans || []
	var el
	for (var i = 0; i < spans.length; i++) {
		el = spans[i]
		el.className = el.className.replace(matchColorClass, newColorClass)
	}
}

f1kat.hl.getColorClass = function(annotation) {
	var isOthers = annotation.author && annotation.author.id !== state.session.user.id
	if (!annotation.color) {
		// all old annotaions get cyan, new ones get current
		annotation.color = annotation.id ? 'e' : state.highlighter.color
	}
	var colorClass = 'f1kat-hl-color-' + annotation.color
	if (isOthers) colorClass += '-others'
	return colorClass
}

f1kat.hl.rainbowPot = function() {
    var hl = f1kat.hl
    function rainbow(a) {
        var c = ['a', 'b', 'c', 'd', 'e', 'f']
        var n = c[c.indexOf(a.color) + 1]
        hl.mutateColorClass(a, n)
        a.color = n
        loop(a)
    }
    function loop(a) {
        setTimeout(function () {
            rainbow(a)
        }, Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000)
    }
    var s = document.createElement('style')
    s.textContent = '.f1kat-hl { transition: background-color 3s; }'
    document.body.appendChild(s)
    hl.annotations.all.forEach(loop)
}

f1kat.hl.timestampf = function(ts) {
	var date = new Date(ts)
	var now = new Date()
	var daysDelta = Math.abs(Math.round((date - now)/86400000))
	if (daysDelta === 0) {
		return 'today'
	} else if (daysDelta < 8) {
		return daysDelta + (daysDelta === 1 ? ' day ago' : ' days ago')
	} else {
		return date.getDate() + ' ' + MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear()
}
}

f1kat.hl.filterAnnotations = function (idsArray) {
	var filterAuthor = idsArray[0];
	// all
	if (filterAuthor === 'all') {
		var hlSpans = document.querySelectorAll('.f1kat-hl')
		for (var i = 0; i < hlSpans.length; i++) hlSpans[i].classList.remove('f1kat-hl-filter-out')
		return;
	}
	// none
	if (filterAuthor === 'none') {
		var hlSpans = document.querySelectorAll('.f1kat-hl')
		for (var i = 0; i < hlSpans.length; i++) hlSpans[i].classList.add('f1kat-hl-filter-out')
		return;
	}
	// author.id
	var filteredIn = [];
	var filteredOut = [];
	f1kat.hl.annotations.all.forEach(function (i) {
		if (i.author && i.author.id === filterAuthor) {
			filteredIn.push(i)
		} else {
			filteredOut.push(i)
		}
	})
	filteredIn.forEach(function (a) {
		if (a.spans) {
			for (var i = 0; i < a.spans.length; i++) a.spans[i].classList.remove('f1kat-hl-filter-out')
		}
	})
	filteredOut.forEach(function (a) {
		if (a.spans) {
			for (var i = 0; i < a.spans.length; i++) a.spans[i].classList.add('f1kat-hl-filter-out')
		}
	})
}

f1kat.hl.pathsCache = {
	instantiate: function (a) {
		var acontext = JSON.parse(a.quoteContext)
		var pathsCacheDomain = F1000Global.whitelistedPathsCacheDomain
																				//console.log(a.id, pathsCacheDomain, acontext)
		if (acontext.cachedPaths && acontext.cachedPaths[pathsCacheDomain]) {
			var cachedPaths = acontext.cachedPaths[pathsCacheDomain]
																				// console.log('%cPATHS CACHE FOUND ' + a.id + ' ' + a.text, 'color: hotpink; background: lightgrey;')
			// the cached whitelisted signature should be the very same as it means we trust the html
			// the cached rescan engine signature should be the same or higher as it can improve on deployed clients at different release dates
			if (cachedPaths.whitelistedSignature === F1000Global.whitelistedSignature &&
				cachedPaths.rescanSignature >= F1000Global.rescanSignature) {
																				// console.log('VALID')
				// backups the original paths, they are picked up when serializing the annotation for the server
				a.range_original = a.ranges.slice()
				// use cached paths for selection instantiation
				a.ranges[0] = cachedPaths.range
				// mark as using pathsCache: disallow rescan on this annotation
				a.pathsCacheOn = true
				return // VALID CACHE
			}
		}
		/* UNCOMMENT if whitelistedSignature for PDFs come in use, this code will force rescan
			without using original inSameDomain ranges, (see PDFViewer whitelister).
		// backups the original paths, they are picked up when serializing the annotation for the server
		a.range_original = a.ranges.slice()
		// set ranges to clearly invalid paths to fail on selection instantiation
		a.ranges[0] = {
			end: 'f1k-invalidated',
			endOffset: 0,
			start: 'f1k-invalidated',
			startOffset: 0
		}
		// mark as NOT using pathsCache: allow rescan on this annotation
		a.pathsCacheOn = false
		*/
																				//console.log('INVALID OR NOT FOUND')
		return // INVALID OR NOT FOUND
	},
	makeCacheEntry: function (xPathRange, annotation, context) {
		var context = context || JSON.parse(annotation.quoteContext)

		var cachedPaths = {
			rescanSignature: F1000Global.rescanSignature, // use engine signature - config.js
			whitelistedSignature: F1000Global.whitelistedSignature, // use domain signature - whitelist.js
			range: xPathRange
		}

		context.cachedPaths = context.cachedPaths || {}
		context.cachedPaths[F1000Global.whitelistedPathsCacheDomain] = cachedPaths
																			//console.log('new context', context)
		return context
	},
	put: function (a) {
		var hl = f1kat.hl
		var cachableRanges = hl.annotations.serializeSelectionRange(a)
		var context = hl.pathsCache.makeCacheEntry(cachableRanges, a)
		a.quoteContext = stringify(context)
		f1kat.hl.pathsCache.instantiate(a)
		hl.annotations.put(a)
	}
}

// NOTE: if we indexOf the result of async rescan then we can build the flat once per rescan
// we now just handle -1 as a false find
function binaryClosestSearch(vector, value) {
	var min = 0
	var max = vector.length - 1
	var i;
	var el;
	while (min <= max) {
		i = (min + max) / 2 | 0
		//console.log(i)
		el = vector[i]
		if (el === value) {
			//console.log('break', i)
			// XX return i?
			break
		}
		if (el > value) {
			max = i - 1
		} else {
			min = i + 1
		}
	}
	//console.log(i, min, max)
	// XX needs review, and false case, why max?
	return max
}

/*
	NOTE: An improved rescan on text would avoid the Selection step:
		get start, end index from regexp
		adjust the indexes to match fullQuote (within indexes even indexOf quote has no ambiguity)
		collect all nodes indexes couples from the indexed find
		split the start, end nodes while adjusting the indexes accordingly
		collect all nodes within the final indexes couples (to allow overlapping highlights)
		collect nodes parent elements caches
		paint all
*/
var findShim = {
	textContent: '',
	nodes: [],
	nodesIndex: [],
	ready: false,
	init: function findShim_init () {
		// console.time('findShim indexing textContent')
		var nodes = this.flatten(document.body)
		var nodesIndex = []
		var nodeData = ''
		var nodeIndex = 0
		for (var i = 0, l = nodes.length; i < l; i++) {
			nodeData = nodes[i].data
			nodeIndex += nodeData.length
			nodesIndex.push(nodeIndex)
		}
		this.nodes = nodes
		this.nodesIndex = nodesIndex
		this.textContent = document.body.textContent
		this.ready = true
		// console.timeEnd('findShim indexing textContent')
	},
	flatten: function findShim_flatten (node) {
		function childNodes2FlatArray(pNode) {
			if (pNode) {
				if (pNode.nodeType === 3) {
					flat.push(pNode)
				} else {
					for (var i = 0; i < pNode.childNodes.length; i++) {
						childNodes2FlatArray(pNode.childNodes[i])
					}
				}
			}
		}
		var flat = []
		childNodes2FlatArray(node)
		return flat
	}
}

if (typeof window.find !== 'undefined') {
	f1kat.hl.selectText = function (text) {
		getSelection().collapse(document.body, 0)
		return text ? window.find(text) : false
	}
} else if (typeof document.body.createTextRange === 'undefined') {
	f1kat.hl.selectText = function (text, index) {
		if (findShim.ready === false) findShim.init()
		var targetOffset = f1kat.highlighterTargetOffset
		var targetIndex = targetOffset ? targetOffset + index : index 
		var nodeIndex = binaryClosestSearch(findShim.nodesIndex, targetIndex) + 1
		// implement false for binaryClosestSearch
		if (nodeIndex < 0) return false
		var node = findShim.nodes[nodeIndex]
		var offset = targetIndex - findShim.nodesIndex[nodeIndex - 1]
		if (offset < 0 || offset > node.data.length) return false
		var s = getSelection()
		// implement fullQuoteContext with selectiong add Range
		s.collapse(node, offset)
		return true
	}
} else {
	f1kat.hl.selectText = function (text, fRange, sanityCount) {
		if (!text) return false;
		getSelection().collapse(document.body, 0)
																			//console.log('\nselectText:', text)
		var f = fRange || document.body.createTextRange()
		var sanityCounter = sanityCount || 0;
		var found = f.findText(text)
		if (found) {
																			//console.log('selectText: found true')
			try {
				f.select()
																			//console.log('selectText: select success')
				return true
			} catch (e) {
																			//console.log('selectText: select exception', e)
				if (sanityCounter < 8) {
					f.move('character', text.length)
					return f1kat.hl.selectText(text, f, sanityCounter + 1)
				} else {
					return false
				}
			}
		} else {
																			//console.log('selectText: found false')
			var result = false
			if (F1000Global.partialsFindThreshold) result = f1kat.hl.findPartials(text, text)
																			//console.log('selectText findPartials result:', result)
			return result
		}
	}

	f1kat.hl.findPartials = function (partialText, originalText, fRange, documentRange) {
		// note: we need to carry on the original quote text for the validation
		// note: code relies heavily on this documentRange
		var documentRange = documentRange || document.body.createTextRange()
		var f = fRange || document.body.createTextRange()
																				//console.log('findPartials START', partialText)
		var middleIndex = partialText.length >> 1
		var firstHalf = partialText.substr(0, middleIndex)
		var secondHalf = partialText.substr(middleIndex, partialText.length)
		var result = false
		// note: we need to keep both original partialText and current working partial
		var partial = firstHalf
																				//console.log('findPartials PARTIAL', partial)
		// XN we can also raise the threshold if we use three slices
		if (partial == false) return false;
		if (partial.length < F1000Global.partialsFindThreshold) return false;
		var found = f.findText(partial.trim())
		//var result = f1kat.hl.selectText(firstHalf)

		// optimize: do the secondHalf or would be better to slice in thrice??
		if (found) {
																				//console.log(found, 'found: now doing findPartials validation')
																				//console.log('  > found text on partial:\n', f.text)
			// there will be added or missing characters like spaces
			f.moveEnd('character', originalText.length << 1)
																				//console.log('    > found text once extended:\n', f.text)
			// we need to validate ignoring indentation
			// XN can prepare this outside
			var fuzzyOriginalText = originalText.trim()
			// we need to scape regexp chars
			.replace(/([.*+?^$\{\}()|\[\]\/\\])/g, "\\$1")
			// we need to accept indentation inconcistencies
			.replace(/\s/g, '\\s?')
			fuzzyOriginalText = new RegExp(fuzzyOriginalText)
																				//console.log('    > fuzzy originalText to validate:\n', fuzzyOriginalText)
			var valid = f.text.search(fuzzyOriginalText)
			// if any it should be somewhere at the start
			valid = valid !== -1 && valid < 8
																				//console.log('valid', valid)
			if (valid) {
				try {
					// we need to move back the end to the right position as we may come from full quote rescan
					f.setEndPoint('EndToStart', f)
					f.moveEnd('character', originalText.length)
					f.select()
					return true
				} catch (e) {
																				//console.log('findPartials: select exception', e)
					// note: same behaviour as a not valid match, keep it consistent
					f.setEndPoint('EndToEnd', documentRange)
					f.moveStart('character', 4)
					result = f1kat.hl.findPartials(partialText, originalText, f, documentRange)
				}
			} else {
				// it was found but wrong: will find it again or try a sub partial
				// possible text range: somewhere after the start of the previous found range to the end of the document
				f.setEndPoint('EndToEnd', documentRange)
				f.moveStart('character', 4)
				result = f1kat.hl.findPartials(partialText, originalText, f, documentRange)
			}
		} else {
																				//console.log(found, 'findPartials validation')
			// back to start in document: out of an invalid found loop: found was longer may be latter in the document
			result = f1kat.hl.findPartials(partial, originalText, null, documentRange)
		}
		return result
	}
}
