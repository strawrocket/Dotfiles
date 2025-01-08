"use strict";
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

var templates = {}

templates.utils = {
	ellipsed: function (string, limit) {
		return limit > 0 && string.length > limit ?
			string.substr(0, limit) + '...' :
			string
	},
	escape: function (string) {
		var buffer = document.createElement('div')
		buffer.innerHTML = string
		return typeof buffer.textContent !== 'undefined' ?
			buffer.textContent :
			butter.innerText
	},
	encodeURIComponent: function (str) {
		try {
			var encoded = encodeURIComponent(str)
			return encoded
		} catch (e) {
			console.log('F1000Annotator: Could not encode URI component', e)
			return str
		}
	}
}

function getPopupHeaderTitle() {
	var popupTitle = ""
	if (state.session.user) {
		// Always
		if (state.pageObjectIds && !F1000Global.blacklisted) {
			popupTitle = "Web Page"
			if (state.pageObjectIds.dominant.type !== "PageTitle") {
				popupTitle = "Article"
			}
			if (state.pageObjectIds.list.length > 0) {
				popupTitle += " and Citations"
				if (state.pageObjectIds.pageType === "REFERENCES") {
					popupTitle = state.pageObjectIds.list.length + " References Found"
				}
			}
		}
		// PDFs overrides
		if (F1000Global.whitelisted && F1000Global.whitelisted.indexOf('PDF_Viewer') !== -1)
			popupTitle = "PDF"
		if (F1000Global.embeddedPluginOnlyPage) {
			if (state.pageObjectIds &&
				state.pageObjectIds.dominant.type !== "PageTitle") {
				popupTitle = "PDF Article"
			} else {
				popupTitle = "PDF Document"
			}
		}
		// Workbench overrides
		if (state.workbenchMode) {
			if (state.workbenchMode === 'off') popupTitle = ''
			if (state.workbenchMode === 'manuscript') popupTitle = 'Draft Document'
			if (state.workbenchMode === 'itemDetail') popupTitle = 'Article Abstract'
		}
	}
	return popupTitle
}

templates.popup = function () {
	// Modal Layer
	var r = ['div#f1000-at-popup-modal-layer',
		{ $: 'mousedown.popup.toggle; mousedown.stopPropagation; mouseup.stopPropagation' }
	]
	// Popup
	if (!state.session.user) {
		return r.concat([
			['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
				templates.header(),
				templates.login()
			]
		])
	} else if (F1000Global.blacklisted) {
		// Blacklisted
		return r.concat([
			['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
				templates.header(true),
				templates.blacklisted(),
				templates.menu()
			]
		])
	} else if (state.workbenchMode && state.workbenchMode === 'off') {
		// Blacklisted Workspace
		return r.concat([
			['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
				templates.header(true),
				templates.blacklisted(),
				templates.menu()
			]
		])
	} else if (state.workbenchMode && state.workbenchMode !== 'off') {
		// Workbench
		return r.concat([
			['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
				templates.header(true),
				templates.workbenchMode(),
				templates.menu()
			]
		])
	} else if (F1000Global.embeddedPluginOnlyPage && DA4pdf && !DA.ready) {
		// DAmessage
		return r.concat([
			['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
				templates.header(true),
				templates.DAmessage(),
				templates.menu()
			]
		])
	} else {
		if (state.pageObjectIds) {
			// Default
			return r.concat([
				['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
					templates.header(true),
					['div#f1kat-popupColumns.c',
						['div.f1kat-popupColumn.f1kat-1',
							templates.references.root(),
							templates.save2()
						],
						['div.f1kat-popupColumn.f1kat-2']
					],
					['div#f1kat-preventInteraction',
						templates.spinner()
					],
					templates.highlighter(),
					templates.menu()
				]
			])
		} else {
			return r.concat([
				['div#f1000-at-popup', { $: 'click.stopPropagation; mousedown.stopPropagation' },
					templates.header(true),
					templates.spinner()
				]
			])
		}
	}
}

templates.blacklisted = function () {
	function msg() {
		if (F1000Global.locationGuess === "workbench") {
			return (
				['div.c.module', { style: 'padding: 24px 16px 24px 16px' },
					['div.l',
						['img', { src: 'https://sciwheel.com/annotator/assets' + '/images/web_icon.png', style: 'margin: 8px;' }]
					],
					['div.r', { style: "color: #333333; line-height: 21px; width: 77%;" },
						['div', { style: "font-size: 20px" }, 'Find an article to get started'],
						['div.spacerV16'],
						['div', { style: "line-height: 21px" }, 'Use the Sciwheel extension to import references and to add notes to articles on the web.'],
						['div', { style: "line-height: 21px" }, 'It works on all webpages and online PDFs.'],
						['div.spacerV16']
					]
				]
			)
		} else {
			return (
				['div.c.module', { style: 'padding: 24px 16px 24px 16px' },
					['div.l',
						['img', { src: 'https://sciwheel.com/annotator/assets' + '/images/web_icon.png', style: 'margin: 8px;' }]
					],
					['div.r', { style: "color: #333333; line-height: 21px; width: 77%;" },
						['div', { style: "line-height: 21px" }, 'Sciwheel extension is not supported on this page.'],
						['div.spacerV16'],
						['div', { style: "line-height: 21px" }, 'Follow a link in this page to annotate or to import references to Sciwheel.'],
						['div.spacerV16'],
						['div', { style: "line-height: 21px" }, 'Alternatively, you can perform the search in PubMed or Google Scholar.'],
						['div.spacerV16']
					]
				]
			)
		}
	}

	return (
		['span',
			msg(),
			['div.highlighter.c.module', { style: 'height: 52px; line-height: 52px; padding: 5px 16px 0 16px;' },
				['a.f1k-openInF1000.f1k-inheritTextStyle', {
					href: 'http://www.ncbi.nlm.nih.gov/pubmed',
					rel: 'noreferrer',
					target: '_blank'
				},
					['div.l.cp.f1kat-hover-active-link', { style: 'padding: 10px 0px 8px 0px; line-height: 18px; font-size: 14px; margin-right: 16px;' },
						['div.l.f1kat-img-newtab.f1kat-activable-icon', { style: 'margin-right: 8px;' }],
						'PubMed'
					]
				],
				['a.f1k-openInF1000.f1k-inheritTextStyle', {
					href: 'https://scholar.google.com/',
					rel: 'noreferrer',
					target: '_blank'
				},
					['div.l.cp.f1kat-hover-active-link', { style: 'padding: 10px 0px 8px 0px; line-height: 18px; font-size: 14px; margin-right: 16px;' },
						['div.l.f1kat-img-newtab.f1kat-activable-icon', { style: 'margin-right: 8px;' }],
						'G Scholar'
					]
				],
				['a', { href: getwbURL() + '/work/faq/annotator/', target: '_blank' },
					['div.r.cp.f1kat-hover-active-link', { style: 'position: absolute; right: 16px; top: 14px;' },
						['div.f1kat-img-help.f1kat-activable-icon']
					]
				],
				['div.c']
			]
		]
	)
}

templates.DAmessage = function () {
	if (DA.instanciated) {
		// expired pdfs are not handled by now by the desktop app
		if (F1000Global.PDFPrefetchData === 'PENDING') {
			return (
				['div', { style: 'color: black; padding: 24px 24px; line-height: 24px;' },
					'Sorry, your access to this PDF seems to be expired, please ',
					['span', { style: 'font-weight: bold; font-style: italic;' },
						'reload it and try again.'
					]
				]
			)
		} else {
			if (DA.supported === false) {
				return (
					['div', { style: 'color: #333333; padding: 24px 32px; text-align: center; line-height: 24px;' },
						'Sciwheel Desktop application not up-to-date.',
						['div', { style: 'font-weight: bold; margin: 10px 0; text-align: center; line-height: 24px;' },
							'Please download the latest version from here, update it and try again.'
						],
						['a', {
							style: 'margin: 16px; text-decoration: none;',
							href: getwbURL() + '/work/#/guide/write',
							target: '_blank'
						},
							['button', { style: "margin: 8px; padding: 21px 23px; font-size: 13px; line-height: 1px;" },
								'UPDATE SCIWHEEL APP'
							]
						]
					]
				)
			} else {
				return (
					['div', { style: 'padding: 24px 16px; text-align: center' },
						['div', { style: "color: black; text-align: center; line-height: 21px; font-size: 18px; font-weight: bold;" },
							'Open PDF in Sciwheel to annotate'
						],
						['div', { style: "color: black; text-align: center; line-height: 21px; font-weight: bold; font-size: 13px; padding: 12px;" },
							'Would you like to add PDFs to Sciwheel from your browser with one-click?'
						],
						['a', {
							style: 'text-decoration: none;',
							href: getwbURL() + '/work/#/guide/write',
							target: '_blank'
						},
							['button', { style: "margin: 8px; padding: 21px 23px; font-size: 13px; line-height: 1px;" },
								'INSTALL SCIWHEEL APP'
							]
						],
						['div', { style: "color: black; text-align: center; line-height: 21px; padding: 12px;" },
							'By clicking ',
							['span', { style: 'font-weight: bold' },
								'\'Install Sciwheel App\''
							],
							' you are agreeing to our ',
							['a.cp', { href: getwbURL() + "/work/legal/download-installation-terms-and-conditions", target: "_blank" },
								'terms & conditions'
							]
						],
						['div', { style: "color: black; text-align: center; line-height: 21px; font-size: 12px;" },
							'Already installed it? ',
							['a.cp', { $: 'click.DA.start' },
								'Start application'
							],
							' | ',
							'Not working? ',
							['a.cp', { href: getwbURL() + "/work/faq/importing-references", target: "_blank" },
								'Get Help'
							]
						]
					]
				)
			}
		}
	} else {
		DA.connect()
		return (
			['div', { style: 'padding: 28px 0px 24px 0px' },
				['div#f1kat-preventInteraction', { style: 'display: block; position: relative; margin: 36px 0px;' },
					templates.spinner()
				],
				['div', { style: "color: black; text-align: center; line-height: 21px; font-size: 16px;" },
					'Connecting to Sciwheel App'
				]
			]
		)
	}
}

templates.workbenchMode = function () {
	function howTo() {
		return state.workbenchMode !== 'itemDetail' ?
			['div.cd', { style: 'font-weight: normal; margin-top: 16px; padding: 8px; background: #eee; color: #666' },
				['div',
					['span.f1kat-li-bullet', '1'],
					'Highlight the text to add your comments.'
				],
				['div',
					['span.f1kat-li-bullet', '2'],
					'Select highlighted text to read others comments.'
				]
			] :
			[null]
	}

	var dominant = state.pageObjectIds.dominant
	if (typeof dominant.pageTitleEscaped === 'undefined') {
		dominant.pageTitleEscaped = templates.utils.escape(dominant.pageTitle)
	}

	return (
		['span',
			templates.references.referenceCard({
				articleId: null,
				libraryItemId: null,
				outerStyle: 'margin: 16px 0px;',
				pageTitle: dominant.pageTitleEscaped,
				showNotesCount: -1,
				titleEllipsing: -1
			}),
			howTo(),
			templates.highlighter()
		]
	)
}

templates.menu = function () {
	function item(label, link, isPrime) {
		var base = isPrime ? 'https://facultyopinions.com' : getwbURL()
		var href = base + link
		return (
			['a.f1k-openInF1000.f1k-inheritTextStyle', {
				href: href,
				rel: 'noreferrer',
				target: '_blank'
			},
				['div.l.cp.f1kat-menu-item.f1kat-hover-active-link',
					['div.l.f1kat-img-newtab.f1kat-activable-icon', { style: 'margin-right: 8px;' }],
					label
				]
			]
		)
	}

	function recommendationsToggle() {
		var inputAttributes = { $: 'change.recommendations.toggle', type: 'checkbox' }
		if (state.session.preferences.showRecommendations) {
			inputAttributes.checked = 'checked'
		}
		var checkbox = (
			['label.cp.noselect',
				['input#all.f1k-checkbox', inputAttributes],
				['span.f1k-checkbox', { style: 'position: absolute; margin: 0px 0px 0px 0px;' }],
				['div.noselect', { title: 'Select All', style: 'position: relative; line-height: 21px; padding: 0px 0px 0px 26px;' },
					'SHOW RECOMMENDED ARTICLES'
				]
			]
		)
		return (
			['div.l.cp.f1kat-menu-item.f1kat-hover-active-link',
				checkbox
			]
		)
	}

	var isPrimeContributor = state.session &&
		state.session.user &&
		state.session.user.primeContributor

	var r = (
		['div#f1000-at-popup-menu-backdrop.f1kat-menu-backdrop-in', {
			$: 'click.popup.closeMenu'
		},
			['div#f1000-at-popup-menu.f1kat-menu-in', {
				$: 'click.stopPropagation; mousedown.stopPropagation',
				style: 'overflow-y: auto; padding-bottom: 10px;'
			},
				['div.f1k-img-X-dark.hover08.r.cp', {
					$: 'click.popup.closeMenu',
					style: 'position: absolute; right: 16px; top: 16px;'
				}],
				['div.f1kat-menu-section',
					['div.f1kat-menu-header.cd', 'Recommendations'],
					recommendationsToggle(),
					isPrimeContributor
						? ['span'
							, item('COMPOSE RECOMMENDATION', '/prime/contributor/article/search', true)
							, item('VIEW DRAFTS', '/prime/my/evaluations/draft', true)
						] : [null]
				],
				['div.f1kat-menu-section',
					['div.f1kat-menu-header.cd', 'My References']
					, item('DASHBOARD', '/work/#/dashboard')
					, item('ALL REFERENCES', '/work/#/items')
					// ,item('MY FEEDS', 'work/#/rss-feed/')
				],
				['div.f1kat-menu-section',
					['div.f1kat-menu-header.cd', 'User Session'],
					['div.l.cp.f1kat-menu-item.f1kat-hover-active-link', {
						$: 'click.login.logout'
					},
						'LOGOUT'
					]
				]
			]
		]
	)

	return r
}

templates.header = function (isDefaultPopup) {
	var showUserMenu = isDefaultPopup && state.session.user && !F1000Global.userLocked
	return (
		['div.header.c', { style: 'height: 37px;' },
			['a.l', {
				href: getwbURL() + '/work/',
				rel: 'noreferrer',
				target: '_blank',
				style: 'text-decoration: none; margin-left: 10px'
			},
				['span#f1000-at-popup-logo.f1k-img-logo-116x30.cp', 'Sciwheel']
			],
			showUserMenu
				? ['.f1kat-img-three-dots.hover08.r.cp', {
					style: 'margin: 10px 0 0 0; padding: 0 21px;',
					$: 'click.popup.openMenu'
				}] : [null]
		]
	)
}

// NOTE: not in use
templates.noCookies = function () {
	return (
		['div', { style: 'text-align: center; padding: 24px; color: black; line-height: 21px' },
			'You must enable third-party cookies to use the Sciwheel browser extension.',
			['div.spacerV10'],
			'To enable them, please follow the instructions from the ',
			['a', { href: getwbURL() + "/work/troubleshooting/browser-extension", target: "_blank" },
				'Troubleshooting Guide'
			],
			', then reload this page.'
		]
	)
}

// NOTE: Old on page login - deprecated
// templates.login = function() {
// 	var o = state.login
// 	o.rememberMePreferenceAttr = o.rememberMePreference ? { checked: true } : {}
// 	return o.betaRestriction ?
// 		['div.login.c', { style: "width: 70%; margin-left: auto; margin-right: auto; text-align: center; color: black; font-size: 16px; line-height: 26px;" },
// 			['div.spacerV16'],
// 			'We are sorry but the Sciwheel extension is currently in private beta.',
// 			['div.spacerV16'],
// 			['a', { href: getwbURL() + "/work/", target: "_blank" },
// 				['button', 'Get More Info']
// 			],
// 			['div.spacerV16'],
// 			['a#f1k-betaInvitation-tryAgain', {
// 					href: "javascript:void(0);",
// 					$: 'click.login.betaTryAgain'
// 				},
// 				'Try Again?'
// 			],
// 			['div.spacerV16']
// 		] :
// 		['div.login.c',
// 			['div', { style: "margin: 16px 16px;" },
// 				['div.f1k-ty-heading', 'Sign In', { style: 'font-size: 18px;' }],
// 				['div.spacerV16'],
// 				['div.l', { style: 'width: 55%;' },
// 					['form#f1000-internalLogin', { 'class': (o.tainted ? 'tainted' : ''), action: "javascript:void(0);" },
// 						['input.w100p', { type: "text", name: "j_username", placeholder: "Email Address", style: "height: 38px; padding: 5px 10px;" }],
// 						['div.spacerV8'],
// 						['input.w100p', { type: "password", name: "j_password", placeholder: "Password", style: "height: 38px; padding: 5px 10px;" }],
// 						['div#loginErrorMessage.l.button-height.cd.dn', { style: "position: absolute; top: 2px; left: 110px; font-style: italic; color: white; font-size: 12px; font-weight: bold; margin-left: 12px;" },
// 							'Incorrect Username or Password'
// 						],
// 						['div.spacerV8'],
// 						['label.cp.f1k-ty-bodyBold.noselect', { "for": "f1k-rememberme", style: "font-weight: normal; line-height: 21px;" },
// 							['input#f1k-rememberme.f1k-checkbox', {
// 								type: "checkbox",
// 								name: "f1k-rememberme"
// 							}, o.rememberMePreferenceAttr],
// 							['span.f1k-checkbox', { style: 'margin: 2px 16px 0px 0px;' }],
// 							'remember me'
// 						],
// 						['div.spacerV16'],
// 						['button#submit.f1k-ty-btn-caps.l', { value: "Sign In", $: 'click.login.login' }, 'Sign In']
// 					],
// 				],
// 				['div#federatedLogin.r', { style: "width: 45%; padding: 0 0 0 24px" },
// 					['form.oauth', { target: "_blank" },
// 						['input#openid-target-field', { type: "hidden", name: "target", value: "" }],
// 						['input', { type: "hidden", name: "_spring_security_oauth_remember_me", value: "true" }],
// 						['input#system', { type: "hidden", name: "system", value: "" }],
// 						['button#f1k-googleSignIn.oauth.w100p.f1k-ty-btn-caps', { $: 'click.login.loginFederated', value: "GOOGLE" }, 'Google'],
// 						['div.spacerV8'],
// 						['button#f1k-facebookSignIn.oauth.w100p.f1k-ty-btn-caps', { $: 'click.login.loginFederated', value: "FACEBOOK" }, 'Facebook'],
// 					]
// 				],
// 				['div.c']
// 			],
// 			['div', { style: 'padding: 0 16px; line-height: 52px; border-top: 1px solid lightgrey' },
// 				['a.l', {
// 					href: getwbURL() + "/work/forgotten_password",
// 					target: "_blank",
// 					style: "font-weight: normal;"
// 				}, 'Forgot Password?'],
// 				['div.l', { style: 'border-left: 1px solid rgb(199, 205, 214); margin: 16px 16px 0px 16px; height: 16px;' } ],
// 				['a.l', {
// 					href: 'https://sciwheel.com/',
// 					target: "_blank",
// 					style: "font-weight: normal;"
// 				}, 'Create Account']
// 			]
// 		]
// }

templates.login = function () {
	var loginPageUrl = getwbURL() + '/work/signin'
	return (
		['div.login.c',
			['div', { style: "margin: 16px 16px;" },
				['div.f1k-ty-heading', 'Sign In', { style: 'font-size: 18px;' }],
				['div', { style: "display: flex; flex-direction: column; align-items: center; padding: 32px;" },
					['div', {
						style: 'color: rgba(0, 0, 0, .54); font-size: 14px; font-family: Arial; line-height: 21px; text-align: center;'
					},
						"You are currently logged out of your Sciwheel, please sign in to use the extension."
					],
					['div.spacerV16'],
					['div.spacerV16'],
					['a', {
						href: loginPageUrl,
						target: '_blank',
						rel: 'noreferrer'
					},
						['button#sciwheel-login-button.f1k-ty-btn-caps.l', {
							value: "Sign In",
						}, 'Sign In With Sciwheel']
					]
				]
			]
		]
	)
}

templates.references = {}
templates.references.root = function () {
	if (F1000Global.pageNotAnnotable) return [null];
	if (state.pageObjectIds && state.pageObjectIds.list.length) {
		if (state.pageObjectIds.pageType === 'REFERENCES') {
			state.references.resolving = false
			var isResolved = !F1000Global.whitelist_forceReferencesResolve &&
				state.pageObjectIds.list[0].resolved
			if (isResolved) {
				return this.list()
			}
			popup.references.resolve()
			return this.resolving()
		} else if (state.pageObjectIds.pageType === 'ARTICLE') {
			return this.single()
		}
	}
	state.references.resolving = false
	return this.single()
}
templates.references.resolving = function () {
	return ['div.cd.f1k-ty-bodyReference', { style: 'margin: 16px 16px;' },
		['b', 'Loading Articles...']
	]
}
templates.references.referenceCardTags = function (arr) {
	function tag(i) { return ['div.f1kat-tag', i.name] }

	return Array.isArray(arr) && arr.length > 0
		? ['div#f1kat-reference-tags'].concat(arr.map(tag))
		: [null]
}
templates.references.referenceCard = function (d) {
	/* Props - all mandatory
		d Object {
			libraryItemId: F1000 Workspace item id | falsy to hide,
			outerStyle: String,
			pageTitle: String,
			titleEllipsing: Number | -1 to avoid
		}
	*/

	var isSaved = d.libraryItemId

	return (
		['div.reference.f1k-ty-bodyReference', { style: d.outerStyle },
			['div.f1k-reference-box', { style: 'margin: 0px 16px 0px 16px; overflow: hidden;' },
				['div.f1kat-img-tick', { style: 'position: absolute; margin: 13px 0px 0px 13px;' }],
				['div.f1kat-test-title', {
					title: d.titleEllipsing > 0 ? d.pageTitle : '',
					style: 'word-break: break-word; position: relative; padding: 10px 10px 10px 43px; line-height: 21px'
				},
					templates.utils.ellipsed(d.pageTitle, d.titleEllipsing)
				],
				isSaved ?
					['div',
						['a.f1k-openInF1000.f1k-inheritTextStyle', {
							href: getwbURL() + '/work/#/items/' + d.libraryItemId,
							rel: 'noreferrer',
							target: '_blank'
						},
							['div.f1kat-test-open-in-f1000.r.cp.f1kat-hover-active-link.f1k-ty-underline',
								{ style: 'padding: 0px 0px 10px 0px; line-height: 20px; font-size: 14px; margin-right: 16px;' },
								'View in my library',
								['div.r.f1kat-img-newtab.f1kat-activable-icon', { style: 'margin-left: 8px;' }]
							]
						]
					] : [null]
			]
		]
	)
}
templates.references.singleSavedControlsCitedArticlesList = function () {
	var o = state.pageObjectIds
	var hasCitedArticles = !!o.list.length
	if (hasCitedArticles && !F1000Global.embeddedPluginOnlyPage) {
		return (
			['div.f1kat-popup-showcitedarticles-list',
				{ style: state.references.showCitedArticles ? 'display: block' : 'display: none' },
				o.list[0].resolved
					? this.list(true)
					: ['div.c.references.f1k-ty-bodyReference',
						{ style: 'margin: 0px 16px 16px 16px;' },
						'Loading Articles...'
					]
			]
		)
	} else if (state.citedArticlesEmpty) {
		return (
			['div.f1kat-popup-showcitedarticles-list',
				['div.references.c.module', { style: 'padding: 16px 16px 16px 16px' },
					['div', {
						style: 'color: rgba(0, 0, 0, .54); font-size: 14px; font-family: Arial;'
					},
						"No articles found on this page"
					],
					['div.cp', {
						$: 'click.references.showCitedArticles',
						style: 'color: rgb(0, 172, 193); font-size: 14px; font-family: Arial; margin: 15px 0px'
					},
						"DISMISS THIS MESSAGE"
					]
				]
			]
		)
	} else {
		return [null]
	}
}
templates.references.singleSavedControls = function (d) {
	// var isSaved = d.libraryItemId
	var isShowNotesAllowed = d.showNotesCount >= 0
	var isTaggingAllowed = typeof d.tags !== 'undefined'
	var hasCitedArticles = d.hasCitedArticles
	var r = (
		['div', { style: 'border-top: 1px solid rgb(210, 217, 227);' },
			// Message
			['div', { style: 'padding: 16px; overflow: hidden;' },
				['div', { style: 'margin: 10px 10px 10px 0' },
					['span#f1000-at-workspace-logo.f1k-img-logo-workspace.cd', 'Sciwheel Workspace']
				],
				['div',
					['div.l.f1k-ty-bodyBold', 'This article is added to your library'],
					['a.f1k-openInF1000.f1k-inheritTextStyle', {
						href: getwbURL() + '/work/#/items/' + d.libraryItemId,
						rel: 'noreferrer',
						target: '_blank'
					},
						['div.f1kat-test-open-in-f1000.l.cp.f1kat-hover-active-link.f1k-ty-underline',
							{ style: 'line-height: 21px; font-size: 14px; margin-left: 10px;' },
							'View in my library',
							['div.r.f1kat-img-newtab.f1kat-activable-icon', { style: 'margin-left: 8px;' }]
						]
					]
				]
			],
			isTaggingAllowed
				? ['div#f1kat-reference-tags-container',
					templates.references.referenceCardTags(d.tags)
				] : [null],
			// Controls
			['div', { style: 'padding: 10px 16px 16px 16px; overflow: hidden;' },
				// cited articles
				hasCitedArticles
					? ['div.cp.f1kat-cited-control.f1kat-cited-show.f1kat-activable-icon', {
						$: 'click.references.showCitedArticles',
						// the position relative workaround old safari translated3d composition/animation bug
						style: 'display: inline-block; margin: 0px 0px; position: relative'
					},
						// arrow
						[state.references.showCitedArticles ?
							'div.l.f1kat-img-cited-arrow' :
							'div.l.f1kat-img-cited-arrow.f1kat-img-cited-arrow-down',
						{ style: 'display: inline-block; cursor: pointer; margin-right: 8px;' }
						],
						// label
						['div.l.f1kat-popup-showcitedarticles-btn', { style: 'line-height: 20px; font-size: 13px; font-family: Arial;' },
							state.references.showCitedArticles ? 'HIDE CITED ARTICLES' : 'SHOW CITED ARTICLES'
						],
					] : [null],
				// tags
				isTaggingAllowed ?
					['div.f1kat-test-tags-show.r.cp.f1kat-hover-active-link',
						{ $: 'click.tags.open', style: 'display: inline-block; line-height: 20px; font-size: 13px; margin-right: 4px; font-family: Arial;' },
						['div.l.f1kat-img-tags.f1kat-activable-icon', { style: 'margin-right: 8px;' }],
						'TAGS'
					] :
					[null],
				// show notes
				isShowNotesAllowed ?
					['div.f1kat-test-notes-show.r.cp.f1kat-hover-active-link',
						{ $: 'click.notes.open', style: 'display: inline-block; line-height: 20px; font-size: 13px; margin-right: 20px; font-family: Arial;' },
						['div.l.f1kat-img-notes.f1kat-activable-icon', { style: 'margin-right: 8px;' }],
						'NOTES',
						['span#f1k-showNotesCounter', d.showNotesCount ? ' (' + d.showNotesCount + ')' : '']
					] :
					[null],
			],
			// cited articles list
			this.singleSavedControlsCitedArticlesList()
		]
	)

	return r
}
templates.primeModule = function () {
	var actions = {
		start: function () {
			var target
			if (info.articleId) {
				target = '/prime/contributor/article/search/byid?type=PrimeArticleId&id=' +
					info.articleId
			} else if (dominant.type === 'DigitalObjectId') {
				target = '/prime/contributor/article/search/byid?type=DigitalObjectId&id=' +
					templates.utils.encodeURIComponent(dominant.id)
			} else if (dominant.type === 'PubMedId') {
				target = '/prime/contributor/article/search/byid?type=PubMedId&id=' +
					dominant.id
			} else {
				target = '/prime/contributor/article/search?metadata=' +
					contribution.encodedDominant
			}
			return (
				['div', { style: 'margin: 10px 0 10px 0;' },
					['a.f1k-inheritTextStyle.f1k-ty-decoration-none.hover08', {
						href: getwbURL() + target,
						rel: 'noreferrer',
						target: '_blank'
					},
						['button.f1k-ty-btn-caps', { style: 'background: #cb2c2d; text-decoration: none;' },
							'Recommend this article'
						]
					]
				]
			)
		},
		continue: function () {
			var target = '/prime/contributor/evaluate/article/' + info.articleId
			return (
				['div', { style: 'margin: 10px 0 10px 0;' },
					['div.f1k-ty-bodyBold', { style: 'margin: 0 0 10px 0;' },
						'This article is currently in your drafts'
					],
					['a.f1k-inheritTextStyle.f1k-ty-decoration-none.hover08', {
						href: getwbURL() + target,
						rel: 'noreferrer',
						target: '_blank'
					},
						['button.f1k-ty-btn-caps', { style: 'background: #cb2c2d' },
							'Continue recommending'
						]
					]
				]
			)
		},
		view: function () {
			var target = '/prime/contributor/evaluate/article/' + info.articleId
			return (
				['div', { style: 'margin: 10px 0 20px 0; overflow: hidden;' },
					['div.f1k-ty-bodyBold', { style: 'margin: 0 0 10px 0;' },
						'You have recommended this article'
					],
					['a.f1k-inheritTextStyle.hover08', {
						href: getwbURL() + target,
						rel: 'noreferrer',
						target: '_blank'
					},
						['div.f1kat-test-open-in-f1000.cp.f1kat-hover-active-link',
							['div.l.f1k-ty-underline.f1k-ty-prime-red', 'View recommendation'],
							['div.l.f1kat-img-newtab-prime-red.f1kat-activable-icon', { style: 'margin-left: 8px;' }]
						]
					]
				]
			)
		}
	}

	var dominant = state.pageObjectIds.dominant
	var contribution = state.primeContribution
	var info = contribution.info
	var status = {
		OTHER: 'start',
		NONE: 'start',
		DRAFT: 'continue',
		SUBMITTED: 'view',
		IN_EDITING: 'view',
		QUERIED: 'view,',
		APPROVED: 'view'
	}[info.recommendationStatus] || 'start'
	var action = actions[status]
	var numberOfDrafts = info.numberOfDrafts
	var draftsMessage = numberOfDrafts === 1
		? 'You have ' + numberOfDrafts + ' recommendation in draft'
		: 'You have ' + numberOfDrafts + ' recommendations in draft'
	var show = !state.references.showCitedArticles
	var display = show ? 'display: block;' : 'display: none;'

	var r = (
		['div#f1kat-popup-prime-module-container', { style: 'overflow: hidden; border-top: 1px solid rgb(210, 217, 227);' },
			['div#f1kat-popup-prime-module', { style: display },
				['div', { style: 'padding: 16px' },
					['div', { style: 'margin: 10px 10px 15px 0px;' },
						['span#f1000-at-prime-logo.f1k-img-logo-prime.cd', 'Faculty Opinions']
					],
					action(),
					numberOfDrafts
						? ['div.f1k-ty-bodyBold',
							draftsMessage,
							['a.f1k-openInF1000.f1k-inheritTextStyle.f1k-ty-underline.f1k-ty-prime-red.hover08', {
								href: getwbURL() + '/prime/my/evaluations/draft',
								rel: 'noreferrer',
								target: '_blank',
								style: 'margin-left: 10px'
							}, 'View drafts']
						] : [null]
				]
			]
		]
	)

	return r
}
templates.references.single = function () {
	var r
	var o = state.pageObjectIds
	var isDominantSaved = o.libraryItemId
	var hasCitedArticles = !!o.list.length
	// var showNotes = true
	// if (F1000Global.pageNotAnnotable ||
	// 	(state.pageObjectIds.pageType === 'REFERENCES' && F1000Global.blacklistedHighlighter) ||
	// 	F1000Global.whitelisted === 'gdocs' ||
	// 	F1000Global.embeddedPluginOnlyPage ||
	// 	F1000Global.framesetPage) showNotes = false
	var dominant = o.dominant
	if (typeof dominant.pageTitleEscaped === 'undefined') {
		dominant.pageTitleEscaped = templates.utils.escape(dominant.pageTitle)
	}
	var showPrimeModule = !!state.primeContribution
	r = (
		['div', { style: 'color: black;' },
			['div', { style: 'padding: 16px 16px 16px 16px' },
				['div.f1k-ty-bodyBold',
					getPopupHeaderTitle()
				],
				['div.f1kat-test-title', { style: 'margin: 10px 0 0 0; line-height: 21px; font-weight: bold;' },
					dominant.pageTitleEscaped
				],
			],
			showPrimeModule
				? templates.primeModule()
				: [null],
			isDominantSaved
				? this.singleSavedControls({
					hasCitedArticles: hasCitedArticles,
					libraryItemId: o.libraryItemId,
					showNotesCount: f1kat.hl.annotations.all.length,
					tags: state.tags.item
				})
				: [null]
		]
	)

	return r
}
templates.references.list = function () {
	var o = state.pageObjectIds
	// Friendly Demo Message
	var friendlyDemoMessage = state.demoMode && state.demoMode.type === 'referencesImport' ?
		['div.f1k-ty-bodyReference', { style: 'margin: 16px; border-bottom: 1px solid #00ACC1; padding-bottom: 8px;' },
			'Not relevant? Search for another researcher or your favorite topic.'
		] :
		[null]
	// Select All
	var hasPendingExports = !o.dominant.saved
	var selectAll = hasPendingExports ?
		['div', { 'class': 'reference f1k-ty-bodyReference', style: 'margin: 0px 16px 16px 16px; position: relative;' },
			['label.cp.noselect',
				['input#all.f1k-checkbox', { $: 'change.references.selectAll', type: 'checkbox' }],
				['span.f1k-checkbox', { style: 'position: absolute; margin: 2px 0px 0px 0px;' }],
				['div.noselect', { title: 'Select All', style: 'position: relative; line-height: 21px; padding: 0px 8px 0px 32px;' },
					'Select All'
				]
			]
		] :
		[null]
	// Reference Entry
	var referenceCard = templates.references.referenceCard
	function reference(i, index) {
		if (i.resolved &&
			i.resolved.pageTitle &&
			typeof i.resolved.pageTitleEscaped === 'undefined') {
			i.resolved.pageTitleEscaped = templates.utils.escape(i.resolved.pageTitle)
		}
		if (i.saved) {
			var outerStyle = !hasPendingExports && index === 0 ?
				'margin: 0px 0px 3px 0px;' :
				'margin: 0px 0px 3px 0px;'
			return referenceCard({
				articleId: i.articleId,
				libraryItemId: i.saved,
				outerStyle: outerStyle,
				pageTitle: i.resolved.pageTitleEscaped,
				showNotesCount: -1,
				titleEllipsing: 128
			})
		} else if (i.resolved && i.resolved.pageTitle) {
			var outerStyle = index === 0 ? 'margin: 0px 16px 16px 16px; position: relative;' : 'margin: 16px 16px 16px 16px; position: relative;'
			var checkboxAttributes = { id: 'pageObjectIds-list-' + index, type: 'checkbox' }
			if (i._checkedInDocument) {
				delete i._checkedInDocument
				checkboxAttributes.checked = 'checked-in-document'
			}
			return (
				['div', { 'class': 'reference f1k-ty-bodyReference', style: outerStyle },
					['label.cp.noselect',
						['input.f1k-checkbox', checkboxAttributes],
						['span.f1k-checkbox', { style: 'position: absolute; margin: 2px 0px 0px 0px;' }],
						['div.f1kat-test-title', {
							title: i.resolved.pageTitleEscaped,
							style: 'position: relative; line-height: 21px; padding: 0px 8px 0px 32px;',
						},
							templates.utils.ellipsed(i.resolved.pageTitleEscaped, 128)
						]
					]
				]
			)
		} else {
			return [null]
		}
	}

	var frag;
	var isReferences = state.pageObjectIds.pageType === 'REFERENCES'
	var singleExportId = F1000Global.referencesSingleExportId
	if (typeof singleExportId === 'number') {
		// Single Reference Export - gScholar cite
		var singleReference = o.list[singleExportId]
		frag = (
			['div.references.c.module',
				['div#list', { style: 'margin: 24px 0px 0px 0px; overflow: auto; overflow-x: hidden;' }].concat(
					[reference(singleReference, singleExportId)]
				).concat(
					[['div.c', { style: "height: 24px" }]]
				)
			]
		)
	} else {
		// List
		var list = ['div#list', { style: 'margin: 0px 0px 0px 0px; overflow: auto; overflow-x: hidden;' }].concat(
			o.list.map(reference)
		).concat(
			[['div.c', { style: "height: 48px" }]]
		)
		frag = (
			['div.references.c.module',
				isReferences
					? ['div.f1k-ty-bodyBold', { style: 'padding: 16px 16px 16px 16px' },
						getPopupHeaderTitle()
					]
					: ['div', { style: 'padding: 0px 16px 16px 16px; color: rgba(0, 0, 0, .54); font-size: 12px; font-family: Arial;' },
						state.references.showCitedArticles && hasPendingExports ?
							'We found ' + o.list.length + (o.list.length > 1 ? ' articles with a PMID or DOI' : ' article with a PMID or DOI') :
							''
					],
				friendlyDemoMessage,
				selectAll,
				list
			]
		)
	}

	return frag
}

templates.save2 = function () {
	function includePDF(alternatePDF, suggestDA) {
		// user control
		var preference = state.session.preferences.autoImportAlternatePDF
		return suggestDA ?
			['div.f1k-ty-heading.l', { style: 'margin-top: 10px; margin-bottom: 10px;' },
				'Include PDF via the ',
				['a', {
					style: 'text-decoration: none; color: #00bcd4 !important;',
					href: getwbURL() + '/work/#/guide/write',
					target: '_blank'
				}, 'Sciwheel Desktop App']
			] :
			alternatePDF ?
				['div.f1k-ty-heading.l', { style: 'margin-top: 10px; margin-bottom: 10px;' },
					['label.cp.f1k-ty-bodyBold.noselect', { "for": "f1k-autoImportAlternatePDF", style: "line-height: 18px;" },
						['input#f1k-autoImportAlternatePDF.f1k-checkbox.f1kat-test-include-pdf', {
							name: "f1k-autoImportAlternatePDF",
							type: "checkbox",
							$: 'change.save2.autoImportAlternatePDF'
						},
							preference ? { checked: true } : {}
						],
						['span.f1k-checkbox', { style: 'margin-right: 8px;' }],
						'Include PDF'
					]
				] :
				[null]
	}

	// reset state flag
	state.save2Module = false
	// ways out
	if (F1000Global.pageNotAnnotable) return [null]
	if (state.pageObjectIds.libraryItemId && state.pageObjectIds.list.length === 0) return [null]
	//if (state.pageObjectIds.dominant.saved && !state.pageObjectIds.pageType === 'ARTICLE') return [ null ]
	if (state.pageObjectIds.dominant.saved) return [null]
	// articles + references new rule
	if (popup.references.resolving) return [null]
	// single reference export exported - gScholar cite
	var singleExportId = F1000Global.referencesSingleExportId
	if (typeof singleExportId === 'number') {
		if (state.pageObjectIds.list[singleExportId].saved) {
			return [null]
		}
	}
	// Default
	var hide = false
	if (state.pageObjectIds.pageType === 'ARTICLE') {
		hide = (state.pageObjectIds.libraryItemId && !state.references.showCitedArticles) ? true : false
	}
	// state flag to know if it's present without querying
	state.save2Module = !hide
	// label
	/*var saveBtnLabel = (state.pageObjectIds.list.length > 1 || state.pageObjectIds.pageType === 'ARTICLE') ? 'ADD ITEMS' : 'ADD ITEM'
	if (state.pageObjectIds.pageType === 'ARTICLE' && ! state.references.showCitedArticles) saveBtnLabel = 'ADD ITEM'
	if (F1000Global.embeddedPluginOnlyPage) saveBtnLabel = 'ADD PDF'*/
	var saveBtnLabel = 'ADD'
	var collectionId = content_script.session.collectionId
	var alternatePDF = pageObjectIds.pageType !== 'REFERENCES' &&
		!state.pageObjectIds.libraryItemId &&
		state.pageObjectIds.dominant.alternatePDF
	var suggestDA = false
	// no logo on save2 of cited articles
	var isSavedArticle = state.pageObjectIds.pageType === 'ARTICLE' && state.pageObjectIds.libraryItemId
	var showWorkspaceLogo = !isSavedArticle
	var actionMessage = isSavedArticle
		? 'Add cited article to a project'
		: 'Add this article to a project'
	return (
		['div.save2.c.l.module', { style: hide ? 'display: none;' : 'display: block;' },
			showWorkspaceLogo
				? ['div',
					['span#f1000-at-workspace-logo.f1k-img-logo-workspace.cd', 'Sciwheel Workspace']
				] : [null],
			['div.f1k-ty-bodyBold', { style: 'margin-bottom: 10px' }, actionMessage],
			['div', { style: 'display: flex' },
				['span#f1000-at-popup-collectionSelect-trigger.f1k-collectionSelect-trigger.f1kat-test-collections-select-open#collectionsCurrent', { style: 'flex-grow: 4; margin-right: 16px;' },
					{ $: 'click.collectionSelectTrigger', style: 'width: 385px; margin-right: 16px;' },
					['span.f1kat-collectionIdLabel', { style: 'margin-right: 16px; margin-left: 8px' }, collectionId.name],
					['span.f1k-collectionSelect-arrow', '\u25bc']
				],
			],
			['div', { style: 'display: flex; justify-content: space-between; margin-top: 10px; width: 385px;' },
				['div', includePDF(alternatePDF, suggestDA)],
				['button#saveButton.f1k-ty-btn-caps.f1kat-test-add', { $: 'click.save2.save', style: 'margin-top: auto; margin-bottom: auto;' }, saveBtnLabel],

			],
			state.pageObjectIds.pageType === 'REFERENCES' && F1000Global.blacklistedHighlighter ?
				['a', { href: getwbURL() + '/work/faq/annotator/', target: '_blank' },
					['div.r.cp.f1kat-hover-active-link', { style: 'margin: 6px 16px 0 0' },
						['div.f1kat-img-help.f1kat-activable-icon']
					]
				] : [null],
		]
	)
}

templates.pdfErrorMessage = function () {
	return (
		['div', { style: 'padding: 24px 16px' },
			['p', { style: "color: black; line-height: 22px; font-size: 13px;" },
				'We\'re sorry but we can\'t automatically add this PDF to Sciwheel.', ['br'],
				'Please download the file, go to Sciwheel and add it as a reference.', ['br'],
				'You will then be able to highlight and make notes on it as usual.', ['br']
			]
		]
	)
}

templates.spinner = function () {
	return (
		['div.annotator-spinner-container', ['div#f1kat-spinner.annotator-spinner']]
	)
}

templates.highlighter = function () {
	if (F1000Global.pageNotAnnotable) return [null]
	if (F1000Global.whitelisted === 'gdocs') return [null]
	if (state.workbenchMode === 'manuscript') return [null]
	if (state.pageObjectIds.pageType === 'REFERENCES' && F1000Global.blacklistedHighlighter) return [null]
	if (F1000Global.framesetPage) {
		return ['div.highlighter.c.module', { style: 'padding: 16px' }, 'The Highlighter is not supported on this page.'];
	}
	if (F1000Global.embeddedPluginOnlyPage) {
		return ['div.highlighter.c.module', { style: 'padding: 16px' }, 'To highlight or make notes, add the PDF to your Sciwheel.'];
	}

	function onOff(d) {
		var currentState = state.highlighter.auto ? 'AUTO' : state.highlighter.on ? 'ON' : 'OFF'
		var currentStateClass = '.f1kat-hl-sw-' + currentState
		return (
			['span',
				['div#F1000-AT-highlighter-onoff-container.cp', {
					$: 'mousedown.highlighter.onOff'
				},
					['div#F1000-AT-highlighter-onoff-control' + currentStateClass,
					['div#F1000-AT-highlighter-onoff-switch' + currentStateClass],
					['div#F1000-AT-highlighter-onoff-labels',
						['div.F1000-AT-highlighter-onoff-label', 'Highlight off'],
						['div.F1000-AT-highlighter-onoff-label', 'Highlight on'],
						['div.F1000-AT-highlighter-onoff-label', 'Highlight + notes']
					]
					]
				]
			]
		)
	}

	return (
		['div.highlighter.c.module',
			onOff(state.highlighter),
			['div.r.cp.f1kat-hover-active-link', {
				style: 'margin: 6px 2px 0 0;',
				$: 'mousedown.highlighter.toggleTooltip'
			},
				['div.f1kat-img-help.f1kat-activable-icon']
			],
			['div#f1kat-highglighter-help-tooltip.cd', {
				style: 'font-size: 13px'
			},
				['div#f1kat-highglighter-help-tooltip-arrow'],
				['div', { style: 'line-height: 25px; ' },
					['span', { style: 'font-weight: bold;' }, 'Highlight on: '],
					' any selected text is automatically highlighted'
				],
				['div', { style: 'line-height: 25px; ' },
					['span', { style: 'font-weight: bold;' }, 'Highlight + notes: '],
					' select text and click the ',
					['div.f1kat-img-F-8x12', {
						style: 'display: inline-block; margin: 0px 2px -3px 3px;'
					}],
					' icon to add a note'
				],
				['div.c', { style: 'height: 16px; margin-top: 16px;' },
					['a.r', {
						href: getwbURL() + '/work/faq/annotator/',
						target: '_blank',
						style: 'color: white'
					},
						'Click here for more help'
					]
				]
			]
		]
	)
}

templates.welcomeBalloon = function (domain) {
	var messages = {
		browserPDF: (
			['div.c',
				{ style: 'text-align: center; padding: 20px 40px 10px 40px; font-size: 18px; line-height: 32px;' },
				'You can add this PDF directly to Sciwheel by clicking the',
				['img',
					{ src: 'https://sciwheel.com/annotator/assets' + '/images/icon-19-off.png' },
					{ style: 'display: inline-block; padding: 0px 10px 0px 10px;' }
				],
				'button above.'
			]
		),
		f1000PDF: (
			['div.c',
				{ style: 'text-align: center; padding: 32px 40px 16px 40px; font-size: 18px; line-height: 32px;' },
				'To start annotating this PDF just highlight some text.'
			]
		)
	}

	return (
		['div#f1000-at-popup-modal-layer.f1kat-balloon.noselect',
			{ $: 'click.popup.popBalloon; mousedown.stopPropagation; mouseup.stopPropagation', style: 'background: rgba(0, 0, 0, .4);' },
			['div#f1000-at-popup.f1kat-balloon-in.noselect',
				{
					$: 'click.stopPropagation; mousedown.stopPropagation; mouseup.stopPropagation',
					style: 'color: black; position: relative; width: 400px; height: 256px; right: 0; margin: 200px auto 0 auto; background: rgb(248, 248, 249);'
				},
				['div.header.c', { style: 'padding: 0px 10px; height: 37px;' },
					['a.l', {
						href: getwbURL() + '/work/',
						rel: 'noreferrer',
						target: '_blank',
						style: 'text-decoration: none;'
					},
						['span#f1000-at-popup-logo.f1k-img-logo-116x30.cp', 'Sciwheel']
					],
					['div.f1k-img-X.r.hover08', {
						$: 'click.popup.popBalloon',
						style: 'margin-top: 8px;'
					}]
				],
				['div', { style: 'text-align: center' },
					['div',
						messages[domain]
					],
					['button',
						{ $: 'click.popup.popBalloon', 'data-persist': true },
						'OK, GOT IT'
					]
				],
				['div', { style: 'position: absolute; bottom: 0px; background: white; padding: 10px; border-top: 1px solid rgb(210, 217, 227); width: 100%;' },
					['label.cp.f1k-ty-bodyBold.noselect', { "for": "f1k-neveragain", style: "line-height: 18px;" },
						['input#f1k-neveragain.f1k-checkbox',
							{ name: "f1k-neveragain", type: "checkbox", checked: true }
						],
						['span.f1k-checkbox', { style: 'margin-right: 8px;' }],
						'Don\'t show me this again'
					],
				]
			]
		]
	)
}

templates.columnsBack = function (handler) {
	return (
		['div.cp.f1kat-hover-bg-white.f1kat-cited-control', { $: handler, style: 'flex: 1' },
			['div', { style: 'font-size: 13px; line-height: 20px; padding: 14px 13px 13px 40px;' },
				['div.f1kat-img-arrow-left.f1kat-activable-icon',
					{ style: 'margin: 2px 0 0 -24px; position: absolute;' }
				],
				'BACK'
			]
		]
	)
}

templates.notes = function () {
	var hl = f1kat.hl

	var newbie = (
		['div', { style: 'position: relative; text-align: center; color: #8993a2; padding: 16px 36px 75px 36px;' },
			['div', { style: 'color: black; text-align: center; font-size: 21px; line-height: 26px; margin-bottom: 14px;' },
				'You haven\'t added any annotations to this paper yet.'
			],
			['div', { style: 'color: black; text-align: center; font-size: 15px; font-style: italic;' },
				'You can select text on the page to annotate it.'
			],
			['img.f1kat-fade-in.dn', {
				$: 'load.popup.toggleDN',
				src: 'https://sciwheel.com/annotator/assets' + '/images/hl-suggestion.png',
				style: 'position: absolute; bottom: 5px; left: 140px;'
			}]
		]
	)

	function note(a) {
		var hl = f1kat.hl
		var guest = a.author && (a.author.id !== content_script.session.user.id)
		var author = guest ? a.author.firstName + " " + a.author.lastName : "You"
		return (
			['div', { style: 'margin: 0px 20px 16px 15px;' },
				['div', { style: 'font-style: italic; color: #909090;' },
					author, ' ', hl.timestampf(a.created)
				],
				a.text ?
					['div', { style: 'white-space: pre-wrap; font-size: 14px; margin-top: 6px; line-height: 19px; color: #333333' },
						a.text
					] :
					[null],
				a.quote ?
					['div.cp.' + hl.getColorClass(a),
					{
						$: 'click.notes.select',
						'data-f1kat_a_id': a.id,
						style: 'line-height: 16px; position: relative; margin-top: 6px; padding: 7px 8px; color: #666666; word-break: break-word;'
					},
					templates.utils.ellipsed(a.quote, 256)
					] :
					[null]
			]
		)
	}

	function list(annotations) {
		return ['div#f1kat-notes-list', { style: 'margin: 0px 0px; overflow-y: auto; overflow-x: hidden;' }]
			.concat(annotations.map(note))
			.concat([['div.c', { style: "height: 48px" }]])
	}

	function getUserAnnotationsOptions(annotations) {
		var sessionUserId = state.session.user.id
		var allNotesCount = annotations.length
		var myNotesCount = 0

		var annotationsCountByUser = annotations.reduce(function (acc, i) {
			var userId = i && i.author && i.author.id
			if (userId === sessionUserId) {
				myNotesCount += 1
			} else {
				if (!acc[userId]) {
					acc[userId] = { count: 0, name: i.author.firstName + ' ' + i.author.lastName }
				}
				acc[userId].count += 1
			}
			return acc
		}, {})

		var allNotesLabel = 'All Notes' + (allNotesCount ? (' (' + allNotesCount + ')') : '')
		var myNotesLabel = 'Your Notes' + (myNotesCount ? (' (' + myNotesCount + ')') : '')
		var base = [
			['div.f1kat-notes-filter-option', { 'data-f1kat_notes_filter_id': 'all' },
				allNotesLabel
			],
			['div.f1kat-notes-filter-option', { 'data-f1kat_notes_filter_id': sessionUserId },
				myNotesLabel
			]
		]

		var options = Object.keys(annotationsCountByUser).reduce(function (acc, i) {
			var entry = annotationsCountByUser[i]
			var label = entry.name + ' (' + entry.count + ')'
			acc.push(
				['div.f1kat-notes-filter-option', { 'data-f1kat_notes_filter_id': i },
					label
				]
			)
			return acc
		}, base)

		return options
	}

	function trigger() {
		var count = filteredNotesList.length
		var filterTriggerLabel = noFilterActive
			? 'All Notes' + (count ? (' (' + count + ')') : '')
			: (authorLabel.firstName + ' ' + authorLabel.lastName) + (count ? (' (' + count + ')') : '')

		return (
			['div#f1kat-notes-filter-trigger.f1kat-hover-bg-white', { $: 'click.notes.toggleFilterBox' },
				['span', { style: 'margin: 3px 20px 0 0;' }, filterTriggerLabel],
				['div', { style: 'position: absolute; top: 16px; right: 20px; font-size: 11px; color: #333;' }, '▼']
			]
		)
	}

	function getAuthorLabel(notes) {
		var user = { firstName: 'Your', lastName: 'Notes' }
		var author = notes && notes[0] && notes[0].author
		if (author && author.id) {
			if (author.id === state.session.user.id) {
				return user
			} else {
				return author
			}
		} else {
			return user
		}
	}

	var allNotes = hl.annotations.all
	var userAnnotationsOptions = getUserAnnotationsOptions(allNotes || [])
	var filterNotesId = state.filterNotes.id
	var noFilterActive = !filterNotesId || filterNotesId === 'all'
	var filteredNotesList = noFilterActive
		? allNotes
		: allNotes.filter(function (i) {
			return i && i.author && i.author.id === filterNotesId
		})
	var authorLabel = noFilterActive
		? null
		: getAuthorLabel(filteredNotesList)

	return (
		['div.f1kat-popup-column-base',
			['div', { style: 'display: flex;' },
				templates.columnsBack('click.notes.close'),
				trigger(),
				['div#f1kat-notes-filter-container',
					['div#f1kat-notes-filter-content',
						{ $: 'click.notes.setFilter' }
					].concat(userAnnotationsOptions)
				]
			],
			filteredNotesList.length > 0 ? list(filteredNotesList) : newbie
		]
	)
}

templates.tags = function () {
	function bar() {
		return (
			['div', { style: 'position: relative;' },
				['input#f1kat-tags-bar-input', {
					$: 'input.tags.filter; keydown.tags.onkeydown',
					maxlength: 25,
					placeholder: 'Type to search or create tags',
					value: state.tags.filter
				}
				],
				!isFilterEmpty ?
					['div#f1kat-tags-bar-input-reset', {
						$: 'click.tags.reset'
					},
						'X'
					] : [null]
			]
		)
	}

	function presentListItem(i) {
		return (
			['div.f1kat-tag',
				i.name,
				['div.f1kat-tag-remove', {
					'data-f1kat-tag-id': i.id,
					$: 'click.tags.remove_onclick'
				},
					'X'
				]
			]
		)
	}

	function presentList() {
		return present.length > 0 ?
			['div#f1kat-tags-present-list', {
				style: 'position: relative; overflow-y: auto; padding: 4px 16px 16px 16px;'
			}].concat(present.map(presentListItem)) :
			[null]
	}

	function listItem(i, index) {
		var matched = index === 0 && (isCreating || fullMatch)
		var tagDefinition = 'div.f1kat-tag' + (matched ? '.f1kat-tag-active' : '')
		return (
			['div.f1kat-tags-list-row', {
				'data-f1kat-tag-id': i.id,
				$: 'click.tags.item_onclick; mouseenter.tags.item_onmouseenter',
				style: 'cursor: pointer;'
			},
				[tagDefinition, { 'data-f1kat-tag-id': i.id }, i.name]
			]
		)
	}

	function list() {
		return (
			['div#f1kat-tags-list', {
				style: 'overflow-y: auto; position: relative; padding: 0px 32px 40px 32px;'
			}
			].concat(available.map(listItem))
		)
	}

	var all = state.tags.private
	var present = state.tags.item
	var presentIds = present.map(function (i) { return i.id })
	var filter = state.tags.filter.trim().toLowerCase()
	var isFilterEmpty = !filter
	var available = all.filter(function (i) {
		return presentIds.indexOf(i.id) === -1 &&
			i.name.trim().toLowerCase().indexOf(filter) !== -1
	})
	var fullMatch = filter && all.filter(function (i) {
		return i.name.trim().toLowerCase() === filter
	})[0]
	var isCreating = filter && !fullMatch
	if (isCreating) {
		available = [{
			id: 'CREATE',
			name: 'Create new tag: ' + state.tags.filter.trim()
		}].concat(available)
	}

	return (
		['div.f1kat-popup-column-base',
			templates.columnsBack('click.tags.close'),
			['div#f1kat-tags-box',
				presentList(),
				bar()
			],
			list()
		]
	)
}

templates.reloadErrorMessage = function (message) {
	return (
		['div#f1000-at-popup-modal-layer.f1kat-balloon.noselect',
			{ $: 'click.popup.popBalloon; mousedown.stopPropagation; mouseup.stopPropagation', style: 'background: rgba(0, 0, 0, .4);' },
			['div#f1000-at-popup.f1kat-balloon-in.noselect',
				{
					$: 'click.stopPropagation; mousedown.stopPropagation; mouseup.stopPropagation',
					style: 'color: black; position: relative; width: 400px; height: 170px; right: 0; margin: 200px auto 0 auto; background: rgb(248, 248, 249);'
				},
				['div.header.c', { style: 'padding: 0px 10px; height: 37px;' },
					['a.l', {
						href: getwbURL() + '/work/',
						rel: 'noreferrer',
						target: '_blank',
						style: 'text-decoration: none;'
					},
						['span#f1000-at-popup-logo.f1k-img-logo-116x30.cp', 'Sciwheel']
					],
					['div.f1k-img-X.r.hover08', {
						$: 'click.popup.popBalloon',
						style: 'margin-top: 8px;'
					}]
				],
				['div', { style: "display: flex; flex-direction: column; align-items: center; padding: 16px;" },
					['div', {
						style: 'color: rgba(0, 0, 0, .54); font-size: 14px; font-family: Arial; line-height: 21px; text-align: center;'
					},
						"The extension has been updated. Please reload this page to use the Sciwheel extension."
					],
					['div.spacerV16'],
					['button',
						{ $: 'click.popup.reload', 'data-persist': true },
						'Reload Page'
					]
				]
			]
		]
	)
}