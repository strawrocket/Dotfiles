"use strict";

function handlersBinder (el, handlersAttr, handlers) {
	var multiAttr = handlersAttr.split(';')
	for (var i = 0; i < multiAttr.length; i++) {
		var attr = multiAttr[i].trim()
		var eventHandler = attr.split('.')
		var handler = handlers
		for (var j = 1; j < eventHandler.length; j++) handler = handler[eventHandler[j]]
		el.addEventListener(eventHandler[0], handler)
	}
}

function elementCreate (elDefinition) {
	var elDefinitionArray = elDefinition.split('.')
	var elTagId = elDefinitionArray[0].split('#')
	var elTag = (elTagId[0].length === 0) ? 'DIV' : elTagId[0]
	var el = document.createElement(elTag)
	if (elTagId[1]) el.id = elTagId[1]
	var className = ''
	for (var i = 1; i < elDefinitionArray.length; i++) className += elDefinitionArray[i] + ' '
	if (className) el.className = className
	return el
}

function jsonML2Dom (markup, handlers) {
	var tag = markup[0]
	if (tag === null) return document.createComment(null)
	var el = elementCreate(tag)
	for (var i = 1, l = markup.length; i < l; i++) {
		var mNode = markup[i]
		var constructor = mNode.constructor
		if (constructor === Object)
			for (var attr in mNode)
				if (attr === '$') handlersBinder(el, mNode[attr], handlers)
				else el.setAttribute(attr, mNode[attr])
		else if (constructor === String) el.appendChild(document.createTextNode(mNode))
		else if (constructor === Array) el.appendChild(jsonML2Dom(mNode, handlers))
	}
	return el
}
