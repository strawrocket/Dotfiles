"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

// NOTE: IF ANYTHING IN THIS FILE is changed in a way that would allow rescan
// to be more effective then F1000Global.rescanSignature can be used
// to invalidate paths cache of existing annotations.

// Given a rescanned quote finds the elements and the element normalized offsets in the document
f1kat.hl.selectionScan = function (annotation, rescanData) {
	var hl = f1kat.hl
	if (!annotation || !rescanData) return

	var s = document.getSelection()

	// SINGLE OCCURRENCE, full quote based
	var fullQuoteMatch = rescanData.fullQuoteMatch
	if (fullQuoteMatch) {
		var quoteInDoc = fullQuoteMatch[0]
																				//console.log('fullQuoteMatch', fullQuoteMatch)
		// if .find fails here, we are gonna hard rescan with quoteContext
		var quoteNodes = hl.selectText(quoteInDoc)
		if (quoteNodes) {
			// START
			var startEl = hl.getParentIgnoring(s.anchorNode, 'SPAN')
			var startOffset = hl.nodePositionInParent(s.anchorNode, startEl) + s.anchorOffset
			// END
			var endEl = hl.getParentIgnoring(s.focusNode, 'SPAN')
			var endOffset = hl.nodePositionInParent(s.focusNode, endEl) + s.focusOffset
			// RESULT
			annotation.selection = {
				anchorNodeParent: startEl,
				anchorOffset: startOffset,
				focusNodeParent: endEl,
				focusOffset: endOffset
			}
																				//console.log('%cRESCAN: SUCCESS SINGLE ' + annotation.id, 'color: green; background: darkgrey;')
			return true;
		}
	}

	// MULTIPLE OCCURRENCES, context based
	var contextQuoteMatch = rescanData.contextQuoteMatch
	if (contextQuoteMatch) {
																				//console.log('contextQuoteMatch', contextQuoteMatch)
		var startInDoc = contextQuoteMatch.start[0]
		var endInDoc = contextQuoteMatch.end[0]
		var contextRange = contextQuoteMatch.contextRange
		// START text >> node >> parentElement
		var startNode = hl.selectText(startInDoc, contextQuoteMatch.start.index) && s.anchorNode
																				//console.log('startNode', startNode)
		if (!startNode) return false;
		var startEl = hl.getParentIgnoring(startNode, 'SPAN')
																				//console.log('startEl', startEl)
		// Offset in parentElement
		var startOffset = hl.nodePositionInParent(startNode, startEl) + s.anchorOffset + contextRange.start.offset
																				//console.log('startOffset', startOffset)
		// END text >> node >> parentElement
		var endNode = hl.selectText(endInDoc, contextQuoteMatch.end.index) && s.anchorNode
																				//console.log('endNode', endNode)
		if (!endNode) return false;
		var endEl = hl.getParentIgnoring(endNode, 'SPAN')
																				//console.log('endEl', endEl)
		// Offset in parentElement
		var endOffset = hl.nodePositionInParent(endNode, endEl) + s.anchorOffset + contextRange.end.offset
																				//console.log('endOffset', endOffset)
		// RESULT
		annotation.selection = {
			anchorNodeParent: startEl,
			anchorOffset: startOffset,
			focusNodeParent: endEl,
			focusOffset: endOffset
		}
																				//console.log('result', annotation.selection)
																				//console.log('%cRESCAN: SUCCESS MULTIPLE ' + annotation.id, 'color: green; background: darkgrey;')
		return true;
	}

	// NO STRATEGY WORKED
	return false;
}

//
// Rescan Worker matches a quote against a content
// NOTE: F1000 PDF Viewer pagesInfo relays on this very same rescan and MUST BE MODIFIED ACCORDINGLY.
//
f1kat.hl.allowFullQuoteMatch = true
f1kat.hl.fuzzyMatchAmbiguityCheckEnabled = true
var quoteScanWorkerDataURL = null
function quoteScanWorkerScript() {
	if (!quoteScanWorkerDataURL) {
		quoteScanWorkerDataURL = URL.createObjectURL(
			new Blob([funString(funstring_quoteScanWorker)], { type: "text/javascript" })
		)
	}
	return quoteScanWorkerDataURL
}
function quoteScanWorkerConfig() {
	var browser = detectBrowser().browser
	if (browser === 'ie' &&
		F1000Global.partialsFindThreshold < 2) {
		// this is enforced here as a security measure: as running on long quote explorer find woth low threshold would take too long
		f1kat.hl.allowFullQuoteMatch = false
	}
	// EDGE findShim is forced to context anchor nodes
	if (browser === 'edge') {
		f1kat.hl.allowFullQuoteMatch = false
	}
	return {
		// false when explicitly unwanted, eg. PDFs, workbench (or to help our custom explorer find :))
		allowFullQuoteMatch: f1kat.hl.allowFullQuoteMatch,
		// false for pages that duplicate content in body, eg. cell.com
		fuzzyMatchAmbiguityCheckEnabled: f1kat.hl.fuzzyMatchAmbiguityCheckEnabled
	}
}
function funstring_quoteScanWorker() {
	var whitelistedChars = {
		'_': '.?',
		'-': '.?',
		'α': 'α|a|alpha',
		'β': 'β|ϐ|b|beta',
		'ϐ': 'β|ϐ|b|beta',
		'γ': 'γ|c|g|gamma',
		'δ': 'δ|d|delta',
		'ε': 'ε|ϵ|e|epsilon',
		'ϵ': 'ε|ϵ|e|epsilon',
		'ζ': 'ζ|z|zeta',
		'η': 'η|h|eta',
		'θ': 'θ|ϑ|th|theta',
		'ϑ': 'θ|ϑ|th|theta',
		'ι': 'ι|i|j|iota',
		'κ': 'κ|ϰ|k|kappa',
		'ϰ': 'κ|ϰ|k|kappa',
		'λ': 'λ|l|lambda',
		'μ': 'μ|m|mu',
		'ν': 'ν|n|nu',
		'ξ': 'ξ|x|xi',
		'ο': 'ο|o|omicron',
		'π': 'π|p|pi',
		'ρ': 'ρ|ϱ|r|p|rho',
		'ϱ': 'ρ|ϱ|r|p|rho',
		'σ': 'σ|ς|sigma',
		'τ': 'τ|t|tau',
		'υ': 'υ|y|upsilon',
		'φ': 'φ|f|phi',
		'χ': 'χ|x|chi',
		'ψ': 'ψ|psi',
		'ω': 'ω|omega',
		'alpha': 'α|a|alpha',
		'beta': 'β|ϐ|b|beta',
		'gamma': 'γ|c|g|gamma',
		'delta': 'δ|d|delta',
		'epsilon': 'ε|ϵ|e|epsilon',
		'zeta': 'ζ|z|zeta',
		'eta': 'η|h|eta',
		'theta': 'θ|ϑ|th|theta',
		'iota': 'ι|i|j|iota',
		'kappa': 'κ|ϰ|k|kappa',
		'lambda': 'λ|l|lambda',
		'mu': 'μ|m|mu',
		'nu': 'ν|n|nu',
		'xi': 'ξ|x|xi',
		'omicron': 'ο|o|omicron',
		'pi': 'π|p|pi',
		'rho': 'ρ|ϱ|r|p|rho',
		'sigma': 'σ|ς|sigma',
		'tau': 'τ|t|tau',
		'upsilon': 'υ|y|upsilon',
		'phi': 'φ|f|phi',
		'chi': 'χ|x|chi',
		'psi': 'ψ|psi',
		'omega': 'ω|omega'
	}

	function fuzzyMatch(content, text, ambiguityCheck) {
																						//console.log('newMatch: whole: original\n', text)
		// trim and split at the regexp whitelisted chars, capturing.
		// 'testtest'.split(/(t)/) -> ["", "t", "es", "t", "", "t", "es", "t", ""]
		// text between the split parts: the matches of /(t)/ are on odd indexes 1, 3, 5 and 7...
		// the split parts: the split texts between the /(t)/ are on even indexes 0, 2, 4, 6 and 8...
		var split = text.trim().split(whitelistedCharsRegExp)
		var fuzzy = [];
		for (var i = 0, len = split.length; i < len; i++) {
			var s = split[i];
			if (i % 2 === 1) {
																						//console.log('newMatch: odd: greek slice\n', s)
				// ODD, a greek pattern (char or word matched by a key of the whitelistedChars)
				var replacement = whitelistedChars[s.toLowerCase()];
				// we exchange the pattern for the regexp encompassing it
				if (replacement) fuzzy.push('(?:' + replacement + ')')
			} else {
				// EVEN, a non greek pattern in a quote that has greek patterns
				var wordCharacters = s.match(/[A-Za-z_]/g)
				// we should look the unicode ranges for puntuaction rather than adding each we encounter
				var nonWordCharacters = s.match(/[^\w ():?!“”\"]/g)
				// safety test: we must avoid exponential complexity, the lower the threshold the lower the rescan power!
				// XN: this maybe not needed anymore, test as follow:
				//if (false) { // see dev db libraryItem /work/item/59224/resources/41530/pdf (user paolo.caminiti)
				// may eventually become something like (or more smartly check for word chars before on full quote):
				//if (!wordCharacters && i !== 0 && i !== len) {
				if (!wordCharacters || nonWordCharacters && (nonWordCharacters.length / wordCharacters.length > 1)) {
					// escape only: too many non words in this slice would grow complexity, it's left untouched.
																						//console.log('newMatch: even: preseved slice\n', s)
					if (s.length > 0) fuzzy.push(s.replace(/([.*+?^$\{\}()|\[\]\/\\])/g, "\\$1"))
				} else {
																						//console.log('newMatch: even: replaced slice\n', s)
					// trim non latin only if very beginning of context to prevent starting with any
					if (i === 0) s = s.replace(/^[^A-Za-z]+/, '')
					// the actually usefull part
					fuzzy.push(s
						// split on every character accepting any non word in the middle
						// ') Lo1r em ' -> ') L[\\W]*?o[\\W]*?1[\\W]*?r[\\W]*?e[\\W]*?m[\\W]*?'
						.replace(/([\w])[\W]*/g, '$1[\\W]*?')
						// if text didn't start with [\w], fix the [\W] at the beginning
						// ') L[\\W]*?o[\\W]*?1[\\W]*?r[\\W]*?e[\\W]*?m[\\W]*?' ->
						// '[\\W]*?L[\\W]*?o[\\W]*?1[\\W]*?r[\\W]*?e[\\W]*?m[\\W]*?'
						.replace(/^[\W]+/g, '[\\W]*?')
						// numbers can be any character, on PDFs :)
						// '[\W]*?L[\\W]?o[\\W]?1[\\W]?r[\\W]?e[\\W]?m[\\W]?' ->
						// '[\W]*?L[\\W]?o[\\W]?.[\\W]?r[\\W]?e[\\W]?m[\\W]?'
						.replace(/\d/g, '.?')
					)
					// note: escape is not needed ONLY as long all non words are removed
				}
			}
		}
		// rebuilds whole regexp
		fuzzy = fuzzy.join('')
		// analyze and simplify exponential complexity
		// XN: since we now run in a webworker we won't have crashes, still having more rules to avoid complexity would be good to increase rescan power
		fuzzy = fuzzy.replace(/(\[\\W\]\*\?\.\?){2,}/g, '.*?')
		// compile
		var re = new RegExp(fuzzy, ambiguityCheck ? 'gi' : 'i')
																						//console.log('newMatch: whole: regex\n', fuzzy)
		var result = re.exec(content)
		if (result && ambiguityCheck && fuzzyMatchAmbiguityCheckEnabled) {
			var hasMoreMatches = re.exec(content)
			if (hasMoreMatches) {
				result = false
			}
		}

		return result && {
			'0': result[0],
			index: result.index
		}
	}

	function fullQuoteMatch(content, annotation) {
		// rescan without context on the workbench abstract would yield false positives
		if (allowFullQuoteMatch) {
			if (annotation.quote.length > 16 && annotation.quote.length < 2048) {
																						//console.time('quote: fuzzy ' + annotation.id)
				var match = fuzzyMatch(content, annotation.quote, true)
																						//console.timeEnd('quote: fuzzy ' + annotation.id)
																						//console.log('quoteCount:', quoteCount)
				if (match) {
					return match
				}
			}
		}

		return false
	}

	function contextQuoteMatch(content, annotation) {
		// Implements quoteContext version "1": string (this is NOT meant to match the rescan signature)
		if (!annotation.quoteContext) return false;
		var contextRange = JSON.parse(annotation.quoteContext)
		if (contextRange.v !== "1") return false;
																						//console.log('contextRange:', contextRange)
																						//console.time('start context: fuzzy ' + annotation.id)
		var startInDoc = fuzzyMatch(content, contextRange.start.containerText, false)
																						//console.timeEnd('start context: fuzzy ' + annotation.id)
																						//console.log('startInDoc:', startInDoc)
		if (!startInDoc) return false;
																						//console.time('end context: fuzzy ' + annotation.id)
		var endInDoc = fuzzyMatch(content, contextRange.end.containerText, false)
																						//console.timeEnd('end context: fuzzy ' + annotation.id)
																						//console.log('endInDoc:', endInDoc)
		if (!endInDoc) return false;

		// Context Ambiguity - Very Simple Resolver: blindly accepts up to 4 times original quote length.
		var newRangeLength = (endInDoc.index + contextRange.end.offset) - (startInDoc.index + contextRange.start.offset)
																						//console.log('ambiguity fail', newRangeLength, annotation.quote.length * 4, newRangeLength > (annotation.quote.length * 4))
		if (newRangeLength > (annotation.quote.length * 4)) return false;

		return { start: startInDoc, end: endInDoc, contextRange: contextRange }
	}

	/*
		e.data {
			annotations [{
				id String | number
				quote String
				quoteContext JSON String
			}, ...]
			config {
				allowFullQuoteMatch Any
				fuzzyMatchAmbiguityCheckEnabled Any
			}
			content String
		}
	*/
	var allowFullQuoteMatch;
	var fuzzyMatchAmbiguityCheckEnabled;
	var whitelistedCharsRegExp = null
	onmessage = function (e) {
		var d = e.data
		// config
		allowFullQuoteMatch = d.config.allowFullQuoteMatch
		fuzzyMatchAmbiguityCheckEnabled = d.config.fuzzyMatchAmbiguityCheckEnabled
		// initialize greeks regexp
		if (!whitelistedCharsRegExp) {
			var charsRegExp = Object.keys(whitelistedChars).join('|')
			whitelistedCharsRegExp = new RegExp('(' + charsRegExp + ')', 'gi')
		}
		// run
		var annotations = d.annotations
		var content = d.content
		var matched = [];
		annotations.forEach(function (a) {
			var full = fullQuoteMatch(content, a)
			var context = contextQuoteMatch(content, a)
			matched.push({
				id: a.id,
				fullQuoteMatch: full,
				contextQuoteMatch: context
			})
		})
		// callback
		postMessage({ matched: matched })
	}
}
