"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

//
// UI Behaviour
//
f1kat.hl.state = 'closed'

f1kat.hl.uiStateClosed = function () {
	// NOTE: don't collapse selection when closing UI otherwise text drag is prevented
	var hl = f1kat.hl
	// State
	hl.state = 'closed'
	hl.ui.className = 'f1kat-state-closed'
	// Resets
	state.highlighter.currentEditingAnnotation = null
	hl.uiEditor.querySelector('#f1kat-editor-textarea').value = ""
	hl.ui.removeAttribute('f1kat-arrow-hidden')
	if (hl.annotations.current) hl.annotations.cancel()
	// Revert any unsaved color change
	var revertColorChange = state.highlighter.revertColorChange
	if (revertColorChange) {
		var revertAnnotation = revertColorChange.annotation
		if (revertAnnotation.id) {
			var revertColor = revertColorChange.color
			revertAnnotation.color = revertColor
			hl.mutateColorClass(revertAnnotation, revertColor)
		}
		state.highlighter.revertColorChange = null
	}
	// workbench runs a pending refresh imperatively
	if (state.workbenchMode) {
		if (f1kat.annotationsRefreshPending) hl.annotations.refresh()
	}
}

f1kat.hl.uiStateAdder = function (e) {
	var hl = f1kat.hl
	if (e.which !== 1) return;
	if (!content_script.highlighterEnabled) return;
	var s = getSelection()
	if (s.isCollapsed) return;
	// Manuscript code
	if (f1kat.highlighterTarget) {
		if (f1kat.highlighterTarget === 0) return;
		var anchorValid = false
		var focusValid = false
		var browser = detectBrowser().browser
		if (browser === 'ie') {
			// ie contains works only on elements
			anchorValid = !!f1kat.highlighterTarget.contains(s.anchorNode.parentNode)
			focusValid = !!f1kat.highlighterTarget.contains(s.focusNode.parentNode)
		} else {
			anchorValid = !!f1kat.highlighterTarget.contains(s.anchorNode)
			focusValid = !!f1kat.highlighterTarget.contains(s.focusNode)
		}
		if (!anchorValid || !focusValid) return;
	}
	// Auto mode
	if (state.highlighter.auto) {
		hl.annotations.make(false)
		hl.annotations.make(true)
		return
	}
	// Ensure UI exists
	F1000Global.getUIRoot()
	// Position
	hl.uiPosition(e.pageX, e.pageY, 24)
	// State
	hl.state = 'adder'
	hl.ui.className = 'f1kat-state-adder'
	// Hack here
	hl.uiPositionCheck()
}

f1kat.hl.uiStateEditor = function (annotation, autoMode) {
	var hl = f1kat.hl
	if (!content_script.highlighterEnabled) return;
	// Set editor data and save behaviour
	hl.uiEditorSet(annotation)
	// Position
	hl.uiPosition(null, null, 280)
	// State
	hl.state = 'editor'
	hl.ui.className = 'f1kat-state-editor'
	hl.uiEditor.className = autoMode ? 'f1kat-editor-autoMode' : ''
	state.highlighter.currentEditingAnnotation = autoMode ? annotation : null
	// Tricks
	hl.uiTextareaFit()
	hl.uiEditor.querySelector('#f1kat-editor-textarea').focus()
	// Hack here
	hl.uiPositionCheck()
	// Select current color control
	var color = (annotation && annotation.color) || state.highlighter.color
	var colorControl = hl.ui.querySelector('.f1kat-editor-color-' + color)
	var allColorControls = document.getElementsByClassName('f1kat-editor-color')
	Array.prototype.forEach.call(allColorControls, function (el) {
		el.classList[el === colorControl ? 'add' : 'remove']('f1kat-editor-color-selected')
	})
	if (!state.pageObjectIds.libraryItemId) {
		var colorsTrigger = document.getElementById('f1kat-editor-color-trigger')
		if (colorsTrigger) {
			hl.mutateColorClass({ spans: [colorsTrigger] }, color)
		}
	}
}

f1kat.hl.uiStateComments = function (event) {
	var hl = f1kat.hl
	var self = event || this
	if (!content_script.highlighterEnabled) return;
	if (!getSelection().isCollapsed) return;
	if (hl.state === 'editor') return;
	var target = self.target || self.srcElement
	if (!target) return;
	// Firefox Workaround
	if (typeof self.path === "undefined") {
		self.path = f1kat.hl.parents(target)
		self.path.pop()
		self.path.reverse()
	}
	// Retrive target annotations, filtered by an omit class
	var annotations = hl.annotationsInPath(self.path, 'f1kat-hl-off')
	if (annotations.length === 0) return;
	// Auto mode
	if (state.highlighter.auto) {
		hl.uiPosition(self.pageX, self.pageY, 340)
		f1kat.hl.uiStateEditor(annotations[0], true)
		return
	}
	// Attach comments list
	hl.uiAttachCommentsList(annotations)
	// Position
	hl.uiPosition(self.pageX, self.pageY, 340)
	// State
	hl.state = 'comments'
	hl.ui.className = 'f1kat-state-comments'
	// Max Height and overflow
	hl.uiCommentsFit()
	// Hack here
	hl.uiPositionCheck()
}

f1kat.hl.uiPosition = function (x, y, overflowX) {
	var hl = f1kat.hl
	var xOffset = 16
	var yOffset = 24
	if (!x) x = parseInt(hl.ui.style.left.replace('px', '')) + xOffset
	if (!y) y = parseInt(hl.ui.style.top.replace('px', '')) - yOffset
	if ((x + overflowX) > document.body.clientWidth) x = document.body.clientWidth - overflowX
	hl.ui.style.left = x - xOffset + 'px'
	hl.ui.style.top = y + yOffset + 'px'
}

f1kat.hl.uiPositionCheck = function () {
	var hl = f1kat.hl
	// the ui
	var boundingClient = document.getElementById('f1kat-' + hl.state)
	boundingClient = boundingClient ? boundingClient.getBoundingClientRect() : { top: 0, height: 0 }
	// the browser
	var clientHeight = document.documentElement.clientHeight
	var clientOverflowY = boundingClient.top + boundingClient.height - clientHeight
	// shift position and hide arrow if out of screen
	if (clientOverflowY > -32) {
		var currentY = hl.ui.style.top.replace('px', '')
		hl.ui.style.top = currentY - clientOverflowY - 32 + 'px'
		hl.ui.setAttribute('f1kat-arrow-hidden', true)
	}
}

f1kat.hl.uiEditorGet = function () {
	var hl = f1kat.hl
	var comment = hl.uiEditor.querySelector('#f1kat-editor-textarea').value
	return {
		comment: comment.trim()
	}
}

f1kat.hl.uiEditorSet = function (annotation) {
	var hl = f1kat.hl
	content_script.collectionId()
	// Reset
	if (!annotation) {
		hl.uiEditor.querySelector('#f1kat-editor-save').dataset['f1kat_a_id'] = ""
		return;
	}
	// Set
	hl.uiEditor.querySelector('#f1kat-editor-save').dataset['f1kat_a_id'] = annotation.id
	if (annotation.text) {
		hl.uiEditor.querySelector('#f1kat-editor-textarea').value = annotation.text
	}
}

f1kat.hl.uiTextareaFit = function () {
	var hl = f1kat.hl
	var t = hl.uiEditor.querySelector('#f1kat-editor-textarea')
	var minHeight = 32
	var borderHeight = 2
	// empty
	if (t.value === "") {
		t.style.height = minHeight + 'px'
		return
	}
	// single line
	if (t.scrollHeight <= minHeight) {
		return
	}
	// multiline, auto will make it shrink automatically and update the element props
	t.style.height = 'auto'
	if (t.clientHeight < t.scrollHeight) {
		var maxHeight = window.innerHeight * .6
		var height = t.scrollHeight + borderHeight
		t.style.maxHeight = maxHeight + 'px'
		t.style.height = height + 'px'
		// makes sure we are fitting
		hl.uiPositionCheck()
		return
	}
}

f1kat.hl.uiCommentsFit = function () {
	var listEl = document.querySelector('div#f1kat-comments-list')
	var maxHeight = window.innerHeight * .6
	var listStyle = 'max-height: ' + maxHeight + 'px; overflow-y: auto;'
	listEl.setAttribute('style', listStyle)
}

//
// Event Handlers
//
f1kat.hl.handlers = {
	adder: function (e) {
		e.preventDefault()
		e.stopPropagation()
		f1kat.hl.annotations.make(false)
		f1kat.hl.uiStateEditor()
	},
	autoMode_delete: function () {
		f1kat.hl.handlers.deleteAnnotation(state.highlighter.currentEditingAnnotation, true)
	},
	autoMode_edit: function () {
		f1kat.hl.uiStateEditor(state.highlighter.currentEditingAnnotation, false)
	},
	collectionSelectTrigger: function (e) {
		content_script.save2Select(e, false)
	},
	commentsDeferred: function (e) {
		var hl = f1kat.hl
		var target = e.target || e.srcElement
		var id = target.dataset? target.dataset['f1kat_a_id'] : null
		if (!id) return;
		var annotation = hl.annotations.getById(id)
		if (!annotation) return;
		if (target.nodeName.toUpperCase() === "BUTTON") {
			if (target.className.indexOf('f1kat-comments-delete') !== -1) {
				hl.handlers.deleteAnnotation(annotation, true)
			} else if (target.className.indexOf('f1kat-comments-edit') !== -1) {
				if (state.workbenchMode && window.location.href.indexOf('/documents/') !== -1) {
					window.postMessage({ type: 'annotation-comment-edit', detail: { id: id } }, '*')
					hl.uiStateClosed()
				} else {
					hl.uiStateEditor(annotation)
				}
			}
		}
	},
	colorControlsToggle: function (e) {
		e.preventDefault()
		e.stopPropagation()
		if (state.pageObjectIds.libraryItemId) return
		var colorsContainer = document.getElementById('f1kat-editor-color-container')
		if (colorsContainer) {
			var isOpen = colorsContainer.style.display !== 'none'
			colorsContainer.style.display = isOpen ? 'none' : 'block'
			var colorsTrigger = document.getElementById('f1kat-editor-color-trigger')
			if (colorsTrigger) {
				colorsTrigger.classList[isOpen ? 'remove' : 'add']('f1kat-editor-color-trigger-close')
			}
		}
	},
	colorApply: function (e) {
		e.preventDefault()
		e.stopPropagation()
		var hl = f1kat.hl
		var target = e.target || e.srcElement
		var color = target.dataset['f1kat_color']
		if (color) {
			var autoMode = hl.uiEditor && hl.uiEditor.className && hl.uiEditor.className.indexOf('autoMode') !== -1
			var allColorControls = document.querySelectorAll('#f1kat-editor-color-container .f1kat-editor-color')
			Array.prototype.forEach.call(allColorControls, function (el) {
				el.classList[el === target ? 'add' : 'remove']('f1kat-editor-color-selected')
			})
			var saveBtn = f1kat.hl.uiEditor && f1kat.hl.uiEditor.querySelector('#f1kat-editor-save')
			var annotationId = saveBtn && saveBtn.dataset['f1kat_a_id']
			var annotation = annotationId ? hl.annotations.getById(annotationId) : hl.annotations.current
			if (!autoMode &&
				!state.highlighter.revertColorChange) {
				state.highlighter.revertColorChange = {
					annotation: annotation,
					color: annotation.color
				}
			}
			state.highlighter.color = color
			annotation.color = color
			hl.mutateColorClass(annotation, color)
			if (!state.pageObjectIds.libraryItemId) {
				var colorsTrigger = document.getElementById('f1kat-editor-color-trigger')
				if (colorsTrigger) {
					hl.mutateColorClass({ spans: [colorsTrigger] }, color)
				}
			}
			if (autoMode) {
				hl.annotations.put(annotation)
				hl.uiStateClosed()
			}
		}
	},
	deleteAnnotation: function (annotation, closeUI) {
		var hl = f1kat.hl
		if (annotation) {
			hl.annotations['delete'](annotation)
			hl.annotations.remove(annotation)
			if (closeUI) hl.uiStateClosed()
		}
	},
	editorSaveBtn: function (e) {
		e.preventDefault()
		e.stopPropagation()
		var hl = f1kat.hl
		var editorData = hl.uiEditorGet()
		if (state.workbenchMode === "manuscript" &&
			!editorData.comment) {
			return
		}
		// Commit to any color change
		state.highlighter.revertColorChange = null
		// Check temporary state to save/update
		var target = e.target || e.srcElement
		var annotationId = target.dataset['f1kat_a_id']
		if (!annotationId) {
			// Create
			hl.annotations.make(true)
			hl.uiStateClosed()
		} else {
			// Update
			var annotation = hl.annotations.getById(annotationId)
			annotation.text = editorData.comment
			hl.annotations.put(annotation)
			hl.uiStateClosed()
		}
		// voids any demoMode on save
		state.demoMode = null
	},
	stopPropagation: function (e) { e.stopPropagation() },
	uiTextareaInput: function (e) {
		f1kat.hl.uiTextareaFit(e)
	},
	uiTextareaKeydown: function (e) {
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault()
			var saveBtn = document.querySelector('#f1kat-editor-save')
			if (saveBtn && saveBtn.click) saveBtn.click()
		}
	}
}

//
// UI
//
f1kat.hl.uiAttach = function () {
	function collectionSelectTrigger() {
		return (
			['#f1kat-editor-collectionSelect-trigger.f1k-collectionSelect-trigger', { style: 'width: 176px;' },
				{ $: 'click.handlers.collectionSelectTrigger' },
				['span.f1kat-collectionIdLabel', collectionId],
				['span.f1k-collectionSelect-arrow', '▼']
			]
		)
	}

	function colorControls() {
		return (
			['#f1kat-editor-color-container', {
					style: 'display: none; position: absolute; top: 0; width: 180px; font-size: 0;',
					$: 'mouseleave.handlers.colorControlsToggle'
				},
				['.f1kat-editor-color.f1kat-editor-color-a', { 'data-f1kat_color': 'a', $: 'mousedown.handlers.colorApply' }],
				['.f1kat-editor-color.f1kat-editor-color-b', { 'data-f1kat_color': 'b', $: 'mousedown.handlers.colorApply' }],
				['.f1kat-editor-color.f1kat-editor-color-c', { 'data-f1kat_color': 'c', $: 'mousedown.handlers.colorApply' }],
				['.f1kat-editor-color.f1kat-editor-color-d', { 'data-f1kat_color': 'd', $: 'mousedown.handlers.colorApply' }],
				['.f1kat-editor-color.f1kat-editor-color-e', { 'data-f1kat_color': 'e', $: 'mousedown.handlers.colorApply' }],
				['.f1kat-editor-color.f1kat-editor-color-f', { 'data-f1kat_color': 'f', $: 'mousedown.handlers.colorApply' }]
			]
		)
	}

	function colorControlsTrigger() {
		return (
			['#f1kat-editor-color-trigger.f1kat-editor-color-e', {
				style: 'float: right;',
				$: 'mousedown.handlers.colorControlsToggle;'
			}]
		)
	}

	function autoModeControls() {
		return (
			['div#f1kat-comments-controls-autoMode.f1kat-comments-controls', {
					style: 'position: absolute; margin: -2px -1px 0 0;'
				},
				['button.f1kat-comments-edit', { title: 'Edit Annotation', $: 'click.handlers.autoMode_edit', style: 'margin-right: 1px;' },
					'Edit Annotation'
				],
				['button.f1kat-comments-delete', { title: 'Delete Annotation', $: 'click.handlers.autoMode_delete' },
					'Delete Annotation'
				]
			]
		)
	}

	var hl = f1kat.hl
	var collectionId = content_script.session.collectionId
	var workbenchMode = state.workbenchMode
	var markup = (
		['#f1kat-hl-ui.f1kat-state-closed', {
				style: 'display: none',
				$: 'keypress.handlers.stopPropagation; mousedown.handlers.stopPropagation; mouseup.handlers.stopPropagation'
			},
			['#f1kat-adder', { $: 'mousedown.handlers.adder' },
				['.f1kat-img-editor-arrow', { style: 'position: absolute; width: 10px; height: 6px; top: -9px; left: 9px;' }],
				['div', { style: 'float: left; height: 22px; font-size: 0px;' },
					['button#f1kat-adder-addNote', { style: 'position: relative' },
						['span#f1kat-adder-addNote-F.f1kat-img-F-8x12' ]
					]
				]
			],
			['#f1kat-editor',
				['.f1kat-img-editor-arrow', { style: 'position: absolute; width: 10px; height: 6px; top: -9px; left: 9px;' }],
				['textarea#f1kat-editor-textarea', {
					spellcheck: 'true',
					placeholder: workbenchMode ? 'Please add a note...' : 'Add an optional note...',
					style: 'height: 31px;',
					$: 'input.handlers.uiTextareaInput; keydown.handlers.uiTextareaKeydown;'
				}],
				['#f1kat-editor-controls', { style: 'position: relative; display: flex;' },
					['div', { style: 'width: 210px; min-height: 26px;' },
						collectionSelectTrigger(),
						colorControls(),
						colorControlsTrigger(),
						autoModeControls()
					],
					['#f1kat-editor-save-container', { style: 'width: 58px;' },
						['button#f1kat-editor-save.f1k-ty-btn-caps', {
								style: 'float: right; width: 100%; text-align: center;',
								'data-f1kat_a_id': '',
								$: 'click.handlers.editorSaveBtn'
							},
							'SAVE'
						]
					]
				]
			],
			['#f1kat-comments', { style: 'width: 340px;', $: 'click.handlers.commentsDeferred' },
				['.f1kat-img-comments-arrow', { style:'position: absolute; width: 10px; height: 6px; top: -9px; left: 9px;' }],
				['#f1kat-comments-list']
			]
		]
	)
	// DOM
	var frag = jsonML2Dom(markup, hl)
	hl.ui = frag
	hl.uiEditor = frag.querySelector('#f1kat-editor')
	hl.uiCommentsListEl = frag.querySelector('#f1kat-comments-list')
	// Attach
	F1000Global.getUIRoot().appendChild(hl.ui)
	// Global Page Events
	document.addEventListener('mousedown', hl.uiStateClosed)
	document.addEventListener('mouseup', hl.uiStateAdder)
	// Done
	hl.uiReady = true
}

f1kat.hl.uiAttachCommentsList = function (annotations) {
	function annotationText (a) {
		return a.text ?
			['div', { style: "max-width: 84%; white-space: pre-wrap; word-wrap: break-word; font-size: 14px; line-height: 18px; color: #333;" },
				a.text
			] :
			['div', { style: 'padding: 4px;' }]
	}

	function annotationCreated (a) {
		var timestampf = f1kat.hl.timestampf
		return a.created ?
			['span', { style: 'line-height: 14px; font-size: 12px !important; font-weight: initial; color: inherit; font-style: italic;' },
				' ' + timestampf(a.created)
			] :
			[null]
	}

	function comment (a) {
		var isAuthorGuest = a.author && (a.author.id !== content_script.session.user.id)
		var author = isAuthorGuest ? a.author.firstName + " " + a.author.lastName : "You"
		var link = getwbURL() + '/work/#/items/' + a.libraryItemId
		var workbenchMode = state.workbenchMode
		return (
			['div', { 'class': isAuthorGuest ? 'f1kat-comments-item f1kat-a-guest' : 'f1kat-comments-item' },
				['span.f1kat-comments-controls',
					['button.f1kat-comments-edit',
						{ title: "Edit Annotation", "data-f1kat_a_id": a.id },
						'Edit Annotation'
					],
					['button.f1kat-comments-delete',
						{ title: "Delete Annotation", "data-f1kat_a_id": a.id },
						'Delete Annotation'
					]
				],
				annotationText(a),
				['div', { style: 'padding-top: 0px; padding-bottm: 4px;' },
					[workbenchMode ? 'span' : 'a.f1kat-a-tomato', {
							href: link,
							rel: "noreferrer",
							target: "_blank",
							style: (workbenchMode ? 'cursor: default !important; ' : '') + "text-decoration: none; line-height: 14px; font-size: 12px !important; font-weight: initial; color: inherit; font-style: italic;"
						},
						'Saved by ', author, annotationCreated(a)
					]
				]
			]
		)
	}

	var hl = f1kat.hl
	var markup = ['div#f1kat-comments-list'].concat(annotations.map(comment))
	// events are driven by data-attrs and listened at container ui
	var frag = jsonML2Dom(markup)
	hl.uiCommentsListEl.parentNode.replaceChild(frag, hl.uiCommentsListEl)
	hl.uiCommentsListEl = frag
}
