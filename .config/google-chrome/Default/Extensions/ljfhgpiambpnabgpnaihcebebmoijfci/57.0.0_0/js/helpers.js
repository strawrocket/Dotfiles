'use strict';
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

//
// Contants
//
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//
// Content flags
// This kind of flags cannot be in shared config.js as they cannot run in some browsers
// background env (ie), but still we want them before all as global flags.
//
F1000Global.framesetPage = !!(document && document.querySelector('frameset'))
F1000Global.isInIframe = window && window.top !== window

//
// Lazy and safe UIRoot attach
//
F1000Global._uiRootRef = null
F1000Global.getUIRoot = function () {
	var el = F1000Global._uiRootRef
	// creation
	if (!el) {
		el = document.createElement('span')
		el.id = "F1000AnnotatorUI"
		// if (detectBrowser().browser === 'safari') {
		// 	if (!false) {
		// 		el.className = 'f1kat-left-handed'
		// 	}
		// 	// fix: FCORE-11284
		// 	var head = document && document.head
		// 	if (head &&
		// 		head.children.length === 1 &&
		// 		head.children[0].id === 'xml-viewer-style') {
		// 		return
		// 	}
		// }
		// mobile, embedded, ie styles
		if (F1000Global.contentStyles) {
			var s = document.createElement('style')
			s.type = 'text/css'
			s.appendChild(document.createTextNode(F1000Global.contentStyles))
			el.appendChild(s)
		}
		F1000Global._uiRootRef = el
	}
	// ensure attachment
	if (!el.parentNode) {
		if (F1000Global.framesetPage) {
			document.querySelector('frameset').parentNode.appendChild(el)
		} else {
			if (!F1000Global.isInIframe) {
				document.body.appendChild(el)
			}
		}
	}
	return el
}

//
// Repeats init (after boot) flow for lazy pages where pageObjectIds runs too early,
// this helper allows repeated init without whitelisting
//
F1000Global.deferredInit = function () {
	try {
		F1000Global.preventAnnotationsGET = false
		pageObjectIds.libraryItemId = null
		pageObjectIds.scan(true)
		content_script.highlighter = false
		content_script.init()
		content_script.pageInfosCacheSet()
		content_script.contentState()
		popup.update()
	} finally {
		// console.log('deferredInit')
	}
}

//
// make a http url string https
//
function makeHTTPS(s) {
	return s.indexOf('https:') === -1 ? s.replace('http:', 'https:') : s
}

//
// safe decodeURIComponent
//
function safeDecodeURIComponent(s) {
	try {
		var d = decodeURIComponent(s)
		return d
	} catch (e) {
		// console.log('F1000Annotator/safeDecodeURIComponent exception', s)
		return null
	}
}

//
// ie and bookmarklet can self detach to avoid collaiding of blacklisted dois in page scan
//
function selfScriptDetach() {
	var selfScript = document.querySelectorAll('script#f1000-annotator-source')
	if (selfScript.length > 0) [].forEach.call(selfScript, function (i) {
		if (i && i.parentNode) i.parentNode.removeChild(i)
	})
}

//
// Everywhere Multiline Strings
//
function funString(fn) {
	var s = fn.toString()
	return s.substring(s.indexOf('{') + 1, s.length - 1)
}

//
// Origin polyfill where not present (was old safari)
//
F1000Global.getOrigin = function () {
	var l = window.location
	return l.origin ?
		l.origin :
		l.protocol + "//" + l.hostname + (l.port ? ':' + l.port : '')
}

//
// Fragment helper (old safari was special)
//
F1000Global.htmlFragment = function (frag) {
	// if (detectBrowser().browser === 'safari') {
	// 	var f = document.createElement('div')
	// 	f.innerHTML = frag
	// 	return document.createDocumentFragment().appendChild(f)
	// }
	return document.createRange().createContextualFragment(frag)
}

//
// Debounce
//
F1000Global.debounce = function (func, wait, immediate) {
	var timeout
	return function () {
		var context = this
		var args = arguments
		var later = function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

//
// Random int in range
//
F1000Global.getRandomInt = function (min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min
}

//
// Sort on field alphabetically
//
F1000Global.sortAlphabetically = function (field) {
	return function (a, b) {
		var A = a[field].toUpperCase()
		var B = b[field].toUpperCase()
		return (A < B) ? -1 : (A > B) ? 1 : 0
	}
}

//
// Trigger mouse event
//
F1000Global.triggerMouseEvent = function (node, type, bubbles, cancelable) {
	bubbles = bubbles === undefined ? true : bubbles
	cancelable = cancelable === undefined ? true : cancelable
	var e = document.createEvent('MouseEvents')
	e.initEvent(type, bubbles, cancelable)
	node.dispatchEvent(e)
}

//
// dETECTS a fRAMESET pAGE best chance to be run
//
function framesetGetMain() {
	var frame
	var frames
	// known domains
	frame = top.frames['main'] || top.frames['SidebarLinks'] || top.frames['iucr_body']
	if (frame && frame.document && frame.document.body) return frame
	// heuristic bottom right
	frames = document.querySelectorAll('frame')
	frames = [].map.call(frames, function (i) { return { f: i, r: i.getBoundingClientRect() } })
	frames = [].filter.call(frames, function (i) { return i.r.height > 32 })
	frames.sort(function (a, b) { return b.r.top > a.r.top })
	frames.sort(function (a, b) { return b.r.left > a.r.left })
	if (frames[0]) {
		frame = top.frames[frames[0].f.name]
		return frame && frame.document && frame.document.body ? frame : null
	}
	return null
}
F1000Global.framesetRunAttemps = 128
function framesetRun() {
	var frame = framesetGetMain()
	if (frame) {
		browser.runtime.sendMessage(null, { sessionHandler: false })
	} else {
		if (!F1000Global.framesetRunAttemps) return;
		F1000Global.framesetRunAttemps--;
		setTimeout(framesetRun, 500)
	}
}

//
// Query element ancestor matching selector
//
F1000Global.queryElementAncestor = function (el, selector) {
	var match = Element.prototype.matches ||
		Element.prototype.matchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector
	var c = el
	for (; c && c !== document; c = c.parentNode) {
		if (match.call(c, selector)) {
			return c
		}
	}
	return null
}

//
// Notifications
//
F1000Global.notifications = {
	frag: null,
	content: null,
	show: function (show, msg) {
		if (show) {
			if (!F1000Global.notifications.frag) {
				var frag = F1000Global.notifications.frag = jsonML2Dom(
					['div#f1k-progressNotification']
				)
				F1000Global.notifications.content = frag
				F1000Global.getUIRoot().appendChild(frag)
			}
			F1000Global.notifications.content.textContent = msg
		} else {
			F1000Global.notifications.frag &&
				F1000Global.notifications.frag.parentNode.removeChild(
					F1000Global.notifications.frag
				)
			F1000Global.notifications.frag = null
		}
	}
}

//
// PDF Handler
//
F1000Global.PDFHandler = function () {
	var ArrayBufferReader = function (buffer) {
		var bytes = buffer instanceof Uint8Array
			? buffer
			: new Uint8Array(buffer)
		this.getBytes = function () {
			return bytes.subarray(0, bytes.length)
		}
	}

	var StringReader = function (str) {
		this.getBytes = function () {
			var length = str.length
			var buffer = new Uint8Array(length)
			for (var i = 0; i < length; i++) {
				buffer[i] = str.charCodeAt(i) & 0xFF
			}
			var bufferReader = new ArrayBufferReader(buffer)
			return bufferReader.getBytes()
		}
	}

	var Base64Encoder = function () {
		this.fromUint8Array = function (array) {
			var CHUNK_SIZE = 0x8000
			var index = 0
			var length = array.length
			var result = ''
			var slice
			while (index < length) {
				slice = array.subarray(index, Math.min(index + CHUNK_SIZE, length))
				result += String.fromCharCode.apply(null, slice)
				index += CHUNK_SIZE
			}
			return window.btoa(result)
		}
	}

	this.get = function (url, success, error, progress) {
		var xhr = new XMLHttpRequest()
		xhr.open('GET', url, true)
		xhr.responseType = 'arraybuffer'
		xhr.onload = function () {
			var reader = typeof xhr.response === 'string'
				? reader = new StringReader(xhr.response)
				: new ArrayBufferReader(xhr.response)
			var encoder = new Base64Encoder()
			var encoded = encoder.fromUint8Array(reader.getBytes())
			success(encoded)
		}
		if (error) xhr.onerror = error
		if (progress) xhr.onprogress = progress
		xhr.withCredentials = true
		xhr.send(null)
	}
}

//
// Parse english word numbers up to 20th
//
F1000Global.parseWordNumber = function (word) {
	var englishOrdinals = ['zero', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'];
	var englishOrdinalsSuffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
	word = ('' + word).trim()
	var cardinal = parseInt(word)
	if (word.match(/\D/)) {
		if (cardinal > 0) return word // 1st, word was parsed as number but contains chars
		else cardinal = englishOrdinals.indexOf(word.toLowerCase()) // first, ed only contains chars, try to match ordinal
	}
	if (cardinal > 0) {
		// suffix, ed was only a number or is a valid (positive) converted ordinal
		if (('' + cardinal).match(/11$|12$|13$/)) return cardinal + englishOrdinalsSuffix[0]
		else return cardinal + englishOrdinalsSuffix[cardinal % 10]
	}
	// nothing
	return word
}

//
// Select Box for collectionIds
//
F1000Global.collectionSelect = {}
F1000Global.collectionSelect.container = null
F1000Global.collectionSelect.optionClicked = function (targetEl) {
	var collectionId = targetEl.id.replace('f1k-collection-id_', '')
	var collectionName = targetEl.dataset.collectionName
	var collection = (!collectionId) ? { id: null, name: 'Unsorted' } : { id: collectionId, name: collectionName }
	content_script.session.collectionId = collection
	content_script.collectionId()
	F1000Global.collectionSelect.close()
}
F1000Global.collectionSelect.optionsHandler = function (e) {
	var el = e.target || e.srcElement
	if (el.className.indexOf("f1k-collectionSelect-option") !== -1) F1000Global.collectionSelect.optionClicked(el)
}
F1000Global.collectionSelect.adderSubmit = function (e) {
	var el = e.target || e.srcElement
	var collectionName = el.parentNode.querySelector('input').value.trim()
	if (collectionName === '') return;
	if (collectionName.toLowerCase() === 'unsorted' ||
		content_script.collections.PRIVATE.filter(function (i) {
			return i.name.toLowerCase() === collectionName.toLowerCase()
		}).length > 0) {
		var adderError = document.getElementById('f1k-collectionSelect-adder-error')
		if (adderError) adderError.setAttribute('style', 'display: block;')
		return;
	}
	F1000Global.request('get', getBaseURL() + '/annotator/collection/create?name=' + encodeURIComponent(collectionName), null, 'urlencoded',
		function (d) {
			var collection = JSON.parse(d)
			content_script.collections.PRIVATE.push(collection)
			content_script.collections.PRIVATE.sort(function (a, b) {
				return (a.name < b.name) ? -1 : (a.name === b.name) ? 0 : 1;
			})
			content_script.session.collectionId = collection
			content_script.collectionId()
			F1000Global.collectionSelect.close()
		},
		content_script.unauthorized
	)
}
F1000Global.collectionSelect.adderKeyDown = function (e) {
	switch (e.keyCode) {
		case 13:
			e.preventDefault()
			var saveBtn = document.querySelector('#f1k-collectionSelect-adder-button')
			if (saveBtn && saveBtn.click) saveBtn.click()
			break;
	}
}
F1000Global.collectionSelect.adderHandler = function (e) {
	var el = e.target || e.srcElement
	el.removeEventListener('click', F1000Global.collectionSelect.adderHandler)
	var r = ['div.f1000-an-appear',
		['input#f1k-collectionSelect-adder-input.f1k-collectionSelect-adder-input', {
			placeholder: "Project Name", maxlength: "1000",
			$: 'keydown.adderKeyDown'
		}],
		['button#f1k-collectionSelect-adder-button.f1k-collectionSelect-adder-button',
			{ $: 'click.adderSubmit' },
			'CREATE'
		]
	]
	el.style.padding = '0px'
	el.replaceChild(jsonML2Dom(r, F1000Global.collectionSelect), el.firstChild)
	document.querySelector('.f1k-collectionSelect-adder-input').focus()
}
F1000Global.collectionSelect.handleMouseOut = function (e) {
	if (!F1000Global.collectionSelect.container) return;
	var el = e.target || e.srcElement
	if (F1000Global.collectionSelect.container.contains(el)) return;
	F1000Global.collectionSelect.close()
}
F1000Global.collectionSelect.close = function () {
	if (!F1000Global.collectionSelect.container) return;
	window.removeEventListener('mousedown', F1000Global.collectionSelect.handleMouseOut)
	window.removeEventListener('scroll', F1000Global.collectionSelect.close)
	F1000Global.collectionSelect.container.removeEventListener('click', F1000Global.collectionSelect.optionsHandler)
	F1000Global.getUIRoot().removeChild(F1000Global.collectionSelect.container)
	F1000Global.collectionSelect.container = null
}
F1000Global.collectionSelect.open = function (targetEl, collectionsObj, selectedId, makePositionFixed) {
	if (targetEl.nodeName.toUpperCase() === 'SPAN') targetEl = targetEl.parentNode
	// Dom
	var container = document.createElement('div')
	container.id = 'f1k-collectionSelect'
	container.className = 'f1k-collectionSelect-container'
	var list = document.createElement('div')
	list.className = 'f1k-collectionSelect-list'
	list.appendChild(jsonML2Dom(F1000Global.collectionSelect.collectionsListTemplate(), {}))
	container.appendChild(list)
	var adderError = document.createElement('div')
	adderError.id = 'f1k-collectionSelect-adder-error'
	adderError.className = 'dn'
	adderError.textContent = 'A project with this name already exists, try another.'
	var adder = document.createElement('div')
	adder.id = 'f1k-collectionSelect-adder'
	adder.className = 'f1k-collectionSelect-adder'
	adder.textContent = 'Create new project...'
	// user subscription based adder
	var canCreate = content_script.collections.canCreate
	if (canCreate) {
		container.appendChild(adderError)
		container.appendChild(adder)
	} else {
		list.style.borderBottom = 'initial'
	}
	// Styles
	var margin2window = 32
	var adderHeight = 30
	var targetElRect = targetEl.getBoundingClientRect()
	var targetElCss = getComputedStyle(targetEl)
	/*if (makePositionFixed) {
		container.style.position = 'fixed'
	} else {
		// XN recompute with scrollOffset
		// set the absolute default in highlighter.css
		// switch scroll listener at bottom
	}*/
	container.style.left = targetElRect.left + 'px'
	container.style.width = targetElRect.width + 'px'
	var innerHeight = window.innerHeight
	var clientHeight = document.documentElement.clientHeight
	var windowHeight = innerHeight <= clientHeight ? innerHeight : clientHeight
	var space2bottom = windowHeight - targetElRect.top
	var closer2Top = (space2bottom > targetElRect.top) ? true : false
	var containerHeight = 0
	if (closer2Top) {
		container.style.top = targetElRect.top + 'px'
		containerHeight = (space2bottom - margin2window)
	} else {
		container.style.bottom = windowHeight - targetElRect.bottom + 'px'
		containerHeight = (targetElRect.top - margin2window)
	}
	container.style.zIndex = 9999999999;
	container.style.maxHeight = containerHeight + 'px'
	list.style.maxHeight = containerHeight - adderHeight - 4 + 'px'
	adder.style.height = adderHeight + 'px'
	// Attach
	F1000Global.getUIRoot().appendChild(container)
	F1000Global.collectionSelect.container = container
	// Current Collection
	if (!selectedId.id) selectedId.id = ''
	var selectedEl = document.querySelector('#f1k-collection-id_' + selectedId.id)
	if (selectedEl) {
		selectedEl.classList.add('f1k-collectionSelect-option-selected')
	} else {
		selectedId.id = ''
		selectedEl = document.querySelector('#f1k-collection-id_' + selectedId.id)
		selectedEl.classList.add('f1k-collectionSelect-option-selected')
	}
	// Listeners
	container.addEventListener('mousedown', function (e) { e.stopPropagation() })
	container.addEventListener('click', F1000Global.collectionSelect.optionsHandler)
	adder.addEventListener('click', F1000Global.collectionSelect.adderHandler)
	// Outside listeners
	window.addEventListener('mousedown', F1000Global.collectionSelect.handleMouseOut, true)
	// XN swtich once the absolute position is working
	//list.addEventListener('scroll', function (e) { e.stopPropagation() })
	window.addEventListener('scroll', F1000Global.collectionSelect.close)
}
F1000Global.collectionSelect.collectionsListTemplate = function () {
	function collection(i) {
		var spacer = i.isSubcollection ? '        ' : '    '
		var r = ['div.f1k-collectionSelect-option', {
			id: 'f1k-collection-id_' + i.id,
			title: i.name,
			'data-collection-name': i.name
		},
			spacer + i.name
		]
		return r
	}

	var o = content_script.collections
	var r = ['span',
		['div.f1k-collectionSelect-option', { id: 'f1k-collection-id_', 'data-collection-name': 'Unsorted', style: 'padding: 2px 4px;' },
			'Unsorted'
		],
		['div.f1k-collectionSelect-option.f1k-collectionSelect-optionGroupLabel', { id: 'f1k-collection-id_READING_LIST', 'data-collection-name': 'Reading list', style: 'padding: 2px 4px;' },
			'Reading list'
		]
	];
	if (o.PRIVATE.length > 0) r = r.concat([['div.f1k-collectionSelect-optionGroupLabel', 'Private projects']]).concat(o.PRIVATE.map(collection))
	if (o.SHARED.length > 0) r = r.concat([['div.f1k-collectionSelect-optionGroupLabel', 'Shared projects']]).concat(o.SHARED.map(collection))
	return r
}

//
// Desktop App Connector, DA4pdf and alikes to decide when to use it
//
var DA = {
	instanciated: false,
	pendingSave2Save: false,
	ready: false,
	supported: true,
	token: null,
	onConnected: function (token) {
		// once we start a pending save we don't need any more to update
		if (DA.pendingSave2Save === 'committed') return
		// Default behaviour
		DA.token = token
		DA.ready = true
		popup.update()
		// pickup a pending save (whiteliste/wiley)
		if (DA.pendingSave2Save === true) {
			DA.pendingSave2Save = 'committed'
			handlers.save2.save()
		}
	},
	onNotConnected: function (macAddress) {
		var request = F1000Global.request
		var syncConnectQS = '?macAddress=' + macAddress
		request('get', getBaseURL() + '/annotator/sync/connect' + syncConnectQS, null, 'json',
			function (wkbConnectRespone) {
				var doLoginQS = '?userId=' + state.session.user.id
				doLoginQS += '&macAddress=' + macAddress
				doLoginQS += '&authCode=' + wkbConnectRespone.authCode
				// DA requests must fly without cross origin credentials
				var doLogin = new XMLHttpRequest()
				doLogin.open('GET', 'https://app.sciwheel.com:7974' + '/doLogin' + doLoginQS, true)
				doLogin.onload = function () {
					if (doLogin.status >= 200 && doLogin.status < 400) {
						DA.onConnected('DEFAULT_TOKEN')
					} else {
						DA.onCommunicationError()
					}
				}
				doLogin.onerror = DA.onCommunicationError
				doLogin.send()
			},
			DA.onCommunicationError
		)
	},
	onCommunicationError: function () {
		DA.instanciated = true
		DA.ready = false
		popup.update()
	},
	connect: function () {
		DA.instanciated = true
		var request = F1000Global.request
		var connectQS = '?userId=' + state.session.user.id
		// DA requests must fly without cross origin credentials
		var daConnect = new XMLHttpRequest()
		daConnect.open('GET', 'https://app.sciwheel.com:7974' + '/connect' + connectQS, true)
		daConnect.onload = function () {
			if (daConnect.status >= 200 && daConnect.status < 400) {
				var daConnectResponse = JSON.parse(daConnect.responseText)
				if (daConnectResponse.properties && daConnectResponse.properties.uploadFileFromAnnotator === true) {
					if (!!daConnectResponse.authenticated) {
						request('get', getBaseURL() + '/annotator/sync/connInfo', null, 'json',
							function (wkbConnectInfoResponse) {
								if (wkbConnectInfoResponse.connected &&
									daConnectResponse.macAddress === wkbConnectInfoResponse.macAddress) {
									DA.onConnected(daConnectResponse.token);
								} else {
									DA.onNotConnected(daConnectResponse.macAddress);
								}
							},
							DA.onCommunicationError
						)
					} else {
						DA.onNotConnected(daConnectResponse.macAddress);
					}
				} else {
					DA.supported = false
					DA.onCommunicationError()
				}
			} else {
				DA.onCommunicationError()
			}
		}
		daConnect.onerror = DA.onCommunicationError
		daConnect.send()
	},
	startAndConnect: function () {
		window.open('f1000://startDesktopApp', '_self')
		DA.ready = false
		DA.instanciated = false
		setTimeout(popup.update, navigator.platform.indexOf('Mac') >= 0 ? 2500 : 0)
	},
	uploadFile: function (collectionId, itemId, pdfUrl, referrer, successCb, errorCb) {
		var uploadFileQS = '?collectionId=' + collectionId
		uploadFileQS += '&itemId=' + itemId
		uploadFileQS += '&pdfUrl=' + pdfUrl
		// currently unsupported by DA (FCORE-10576)
		//if (referrer) uploadFileQS += '&referrer=' + referrer
		// DA requests must fly without cross origin credentials
		var uploadFile = new XMLHttpRequest()
		uploadFile.open('GET', 'https://app.sciwheel.com:7974' + '/uploadFileFromAnnotator' + uploadFileQS, true)
		uploadFile.onload = function () {
			if (uploadFile.status >= 200 && uploadFile.status < 400) {
				var uploadFileResponse = JSON.parse(uploadFile.responseText)
				successCb(uploadFileResponse)
			} else {
				errorCb('failed @ updloadFile.onload with status', uploadFile.status)
			}
		}
		uploadFile.onerror = errorCb
		uploadFile.send()
	}
}

//
// ScrollTo
//
function _scrollTo(target, offset, duration, threshold, callback) {
	function easeInOutQuad(time, start, change, duration) {
		time /= duration / 2
		if (time < 1) return change / 2 * time * time + start
		time--
		return -change / 2 * (time * (time - 2) - 1) + start
	}

	function getScrollParent(el) {
		for (var p = el; p.parentNode; p = p.parentNode) {
			var s = getComputedStyle(p)
			var r = /(auto|scroll)/.test(s.overflow + s.overflowX + s.overflowY)
			if (r) return p
		}
	}

	function position() {
		if (scrollTarget) {
			return scrollTarget.scrollTop
		} else {
			return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
		}
	}

	function move(amount) {
		if (scrollTarget) {
			scrollTarget.scrollTop = amount
		} else {
			document.documentElement.scrollTop = amount
			document.body.parentNode.scrollTop = amount
			document.body.scrollTop = amount
		}
	}

	function animateScroll() {
		currentTime += increment
		var val = easeInOutQuad(currentTime, start, change, duration)
		move(val)
		if (currentTime < duration) {
			requestAnimationFrame(animateScroll)
		} else {
			// fallback
			var elTop = target.getBoundingClientRect().top
			var clientHeight = document.documentElement.clientHeight
			if (elTop < 0 || elTop > clientHeight) target.scrollIntoView()
			// callback
			if (callback) callback()
		}
	}

	/*function getOffset (el, parent) {
		var till = parent || document.body
		var elCurrent = el
		var elOffset = el.offsetTop
		for (; elCurrent.parentNode && elCurrent !== till; elCurrent = elCurrent.parentNode) {
			if (elCurrent.offsetTop) elOffset += elCurrent.offsetTop
		}
		return elOffset
	}*/

	var scrollTarget = getScrollParent(target)
	//var offsetTop = getOffset(target, scrollTarget)
	var offsetTop = target.offsetTop + target.clientTop + target.offsetParent.offsetTop + target.offsetParent.clientTop
	var to = offsetTop - offset
	// setup
	var start = position()
	var change = to - start
	var currentTime = 0
	var increment = 20
	// unworth
	if (threshold && (Math.abs(change) < threshold)) return callback ? callback() : undefined
	// worth
	animateScroll()
}

//
// pagesInfo, as seen on F1000PDFViewer
//
var pagesInfo = {
	contentReady: false,
	contentArray: [],
	contentString: '',
	contentPageIndexes: [],
	setContent: function (raw) {
		pagesInfo.contentArray = raw
		pagesInfo.contentString = raw.join('')
		// builds the pages postion lookup
		var current = 0
		var end = 0
		var indexes = []
		for (var i = 0; i < raw.length; i++) {
			end = current + raw[i].length
			indexes.push([current, end])
			current = end + 1
		}
		pagesInfo.contentPageIndexes = indexes
		pagesInfo.contentReady = true
	},
	getPagesByPosition: function (start, end) {
		function getPageByPosition(position) {
			if (!position) return false
			for (var page = 0; page < pagesInfo.contentPageIndexes.length; page++) {
				var pi = pagesInfo.contentPageIndexes[page]
				if (pi[0] <= position && position <= pi[1]) {
					page++
					break
				}
			}
			return page
		}

		var startPage = getPageByPosition(start)
		var endPage = getPageByPosition(end)
		return (startPage && endPage) ? { start: startPage, end: endPage } : false
	},
	getPagesByXPathRange_regExp: null,
	getPagesByXPathRange: function (range) {
		var re = this.getPagesByXPathRange_regExp
		if (!re) return false
		var start = re.exec(range.start)
		var end = re.exec(range.end)
		var valid = start && start[1] && end && end[1]
		return valid ? { start: parseInt(start[1]), end: parseInt(end[1]) } : false
	},
	extractCachedPagesInfo: function (annotation) {
		var context = JSON.parse(annotation.quoteContext)
		var cachedPagesInfo = context.cachedPagesInfo && context.cachedPagesInfo[F1000Global.whitelistedPathsCacheDomain]
		// the cached whitelisted signature should be the very same as it means we trust the html
		// the cached rescan engine signature should be the same or higher as it can improve on deployed clients at different release dates
		if (cachedPagesInfo &&
			cachedPagesInfo.whitelistedSignature === F1000Global.whitelistedSignature &&
			cachedPagesInfo.rescanSignature >= F1000Global.rescanSignature) {
			return cachedPagesInfo.pages
		} else {
			return false
		}
	},
	assignPagesInfo: function (annotation, pages) {
		annotation.pagesInfo = pages
	},
	makeCacheEntry: function (pages, annotation, context) {
		var context = context || JSON.parse(annotation.quoteContext)

		var cachedPagesInfo = {
			rescanSignature: F1000Global.rescanSignature, // use engine signature - config.js
			whitelistedSignature: F1000Global.whitelistedSignature, // use domain signature - whitelist.js
			pages: pages
		}

		context.cachedPagesInfo = context.cachedPagesInfo || {}
		context.cachedPagesInfo[F1000Global.whitelistedPagesInfoCacheDomain] = cachedPagesInfo
		//console.log('new context', context)
		return context
	},
	instantiate: function (annotations, cb) {
		// This MUST be safe to run multiple times
		//console.log('pagesInfo.scan', f1kat.hl.annotations.all)
		var annotations = annotations || f1kat.hl.annotations.all
		var content = this.contentString
		var cachable = [];
		var asyncScanning = [];

		annotations.forEach(function (annotation) {
			var pages;
			// pagesInfo already in use
			if (annotation.pagesInfo) return
			// Annotation with pagesInfoCache
			if (annotation.quoteContext) {
				pages = pagesInfo.extractCachedPagesInfo(annotation)
				if (pages) return pagesInfo.assignPagesInfo(annotation, pages)
			}
			// Annotation was made on PDF before pagesInfo was introduced
			// EXTRACT FROM XPATHS
			if (annotation.inSameDomain === true) {
				pages = pagesInfo.getPagesByXPathRange(annotation.ranges[0])
				if (pages) {
					// worth caching
					cachable.push(annotation)
					return pagesInfo.assignPagesInfo(annotation, pages)
				}
			}
			// From now on we need content, we should run again later
			if (!pagesInfo.contentReady) return
			// Content based logic: async worker based
			asyncScanning.push(annotation)
		})
		// handle the content based
		if (asyncScanning.length > 0) {
			pagesInfo.asyncScan(asyncScanning, cb)
		} else if (pagesInfo.contentReady && cb) {
			cb()
		}
		// cache
		cachable.forEach(pagesInfo.put)
	},
	asyncScanWorker: {
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
	},
	asyncScan: function (annotations, cb) {
		var worker = pagesInfo.asyncScanWorker.start()
		// callback
		worker.onmessage = function (e) {
			// Dispose the worker
			pagesInfo.asyncScanWorker.terminate()
			// get pages info from content matches
			var pages;
			var matched = e.data.matched
			var cachable = [];
			matched.forEach(function (scanData) {
				var annotation = f1kat.hl.annotations.getById(scanData.id)
				cachable.push(annotation)
				var startIndex;
				var endIndex;
				// External Annotation, MUST follow rescan logic.
				// SINGLE OCCURRENCE
				var fullQuoteMatch = scanData.fullQuoteMatch
				if (fullQuoteMatch) {
					startIndex = fullQuoteMatch.index
					endIndex = startIndex + fullQuoteMatch[0].length
					pages = pagesInfo.getPagesByPosition(startIndex, endIndex)
					if (pages) return pagesInfo.assignPagesInfo(annotation, pages)
				}
				// MULTIPLE OCCURRENCE
				var contextQuoteMatch = scanData.contextQuoteMatch
				if (contextQuoteMatch) {
					var contextRange = contextQuoteMatch.contextRange
					startIndex = contextQuoteMatch.start.index + contextRange.start.offset
					endIndex = contextQuoteMatch.end.index + contextRange.end.offset
					pages = pagesInfo.getPagesByPosition(startIndex, endIndex)
					if (pages) return pagesInfo.assignPagesInfo(annotation, pages)
				}
				// NO STRATEGY WORKED, we can now ignore this annotation until we invalidate the cache
				return pagesInfo.assignPagesInfo(annotation, { start: -1, end: -1 })
			})
			// Callback
			if (cb) {
				cb()
				cb = null
			}
			// cache
			cachable.forEach(pagesInfo.put)
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
			content: pagesInfo.contentString
		})
		// safeguard
		var safeguardTime = annotations.length * 500
		pagesInfo.asyncScanWorker.timeout = setTimeout(function () {
			pagesInfo.asyncScanWorker.terminate()
			if (cb) cb()
		}, safeguardTime)
	},
	put: function (a) {
		var context = pagesInfo.makeCacheEntry(a.pagesInfo, a)
		a.quoteContext = stringify(context)
		f1kat.hl.annotations.put(a)
	},
	scrollToPage: function (start, end) {
		//console.log('scrollToPage start end', start, end)
		var pageEl = document.getElementById('pageContainer' + end)
		if (!pageEl) return
		// suspend the whitelister while we render the pages
		F1000Global.whitelistedSuspended = true
		pageEl.scrollIntoView()
		//console.log('scrolled to page', end)
		if (start < end) {
			//console.log('scrolling remaining start end', start < end, start, end)
			var TL = pageEl.querySelector('.textLayer')
			if (TL && TL.children.length > 0) {
				//console.log('textLayer present')
				setTimeout(function () { pagesInfo.scrollToPage(start, end - 1) }, 0)
			} else {
				//console.log('textLayer absent')
				document.addEventListener('textlayerrendered', {
					start: start,
					end: end,
					handleEvent: function () {
						document.removeEventListener('textlayerrendered', this, false)
						pagesInfo.scrollToPage(this.start, this.end - 1)
					}
				}, false)
			}
		} else {
			F1000Global.whitelistedSuspended = false
		}
	}
}

//
// F1000PDFViewer pinch zoom for mobile
//
var F1000PDF_pinchZoomHandler = {
	startTouchDistance: 0,
	endTouchDistance: 0,
	lastTouchTime: 0,
	lastScaleIntent: 'boot',
	init: function () {
		var _this = F1000PDF_pinchZoomHandler
		document.body.addEventListener('touchstart', _this.touchstart)
	},
	touchDistance: function (e) {
		var t0 = e.touches[0];
		var t1 = e.touches[1];
		if (t0 && t1) {
			var x0 = t0.screenX
			var y0 = t0.screenY
			var x1 = t1.screenX
			var y1 = t1.screenY
			return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1))
		} else {
			return 0
		}
	},
	touchstart: function (e) {
		var _this = F1000PDF_pinchZoomHandler
		if (e.touches.length == 1) {
			var elapsed = Date.now() - _this.lastTouchTime
			_this.lastTouchTime = Date.now()
			if (elapsed < 250) {
				e.preventDefault()
				_this.doubleTap()
			}
		} else if (e.touches.length == 2) {
			_this.startTouchDistance = _this.endTouchDistance = _this.touchDistance(e)
			document.body.addEventListener('touchmove', _this.touchmove)
			document.body.addEventListener('touchcancel', _this.touchend)
			document.body.addEventListener('touchend', _this.touchend)
		}
	},
	touchmove: function (e) {
		var _this = F1000PDF_pinchZoomHandler
		_this.endTouchDistance = _this.touchDistance(e)
	},
	touchend: function (e) {
		var _this = F1000PDF_pinchZoomHandler
		document.body.removeEventListener('touchmove', _this.touchmove)
		document.body.removeEventListener('touchcancel', _this.touchend)
		document.body.removeEventListener('touchend', _this.touchend)
		var delta = _this.startTouchDistance - _this.endTouchDistance
		if (Math.abs(delta) > 8) {
			var scale = PDFViewerApplication.pdfViewer.currentScale
			if (delta < 0) {
				_this.lastScaleIntent = 'in'
				scale += 0.25
			} else {
				_this.lastScaleIntent = 'out'
				scale -= 0.25
			}
			if (scale > 0.1 && scale < 4) {
				WV.collapseSelection()
				PDFViewerApplication.pdfViewer._setScale(scale)
			}
		}
	},
	doubleTap: function () {
		var _this = F1000PDF_pinchZoomHandler
		var intent;
		var scale;
		switch (_this.lastScaleIntent) {
			case 'in':
				intent = 'fullScale'
				break;
			case 'out':
				intent = 'page-width'
				break;
			case 'page-width':
				intent = 'fullScale'
				break;
			case 'boot':
				intent = 'fullScale'
				break;
			default:
				intent = 'page-width'
		}
		if (intent === 'fullScale') {
			scale = F1000Global.isTablet ?
				(F1000Global.isLandscape ? 2.5 : 2) :
				(F1000Global.isLandscape ? 1.5 : 1)
		} else {
			scale = intent
		}
		_this.lastScaleIntent = intent
		PDFViewerApplication.pdfViewer._setScale(scale)
	}
}

//
// Embedded Annotator Helper, setup env and ui shims
//
F1000Global.embeddedHelper = function () {
	// ActionButton API Shim for Background
	setF1000ActionButton = function (id, iconState) { }
	setF1000ActionButtonBadge = function (id, iconState) { }

	// ActionButton
	F1000Global.actionButtonPrevented = false

	function actionButtonDrag(el) {
		var dragStartY;

		function onmousemove(e) {
			if (Math.abs(dragStartY - e.clientY) > 12) {
				dragStartY = Infinity
				F1000Global.actionButtonPrevented = true
				el.style.top = e.clientY - 24 + 'px'
			}
		}

		function release(e) {
			document.removeEventListener('mousemove', onmousemove)
			document.removeEventListener('mouseup', stop)
		}

		el.addEventListener('mousedown', function (e) {
			e.preventDefault()
			e.stopPropagation()
			if (e.which === 1) {
				dragStartY = e.clientY
				F1000Global.actionButtonPrevented = false
				document.addEventListener('mousemove', onmousemove)
				document.addEventListener('mouseup', release)
			}
		})
	}

	function actionButtonMount(isF1000PDFViewer) {
		var button = document.createElement('div')
		button.id = isF1000PDFViewer ? 'f1000-at-action-button-pdf' : 'f1000-at-action-button'
		var rendered = '<span id="' + button.id + '-icon" class="f1kat-img-F-8x12"/>'
		button.innerHTML = rendered
		button.addEventListener('click', function (e) {
			if (!F1000Global.actionButtonPrevented) {
				content_script.invoke(null, { browserAction: null })
			}
		})
		F1000Global.onPopupOpen = F1000Global.onPopupClose = function (isOpen) {
			button.style.opacity = isOpen ? '0.25' : '1'
		}
		if (isF1000PDFViewer) {
			var toolbar = document.getElementById('toolbarViewerRight')
			if (toolbar) toolbar.appendChild(button)
		} else {
			actionButtonDrag(button)
			F1000Global.getUIRoot().appendChild(button)
		}
	}

	function updateEndpoints() {
		var host = location.hostname
		if (host.indexOf('f1000.com') !== -1 ||
			host.indexOf('f1000internal.com') !== -1 ||
			host.indexOf('sciwheel.com') !== -1 ||
			host.indexOf('sciwheelinternal.com') !== -1 ||
			host.indexOf('facultyopinions.com') !== -1 ||
			host.indexOf('facultyinternal.com') !== -1) {
			getBaseURL() = location.origin + '/newapi'
			getwbURL() = location.origin
		}
	}

	// Install - this is picked up by the bookmarklet url code
	window.f1kat = { content_script: { invoke: content_script.invoke } }

	// Attach
	var isF1000PDFViewer = document.head && document.head.querySelector('meta[name="F1000-PDF-Viewer"]')
	if (isF1000PDFViewer) {
		updateEndpoints()
	}

	actionButtonMount(isF1000PDFViewer)
}

F1000Global.integratedUI_F1000PDFViewer = function (contentState) {
	// console.log('F1000Global.integratedUI_F1000PDFViewer')
	var slot = document.getElementById('f1kat-integration-slot')

	var highlighterLabel = {
		OFF: 'Highlight off',
		ON: 'Highlight + notes',
		AUTO: 'Highlight on'
	}[popup.highlighter.getSpin()]

	function getAnnotationsCount() {
		var annotations = f1kat && f1kat.hl && f1kat.hl.annotations && f1kat.hl.annotations.all
		return Array.isArray(annotations) ? annotations.length : 0
	}

	function render() {
		var hasUser = !!(state.session && state.session.user)
		var notesCount = getAnnotationsCount()
		var notesCountLabel = notesCount ? '(' + notesCount + ')' : ''
		return (
			hasUser ?
				['div#f1kat-integration-slot', { style: 'height: 37px; color: white;' },
					['div.f1kat-integration-button', { $: 'click.integrated.notesOpen', title: 'Show Notes' },
						['div', { style: 'display: flex;' },
							['div.f1kat-img-notes-white'],
							['div#f1kat-integration-notes-count', notesCountLabel]
						]
					],
					['div.f1kat-integration-button', { $: 'click.integrated.tagsOpen', title: 'Show Tags' },
						['div.f1kat-img-tags-white']
					],
					['div.f1kat-integration-hl-sw-trigger', { $: 'click.integrated.highlighterMode' },
						['div.f1kat-integration-hl-sw-select-label',
							highlighterLabel,
							['div.f1kat-integration-hl-sw-select-arrow', '▼']
						],
						['div.f1kat-integration-hl-sw-select', {
							style: 'position: absolute; top: 0; left: 0px; height: 111px; background: #1e2023'
						},
							['div.f1kat-integration-hl-sw-select-item', { 'data-f1kat-hl-spin': 'OFF' },
								'Highlight off'
							],
							['div.f1kat-integration-hl-sw-select-item', { 'data-f1kat-hl-spin': 'AUTO' },
								'Highlight on'
							],
							['div.f1kat-integration-hl-sw-select-item', { 'data-f1kat-hl-spin': 'ON' },
								'Highlight + notes'
							]
						]
					]
				] : ['div#f1kat-integration-slot']
		)
	}

	if (slot) slot.parentNode.replaceChild(jsonML2Dom(render(), handlers), slot)
}

F1000Global.extraScraping = {
	keywords: function extraScraping_keywords() {
		try {
			var r
			var host = location.host
			var citationKeywords = document.querySelectorAll('meta[name="citation_keywords"]')
			if (citationKeywords &&
				// citation standard: any domain
				citationKeywords.length > 0) {
				r = Array.prototype.reduce.call(citationKeywords, function (a, i) {
					var c = i.content
					if (c) {
						var multiple = c.split(/[,;\|]/)
						if (multiple.length > 1) {
							a = a.concat(multiple)
						} else {
							a.push(c)
						}
					}
					return a
				}, [])
			}
			else if (host.indexOf('pubmed.ncbi.nlm.nih.') !== -1) {
				// pubmed2019
				var titleHint = document.querySelector('.abstract .sub-title')
				if (titleHint && titleHint.textContent.match(/keyword/i)) {
					var raw = titleHint.parentElement.textContent.replace(/keywords?:?/i, '').trim()
					r = raw.split(/[,;]/)
				}
			}
			else if (host.indexOf('.webofknowledge.') !== -1) {
				// known complex dom traversal: webofknowledge
				var allTitleHints = document.querySelectorAll('.title3')
				var keywordTitleHint = Array.prototype.filter.call(allTitleHints, function (i) {
					return i.textContent.indexOf('Keywords') !== -1
				})[0]
				if (keywordTitleHint) {
					var list = keywordTitleHint.parentNode.querySelectorAll('a')
					if (list && list.length > 0) {
						r = Array.prototype.map.call(list, function (i) {
							return i.textContent
						})
					}
				}
			}
			else {
				// direct css selector: many domains
				var keywordsSelector
				if (host.indexOf('.sagepub.') !== -1 ||
					host.indexOf('.jbc.') !== -1 ||
					host.indexOf('.jneurosci.') !== -1 ||
					host.indexOf('.pnas.') !== -1 ||
					host.indexOf('.oup.') !== -1) {
					keywordsSelector = '.kwd-group a'
				}
				else if (host.indexOf('.tandfonline.') !== -1) {
					keywordsSelector = '.abstractKeywords a'
				}
				else if (host.indexOf('.biomedcentral.') !== -1 ||
					host.indexOf('.springer.') !== -1) {
					keywordsSelector = '.Keyword'
				}
				else if (host.indexOf('sciencedirect.') !== -1) {
					// NOTE: likely overridden by whitelister
					keywordsSelector = '.keyword'
				}
				else if (host.indexOf('.ahajournals.') !== -1) {
					keywordsSelector = '.highwire-list .highwire-list .highwire-article-collection-term .title'
				}
				if (keywordsSelector) {
					var list = document.querySelectorAll(keywordsSelector)
					if (list && list.length > 0) {
						r = Array.prototype.map.call(list, function (i) {
							return i.textContent
						})
					}
				}
			}
			return r && r.length && r.length > 0
				? r.map(function (i) { return i.trim() }).join(', ')
				: null
		} catch (e) {
			console.log('F1000Annotator/scrapeKeywords error', e)
			return null
		}
	}
}

F1000Global.encodeDominantAsQS = function () {
	/* To be used on Prime frontend like this:
		function decodeQueryStringMetadata() {
			// NOTE: assume nothing about returned object, authors may contains "et al."
			try {
				var encodedMetadata = location.search.replace(/^.*=/, '')
				var decodedMetadata = decodeURIComponent(encodedMetadata)
				var metadata = JSON.parse(decodedMetadata)
				return typeof metadata === 'object' ? metadata : {}
			} catch (e) {
				console.log('Could not parse metadata from query string.')
				return {}
			}
		}
	*/
	try {
		var dominant = state.pageObjectIds.dominant
		var qs = encodeURIComponent(JSON.stringify(dominant))
		return qs
	} catch (e) {
		console.log('F1000Annotator: Could not encode metadata for Prime recommendation query string.')
	}
}