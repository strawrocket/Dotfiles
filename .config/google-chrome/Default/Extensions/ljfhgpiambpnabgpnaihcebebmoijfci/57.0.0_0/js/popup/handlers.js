"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

var handlers = {}

handlers.stopPropagation = function (e) {
	e.stopPropagation()
}

handlers.popup = {
	toggle: function (e) {
		e.preventDefault()
		popup.toggle()
	},
	popBalloon: function (e) {
		e.preventDefault()
		var target = e.target || e.srcElement
		if (target.dataset && target.dataset.persist) {
			var preference = document.querySelector('#f1k-neveragain')
			if (preference && preference.checked) {
				var preferecesObj = {}
				preferecesObj['welcomeBalloon_' + state.welcomeBalloonDomain] = !preference.checked
				content_script.setPreferences(preferecesObj)
			}
		}
		var b = document.querySelector('.f1kat-balloon')
		b.parentElement.removeChild(b)
	},
	toggleDN: function (e) {
		var target = e.target || e.srcElement
		target.classList.toggle('dn')
	},
	openMenu: function (e) {
		var menu = document.getElementById('f1000-at-popup-menu-backdrop')
		if (menu) menu.style.display = 'block'
	},
	closeMenu: function () {
		var menu = document.getElementById('f1000-at-popup-menu-backdrop')
		if (menu) menu.style.display = 'none'
	},
	reload: function () {
		window.location.reload();
	}
}

handlers.login = {
	betaTryAgain: function (e) {
		state.login.betaRestriction = false
		content_script.unauthorized(401)
	},
	login: function (e) {
		e.preventDefault()
		state.login.tainted = true
		var rememberme = state.login.remembermePreference = document.querySelector("#f1000-at-popup .login #f1k-rememberme").checked
		var username = document.querySelector("#f1000-at-popup .login input[name=j_username]").value
		var password = document.querySelector("#f1000-at-popup .login input[name=j_password]").value
		var payload = {
			j_username: username,
			j_password: password,
			_spring_security_remember_me: rememberme
		}
		F1000Global.request("post", getBaseURL() + '/annotator/login', payload, 'urlencoded',
			content_script.logged,
			content_script.unauthorized
		)
	},
	loginFederated: function (e) {
		e.preventDefault()
		var t = e.target || e.srcElement
		state.login.tainted = true
		var system = t.value
		var rememberme = state.login.remembermePreference = document.querySelector("#f1000-at-popup .login #f1k-rememberme").checked
		var apiEntrypoint = getBaseURL().replace('/newapi', '')
		document.querySelector('#f1000-at-popup form.oauth input[name="_spring_security_oauth_remember_me"]').value = rememberme
		document.querySelector('#f1000-at-popup form.oauth input[name="_spring_security_oauth_remember_me"]').checked = rememberme ? 'checked' : ''
		document.querySelector('#f1000-at-popup form.oauth').action = apiEntrypoint + '/annotator/j_spring_oauth_security_check'
		document.querySelector('#f1000-at-popup form.oauth #openid-target-field').value = apiEntrypoint + '/annotator/oauth'
		document.querySelector('#f1000-at-popup form.oauth #system').value = system
		document.querySelector('#f1000-at-popup form.oauth').submit()
	},
	logout: function (e) {
		// kick out workspace user
		if (detectBrowser().browser !== 'ie') {
			var cookiesBaseURL = getBaseURL().replace('/newapi', '')
			F1000Global.request("get", cookiesBaseURL + '/annotator/logout', null, null, null, null)
		}
		// token and local logout
		F1000Global.request("get", getBaseURL() + '/signout', null, null, null, null)
		state.session.user = false
		F1000Global.setAuthorizationToken(null)
		content_script.unauthorized(401)
		popup.toggle()
	}
}

handlers.DA = {
	start: function (e) {
		e.preventDefault()
		DA.startAndConnect()
	}
}

handlers.recommendations = {
	toggle: function (e) {
		var t = e.target || e.srcElement
		var checked = t.checked ? true : false
		recommendations.toggle(checked)
	}
}

handlers.references = {
	selectAll: function (e) {
		var t = e.target || e.srcElement
		var checked = t.checked ? 'checked' : false
		var all = document.querySelectorAll('.references #list input[type="checkbox"]')
		for (var i = 0; i < all.length; i++) all[i].checked = checked
	},
	showCitedArticles: function (e) {
		var btn = document.querySelector('.f1kat-popup-showcitedarticles-btn')
		var btnArrow = document.querySelector('.f1kat-img-cited-arrow')
		var list = document.querySelector('.f1kat-popup-showcitedarticles-list')
		var primeModule = document.getElementById('f1kat-popup-prime-module')
		var save2 = document.querySelector('#f1000-at-popup .save2')
		state.references.showCitedArticles = !state.references.showCitedArticles
		if (state.references.showCitedArticles) {
			if (btn) btn.textContent = 'HIDE CITED ARTICLES'
			if (btnArrow) btnArrow.classList.remove('f1kat-img-cited-arrow-down')
			if (primeModule) {
				primeModule.className = 'f1kat-disappear-out'
				setTimeout(function () {
					primeModule.style.display = 'none'
					popup.dynamicStyles()
				}, 250)
			}
			if (list) list.style.display = 'block'
			if (save2 && !state.references.resolving) {
				state.save2Module = true
				save2.style.display = 'block'
			}
			popup.dynamicStyles()
			if (!state.pageObjectIds.list[0].resolved) {
				popup.preventInteraction()
				popup.references.resolve()
			}
		} else {
			if (btn) btn.textContent = 'SHOW CITED ARTICLES'
			if (btnArrow) btnArrow.classList.add('f1kat-img-cited-arrow-down')
			if (primeModule) {
				primeModule.className = ''
				primeModule.style.display = 'block'
			}
			if (list) list.style.display = 'none'
			if (save2 && pageObjectIds.libraryItemId) save2.style.display = 'none'
		}
	}
}

handlers.collectionSelectTrigger = function (e) {
	content_script.save2Select(e, true)
}

handlers.save2 = {
	autoImportAlternatePDF: function (e) {
		var t = e.target || e.srcElement
		var v = t.checked
		state.session.preferences.autoImportAlternatePDF = v
		content_script.setPreferences({ autoImportAlternatePDF: v })
	},
	save: function (e) {
		if (F1000Global.embeddedPluginOnlyPage) {
			popup.references.pdf()
		} else {
			if (pageObjectIds.pageType === 'ARTICLE') {
				if (state.references.showCitedArticles) {
					popup.references.post(true, false)
					popup.references.post(false, true)
				} else {
					popup.references.post(true, true)
				}
			} else {
				popup.references.post(true, false)
			}
		}

		// voids any demoMode on save
		state.demoMode = null
	}
}

handlers.highlighter = {
	onOff: function (e) {
		e.preventDefault()
		e.stopPropagation()

		function apply(nextState) {
			manipulateMatter(nextState)
			popup.highlighter.setSpin(nextState)
			popup.highlighter.applySpin()
		}

		function done(e) {
			c.removeEventListener('mousemove', onmove)
			c.removeEventListener('mouseup', done)
			c.removeEventListener('mouseout', out)
			var ex = e.clientX
			if (e.type === 'mouseout') {
				apply(getOrbital(ex))
			} else {
				if (!orbital) {
					apply(getOrbital(ex))
				}
			}
		}

		function out(e) {
			var ex = e.clientX
			var ey = e.clientY
			if (ey <= b.top ||
				ey >= b.bottom ||
				ex <= b.left ||
				ex >= b.right) {
				done(e)
			}
		}

		function getOrbital(ex) {
			if (ex < nucleus_lx) {
				return 'OFF'
			} else if (ex > nucleus_rx) {
				return 'ON'
			} else {
				return 'AUTO'
			}
		}

		function manipulateMatter(nextState) {
			var nextStateClass = 'f1kat-hl-sw-' + nextState
			document.getElementById('F1000-AT-highlighter-onoff-switch').className = nextStateClass
			document.getElementById('F1000-AT-highlighter-onoff-control').className = nextStateClass
		}

		function onmove(e) {
			var ex = e.clientX
			var deltaX = Math.abs(anchorX - ex)
			if (!anchorX ||
				deltaX > THRESHOLD_X) {
				anchorX = null
				var o = getOrbital(ex)
				if (o !== orbital) {
					orbital = o
					apply(o)
				}
			}
		}

		var THRESHOLD_X = 4
		var t = e.target || e.srcElement
		var anchorX = e.clientX
		var c = document.getElementById('F1000-AT-highlighter-onoff-container')
		var b = c.getBoundingClientRect()
		var quantum_step = b.width * .33
		var orbital = null
		var nucleus_lx = b.left + quantum_step
		var nucleus_rx = nucleus_lx + quantum_step

		c.addEventListener('mousemove', onmove)
		c.addEventListener('mouseup', done)
		c.addEventListener('mouseout', out)
	},
	toggleTooltip: function (e) {
		var tt = document.getElementById('f1kat-highglighter-help-tooltip')
		if (tt) {
			var on = tt.style.display && tt.style.display !== 'none'
			tt.style.display = on ? 'none' : 'block'
		}
	}
}

handlers.notes = {
	toggleFilterBox: function (e) {
		var container = document.getElementById('f1kat-notes-filter-container')
		if (container) {
			var shouldShow = container.style.display !== 'block'
			if (shouldShow) {
				window.addEventListener('mouseup', handlers.notes.toggleFilterBox, true)
				container.style.display = 'block'
			} else {
				window.removeEventListener('mouseup', handlers.notes.toggleFilterBox, true)
				container.style.display = 'none'
			}
		}
	},
	setFilter: function (e) {
		var t = e.target || e.srcElement
		var id = t.dataset['f1kat_notes_filter_id']
		state.filterNotes.id = id
		f1kat.hl.filterAnnotations([id])
		handlers.notes.update()
	},
	filterNotesContainerCleanup: function () {
		// filterNotes container clean up
		var filterNotesContainer = document.getElementById('f1kat-notes-filter-container')
		if (filterNotesContainer) {
			filterNotesContainer.parentElement.removeChild(filterNotesContainer)
		}
	},
	close: function (e) {
		state.column = 1
		var column2 = document.querySelector('.f1kat-popupColumn.f1kat-2')
		if (column2 && column2.firstChild) column2.removeChild(column2.firstChild)
		var popupColumns = document.querySelector('#f1kat-popupColumns')
		if (popupColumns) popupColumns.classList.remove('f1kat-2')
		// var titleEl = document.getElementById('f1000-at-popup-title')
		// titleEl.textContent = getPopupHeaderTitle()
		handlers.notes.filterNotesContainerCleanup()
	},
	open: function (e) {
		state.column = 2
		var popupColumns = document.querySelector('#f1kat-popupColumns')
		if (popupColumns) popupColumns.classList.add('f1kat-2')
		handlers.notes.update()
		// var titleEl = document.getElementById('f1000-at-popup-title')
		// titleEl.textContent = 'Notes'
	},
	update: function () {
		// null any pending update (eg. highlighter ajax)
		state.notesUpdatePending = false
		// List
		if (state.column === 2) {
			f1kat.hl.orderAnnotationsByPosition()
			var column2 = document.querySelector('.f1kat-popupColumn.f1kat-2')
			if (column2) {
				handlers.notes.filterNotesContainerCleanup()
				// update
				var frag = jsonML2Dom(templates.notes(), handlers)
				var current = column2.firstChild
				if (current) column2.replaceChild(frag, current)
				else column2.appendChild(frag)
				popup.dynamicStyles()
				// move filterNotes container outside overflow
				var filterNotesContainer = column2.querySelector('#f1kat-notes-filter-container')
				if (filterNotesContainer) {
					filterNotesContainer.parentElement.removeChild(filterNotesContainer)
					var uiRoot = document.getElementById('F1000AnnotatorUI')
					var isLeftHanded = document.getElementById('F1000AnnotatorUI').className.indexOf('f1kat-left-handed') !== -1
					filterNotesContainer.style[isLeftHanded ? 'left' : 'right'] = isLeftHanded ? '300px' : '28px'
					uiRoot.appendChild(filterNotesContainer)
				}
			}
		}
		// Column1/Counter
		var counter = document.getElementById('f1k-showNotesCounter')
		if (counter) {
			var count = f1kat.hl.annotations.all.length
			counter.textContent = count ? ' (' + count + ')' : ''
		}
	},
	strategy: null,
	getStrategy: function () {
		if (!this.strategy) {
			// remove pending
			this.strategy = true
			// pmc reader
			this.strategy = document.body.querySelector('#jr-content [data-type="main"]') ? 'pmc' : null
			// lens reader
			if (window.location.href.indexOf('/lens/') !== -1 ||
				window.location.href.indexOf('//lens.') !== -1) {
				this.strategy = document.body.querySelector('.article.lens-article') ? 'lens' : null
			}
			// F1000 PDF
			if (F1000Global.whitelisted &&
				typeof F1000Global.whitelisted === 'string' &&
				F1000Global.whitelisted.indexOf('F1000_PDF_Viewer') !== -1) {
				this.strategy = 'F1000_PDF_Viewer'
			}
		}
		return this.strategy
	},
	select: function (e, tainted) {
		var target = e.target || e.srcElement
		if (!document.body) return;
		var id = target.dataset['f1kat_a_id']
		var strategy = handlers.notes.getStrategy()
		var finalOffset = false ? 64 : 128

		// F1000PdfViewer
		if (strategy === 'F1000_PDF_Viewer') {
			var a = f1kat.hl.annotations.getById(id)
			if (!a && false) a = f1kat.hl.annotations.current
			var validPagesInfo = (a.pagesInfo &&
				a.pagesInfo.start && a.pagesInfo.end &&
				a.pagesInfo.start !== -1 && a.pagesInfo.end !== -1)
			// console.log('tainted', tainted)
			// console.log('validPagesInfo', validPagesInfo)
			if (validPagesInfo) {
				var spans = document.body.querySelectorAll('[data-f1kat_hl_id="' + id + '"]')
				var firstSpan = spans[0]
				// console.log('firstSpan', firstSpan)
				if (firstSpan) {
					var pageEl = document.getElementById('pageContainer' + a.pagesInfo.start)
					if (!pageEl) return
					var parentOffsetEl = firstSpan
					var cumulativeOffset = 0
					for (; parentOffsetEl.parentNode && parentOffsetEl.parentNode !== pageEl;) {
						parentOffsetEl = parentOffsetEl.parentNode
						cumulativeOffset += parentOffsetEl.offsetTop
					}
					var offset = pageEl.offsetTop + pageEl.clientTop + cumulativeOffset - finalOffset
					if (isNaN(offset)) {
						// safe fallback when we could not compute an offset
						firstSpan.scrollIntoView && firstSpan.scrollIntoView()
					} else {
						pageEl.offsetParent.scrollTop = offset
					}
					handlers.notes.blink(spans)
				} else if (!tainted) {
					// console.log('else')
					pagesInfo.scrollToPage(a.pagesInfo.start, a.pagesInfo.end)
					document.addEventListener('setupAnnotationsDone', {
						originalEvent: e,
						handleEvent: function (e) {
							// console.log('setupAnnotationsDone else cb')
							document.removeEventListener('setupAnnotationsDone', this, false)
							handlers.notes.select(this.originalEvent, true)
						}
					}, false)
				}
				return
			}
			// Otherwise proceed with default error msg, without pagesInfo we have no chance to find it
		}

		// SELECT ANNOTATION
		var spans = document.body.querySelectorAll('[data-f1kat_hl_id="' + id + '"]')
		var firstSpan = spans[0]

		// 404 ANNOTATION NOT PRESENT
		if (!firstSpan) {
			// // Give it a second chance
			// if (!tainted && strategy !== 'F1000_PDF_Viewer') {
			// 	//var miss = [f1kat.hl.annotations.getById(id)]
			// 	var miss = f1kat.hl.annotations.all
			// 	// may compute real missing and be happy
			//  // this only runs on user action but still we should check rescan is not already going
			// 	if (miss) f1kat.hl.setupAnnotations(miss, function () {
			// 		handlers.notes.select(e, true)
			// 	})
			// 	return
			// }
			// // Default
			if (false) {
				WV.toast(state.showNotes.message404)
				return
			}
			var message = document.createElement('div')
			message.textContent = state.showNotes.message404
			message.className = 'f1kat-note-404'
			message.onclick = function (e) { e.stopPropagation() }
			if (target.getBoundingClientRect().height > 32) message.setAttribute('style', 'padding: 8px 75px;')
			target.appendChild(message)
			setTimeout(function () { message.parentNode.removeChild(message) }, 2500)
			return
		}

		// pmc viewer - horizontal
		if (strategy === 'pmc') {
			var content = document.body.querySelector('#jr-content')
			var article = content && content.querySelector('[data-type="main"]')
			if (article) {
				var NONSENSE_OFFSET_ADJUSTMENT = 60
				var pageWidth = parseInt(getComputedStyle(content).width.replace(/\D/g, '')) + NONSENSE_OFFSET_ADJUSTMENT
				var pageOffsetCurrent = parseInt((article.getAttribute('style') || '0').replace(/\D/g, ''))
				var hlOffset = firstSpan.getBoundingClientRect().left
				var pageIndex = parseInt((hlOffset + pageOffsetCurrent) / pageWidth)
				var pageOffset = pageIndex * pageWidth
				// scroll and blink
				var styleAttr = 'transform: translateX(' + -pageOffset + 'px);'
				article.setAttribute('style', styleAttr)
				setTimeout(function () { handlers.notes.blink(spans) }, 0)
				return
			}
		}

		// lens
		if (strategy === 'lens') {
			firstSpan.scrollIntoView()
			var addOffset = document.body.querySelector('.surface.resource-view.content')
			if (addOffset) addOffset.scrollTop -= finalOffset
			setTimeout(function () { handlers.notes.blink(spans) }, 0)
			return
		}

		// FINALLY, SCROLL AND BLINK
		_scrollTo(firstSpan, finalOffset, 250, 10, function () {
			handlers.notes.blink(spans)
		})
	},
	blink: function (spans) {
		var cssClass = 'f1kat-hl-blink'
			;[].forEach.call(spans, function (s) { s.classList.remove(cssClass) })
		requestAnimationFrame(function () {
			;[].forEach.call(spans, function (s) { s.classList.add(cssClass) })
		})
	}
}

handlers.tags = {
	close: function (e) {
		console.log("close")
		state.tags.filter = ''
		state.column = 1
		var column2 = document.querySelector('.f1kat-popupColumn.f1kat-2')
		if (column2 && column2.firstChild) column2.removeChild(column2.firstChild)
		var popupColumns = document.querySelector('#f1kat-popupColumns')
		if (popupColumns) popupColumns.classList.remove('f1kat-2')
		// var titleEl = document.getElementById('f1000-at-popup-title')
		// titleEl.textContent = getPopupHeaderTitle()
	},
	open: function (e) {
		console.log("open")
		state.column = 2
		var popupColumns = document.querySelector('#f1kat-popupColumns')
		if (popupColumns) popupColumns.classList.add('f1kat-2')
		handlers.tags.update()
		// var titleEl = document.getElementById('f1000-at-popup-title')
		// titleEl.textContent = 'Tags'
		setTimeout(function () {
			document.querySelector('#f1kat-tags-bar-input').focus()
		}, 200)
	},
	item_onclick: function (e) {
		popup.tags.put((e.target || e.srcElement).dataset.f1katTagId, false)
	},
	remove_onclick: function (e) {
		popup.tags.assign((e.target || e.srcElement).dataset.f1katTagId, false)
		handlers.tags.update()
	},
	update: function () {
		if (state.column === 2) {
			var column2 = document.querySelector('.f1kat-popupColumn.f1kat-2')
			if (column2) {
				var frag = jsonML2Dom(templates.tags(), handlers)
				var current = column2.firstChild
				if (current) {
					var caretPositionBackup = f1kat.hl.caretBackup(document.getElementById('f1kat-tags-bar-input'))
					column2.replaceChild(frag, current)
					f1kat.hl.caretBackup(document.getElementById('f1kat-tags-bar-input'), caretPositionBackup)
				} else {
					column2.appendChild(frag)
				}
				popup.dynamicStyles()
			}
		}
		// column1/referenceCard
		var rc = document.getElementById('f1kat-reference-tags-container')
		if (rc) {
			rc.replaceChild(
				jsonML2Dom(templates.references.referenceCardTags(state.tags.item), handlers),
				rc.firstChild
			)
		}
	},
	scrollIntoView: function (i) {
		var op = i.offsetParent
		var overTop = i.offsetTop < op.scrollTop
		var overBottom = i.offsetTop + i.clientHeight > op.scrollTop + op.clientHeight
		if (overTop || overBottom) {
			op.scrollTop = i.offsetTop - op.clientHeight / 2
		}
	},
	item_onmouseenter: function (e) {
		if (handlers.tags.preventNextMouseenter) {
			handlers.tags.preventNextMouseenter = false
		} else {
			var all = document.querySelectorAll('#f1000-at-popup .f1kat-tags-list-row .f1kat-tag')
			Array.prototype.forEach.call(all, function (i) { i.classList.remove('f1kat-tag-active') })
			var t = (e.target || e.srcElement).querySelector('.f1kat-tag')
			if (t) t.classList.add('f1kat-tag-active')
		}
	},
	getNextItem: function (isBackward) {
		var nextItem = null
		var activeItem = document.querySelector('#f1000-at-popup .f1kat-tags-list-row .f1kat-tag-active')
		if (!activeItem) {
			var allItems = document.querySelectorAll('#f1000-at-popup .f1kat-tags-list-row .f1kat-tag')
			if (allItems.length > 0) {
				nextItem = isBackward ?
					allItems[allItems.length - 1] :
					allItems[0]
			}
		} else {
			activeItem.classList.remove('f1kat-tag-active')
			var nextSibling = activeItem.parentNode[
				isBackward ? 'previousSibling' : 'nextSibling'
			]
			nextItem = nextSibling && nextSibling.querySelector('.f1kat-tag')
		}
		return nextItem
	},
	onkeydown: function (e) {
		var kc = e.keyCode
		var isBackward = false
		switch (kc) {
			case 38:
				isBackward = true
			case 9:
				if (e.shiftKey === true) isBackward = true
			case 40:
				e.preventDefault()
				var nextItem = handlers.tags.getNextItem(isBackward)
				if (nextItem) {
					nextItem.classList.add('f1kat-tag-active')
					handlers.tags.preventNextMouseenter = true
					handlers.tags.scrollIntoView(nextItem)
				}
				break
			case 13:
				var activeItem = document.querySelector('#f1000-at-popup .f1kat-tags-list-row .f1kat-tag-active')
				if (activeItem) {
					popup.tags.put(activeItem.parentNode.dataset.f1katTagId, true)
				}
				break
		}
	},
	filter: F1000Global.debounce(function (e) {
		state.tags.filter = (e.target || e.srcElement).value
		handlers.tags.preventNextMouseenter = true
		handlers.tags.update()
	}, (detectBrowser().browser === 'ie' || detectBrowser().browser === 'edge') ? 500 : 0),
	reset: function (e) {
		state.tags.filter = ''
		handlers.tags.update()
	}
}

handlers.integrated = {
	notesOpen: function () {
		if (!popup.active) popup.update()
		handlers.notes.open()
		popup.toggle()
	},
	tagsOpen: function () {
		state.notesUpdatePending = false
		if (!popup.active) popup.update()
		handlers.tags.open()
		popup.toggle()
	},
	highlighterMode: function (e) {
		var target = e.target || e.srcElement
		var targetSpin = (
			target &&
			target.dataset &&
			target.dataset.f1katHlSpin
		) || 'ON'
		popup.highlighter.setSpin(targetSpin)
		popup.highlighter.applySpin()
		popup.update()
	}
}
