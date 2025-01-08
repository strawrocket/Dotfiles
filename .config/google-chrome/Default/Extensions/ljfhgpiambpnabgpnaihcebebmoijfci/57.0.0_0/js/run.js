'use strict';
/*! (c) Sciwheel Limited. All rights reserved. Subject to the Sciwheel download license */

//
// Blacklisted domains, Workspace, GDocs.
//
function F1000Global_blacklisted() {
	if (!document.body) {
		// Nothing to do here
		return true
	}
	var host = document.location.host
	var href = document.location.href
	// Google Home, Search results, Maps
	if (host.indexOf("google.") !== -1) {
		var title = document.title
		if (title === "Google" ||
			title.indexOf("Google Search") !== -1 ||
			title.indexOf("Google Maps") !== -1) {
			return true
		}
	}
	// Google docs
	if (host.indexOf("docs.google.") !== -1) {
		if (href.indexOf('/document/d') !== -1) {
			F1000Global.gdocs = true
		} else {
			return true
		}
	}
	// Yahoo Home, Search results
	if (host.indexOf(".yahoo.com") !== -1) {
		if (document.location.pathname === "/") {
			return true
		}
	}
	// Authorea Editor
	if (host.indexOf('authorea.com') !== -1) {
		if (document.body.querySelector('.editorToolbar')) {
			return true
		}
	}
	// Blacklisted URLs
	if (href === 'about:home' ||
		href.indexOf('/_/chrome/newtab') !== -1 ||
		href.indexOf('onedrive.live.') !== -1 ||
		href.indexOf('mail.google.') !== -1 ||
		href.indexOf('inbox.google.') !== -1 ||
		href.indexOf('.mail.live.') !== -1 ||
		href.indexOf('bing.com') !== -1 ||
		href.indexOf('.dropbox.') !== -1 ||
		href.indexOf('search.yahoo.com') !== -1 ||
		href.indexOf('duckduckgo.com') !== -1 ||
		href.indexOf('linkedin.com') !== -1 ||
		href.indexOf('instagram.com') !== -1 ||
		href.indexOf('myspace.com') !== -1 ||
		href.indexOf('hi5.com') !== -1 ||
		href.indexOf('plus.google.') !== -1 ||
		href.indexOf('messenger.com') !== -1 ||
		href.indexOf('web.whatsapp.') !== -1 ||
		href.indexOf('web.skype.') !== -1 ||
		href.indexOf('facebook.com') !== -1 ||
		href.indexOf('twitter.com') !== -1) {
		return true
	}
	// Location guessing (not necessarily blacklisted)
	if (host.indexOf('f1000.com') !== -1 ||
		host.indexOf('f1000internal.com') !== -1 ||
		host.indexOf('sciwheel.com') !== -1 ||
		host.indexOf('sciwheelinternal.com') !== -1 ||
		host.indexOf('facultyopinions.com') !== -1 ||
		host.indexOf('facultyinternal.com') !== -1) {
		// F1000 something...
		// ... could be anything, let them know we are here...
		document.body.classList.add('annotator-installed')
		if (document.head &&
			document.head.querySelector('meta[name="F1000-WB"]')) {
			// ... da Workspace!
			F1000Global.locationGuess = "workbench"
		}
		return false;
	}
	return false;
}

//
// Blacklisted Highlighter Domains - only affects pageType REFERENCES
//
function F1000Global_blacklistedHighlighter() {
	var hostname = document.location.hostname
	if (hostname.indexOf('.ncbi.nlm.nih') !== -1 ||
		hostname.indexOf('scholar.google') !== -1 ||
		hostname.indexOf('.webofknowledge.') !== -1 ||
		hostname.indexOf('academic.research.microsoft') !== -1 ||
		hostname.indexOf('academic.microsoft.') !== -1 ||
		hostname.indexOf('europepmc.') !== -1 ||
		hostname.indexOf('-primo.hosted.') !== -1) return true;
	return false;
}

function F1000Global_wellKnownWebPage() {
	var wellKnownWebPage_domains = [
		'abcnews.',
		'accuweather.',
		'acrlog.',
		'bbc.',
		'bloomberg.',
		'cnn.',
		'dailymail.',
		'drudgereport.',
		'elpais.',
		'federalregister.',
		'forbes.',
		'foxnews.',
		//'google.', NOTE: would override scholar
		'huffingtonpost.',
		'indianexpress.',
		'indiatimes.',
		'indiatimes.',
		'latimes.',
		'lemonde.',
		'mercola.',
		'mindbodygreen.',
		'nbcnews.',
		'nytimes.',
		'publico.',
		'reddit.',
		'reuters.',
		'sapo.',
		'shutterstock.',
		'theguardian.',
		'time.',
		'topix.',
		'usatoday.',
		'washingtonpost.',
		'weather.',
		'wsj.',
		'wunderground.',
		'yahoo.'
	];
	// we re-add the dot just to be sure we don't false match one weired top level domain
	var dotSplit = location.hostname.replace(/\.com$|\.co\.uk$|\.pt$|\.it$|\.fr$|\.gov$/, '').split('.')
	var thirdLevelDomain = dotSplit[0]
	// well supposed blog...
	if (thirdLevelDomain.match(/blog|news/)) return true
	// well know webpage
	var dottedRootDomain = dotSplit.pop() + '.'
	return !!~wellKnownWebPage_domains.indexOf(dottedRootDomain)
}

//
// Main
//
// Prepares the embedded environment
if (false) {
	F1000Global.embeddedHelper()
}
// NOTE: mobile run is in mobile/src/environment.js
if (!false) {
	// RUN flags, on mobile they are lazy after boot to avoid unready DOM.
	F1000Global.blacklisted = F1000Global_blacklisted()
	F1000Global.blacklistedHighlighter = F1000Global_blacklistedHighlighter()
	F1000Global.wellKnownWebPage = F1000Global_wellKnownWebPage()
	if (F1000Global.framesetPage) {
		// NOTE: this crazy beautiful code is in js/helpers.js, keep it consistent
		setTimeout(framesetRun, 500)
	} else {
		if (!F1000Global.isInIframe) {
			if (F1000Global.gdocs) {
				F1000Global.whitelistHandlers.gdocs()
			} else {
				// session Init calls background then calls back content_script with actual session
				// and is then required to cause the extension to show the login dialog
				browser.runtime.sendMessage(null, { sessionHandler: false })
			}
		}
	}
}
