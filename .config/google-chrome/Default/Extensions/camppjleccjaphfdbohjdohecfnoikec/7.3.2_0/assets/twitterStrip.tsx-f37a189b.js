import{j as p,r as w,P as x,S}from"./constants-e5712b98.js";import{c as E}from"./font-e4ec73e1.js";import{u as v}from"./button-e2ac6183.js";import{q as C,Q as g}from"./index-5ad58ea9.js";import{C as q,R,a as A}from"./index-f00bab01.js";import{F as P}from"./index-f0d39e78.js";import{T as j}from"./themeContext-b5ecfc73.js";import{c as W}from"./index-0c67d257.js";import{d as T}from"./debounce-c70d88e0.js";import{v as O}from"./v4-4a60fe23.js";import"./i18n-6c9556b7.js";import"./index-f8d4d59a.js";import"./index-39819034.js";import"./backend-f1dada26.js";import"./index-c40a070c.js";import"./motion-ec7ce7e0.js";import"./createLucideIcon-b09954cb.js";import"./index-d6d87676.js";import"./analytics-e24f0cc0.js";import"./useMedia-c48a250e.js";import"./useSSE-d3d13984.js";import"./languageLogoMap-b1afba5a.js";import"./index-52d9b6b3.js";import"./foyerLogo-8a2dc06a.js";import"./useOnClickOutside-cc638742.js";import"./createReactComponent-85aa5d18.js";import"./fuzzysort-48427cba.js";import"./IconX-5b78e9ec.js";import"./IconCheck-f452d2aa.js";import"./IconSend-07f8814c.js";import"./IconReload-9b2d2e3d.js";import"./IconChevronRight-89acbc25.js";import"./IconLanguage-a0ed4545.js";import"./IconSettings-58104ccf.js";const F=async()=>{var a,c;const n=await C.fetchQuery(g);if(n&&!n.fabStrip.twitter.visible)return;const r=(c=(a=n.fabStrip)==null?void 0:a.twitter)==null?void 0:c.containerClassname,o=await I(r);o&&!o.querySelector("merlin-component")&&h(e=>o.insertBefore(e,o.firstChild.nextSibling));const s=new MutationObserver(T(()=>{try{const t=document.querySelector("[id^='typeaheadDropdownWrapped-']"),i=document.querySelector(".merlin.fabStrip");t?i&&(i.style.zIndex="0"):i.style.zIndex="1000"}catch{}const e=document.querySelectorAll(r||".css-175oi2r.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t");if(e.length>0)for(let t=0;t<e.length;t++)e[t].querySelector("merlin-component")||h(i=>e[t].insertBefore(i,e[t].firstChild.nextSibling))},300)),l={childList:!0,subtree:!0};s.observe(document.body,l)},I=n=>new Promise(r=>{const o=new MutationObserver(T(()=>{const s=document.querySelector(n||".css-175oi2r.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t");s&&(r(s),o.disconnect())},300));o.observe(document.body,{childList:!0,subtree:!0})}),h=async n=>{var b;const r=document.createElement("merlin-component");r.id="merlin-fabStrip",r.className="merlin fabStrip";const o=r.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=`${W}
    :host(.merlin.fabStrip) {
      all: initial; /* 1st rule so subsequent properties are reset. */
      position: relative;
      display: block;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      z-index: 1000;
    }
    .fabStrip {
      all: initial; /* 1st rule so subsequent properties are reset. */
      position: relative;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .fabStrip ::-webkit-scrollbar {
      display: none;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    `;const l=document.createElement("div");l.id="reactAppRoot",l.className="reactAppRoot fabStrip "+O(),o.appendChild(s),o.appendChild(l),n(r);const a={};let c=null,e=null,t=null,i=null,d=null,y="";try{if(e=r.closest('[data-testid="cellInnerDiv"], [aria-labelledby="modal-header"]'),e&&(d=e.querySelector("article"),d&&(c=d.querySelector('[data-testid="tweetText"]')),t=e.querySelector('[data-testid="attachments"]'),i=e.querySelector('article a div[dir="ltr"]')),c){const m=c.textContent;a.tweetText=m}i&&(y=i.textContent.trim(),a.postBy=y);try{if(t){const m=(b=t.textContent)==null?void 0:b.trim();m&&(a.quoteTweetText=m)}}catch{}}catch{}let u,f;d||t?(u=x.TWEET_REPLY,f=S.TWITTER.TWEET_REPLY):(u=x.TWEET,f=S.TWITTER.TWEET),E(l).render(p.jsx(L,{editor:r,contextData:a,promptsFor:u,mountOn:f}))};function L(n){var t,i;const{contextData:r,editor:o,mountOn:s,promptsFor:l}=n,[a,c]=w.useState("");return(i=(t=v().details)==null?void 0:t.twitter)!=null&&i.isEnabled?p.jsx(q,{children:p.jsx(R,{children:p.jsx(A,{children:p.jsx(j,{websiteOverride:!0,children:p.jsx(P,{editor:o,host:"twitter",contextData:r,promptsFor:l,dotMenuPosition:"top",mountOn:s,textareaValue:a,setTextareaValue:c})})})})}):null}F();
