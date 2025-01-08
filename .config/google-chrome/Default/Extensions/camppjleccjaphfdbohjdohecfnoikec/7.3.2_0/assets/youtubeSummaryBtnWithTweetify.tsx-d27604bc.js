import{r as d,j as e,a as y}from"./constants-e5712b98.js";import{c as f}from"./font-e4ec73e1.js";import{B as b,u as g}from"./button-e2ac6183.js";import{j as h,o as w,q as x,Q as T}from"./index-5ad58ea9.js";import{A as v,C as M,R as S,a as C}from"./index-f00bab01.js";import{c as E}from"./index-f8d4d59a.js";import{F as _}from"./foyerLogo-8a2dc06a.js";import{b as j}from"./utils-76dfe9a4.js";import{s as A,T as N,P as u,Y as R}from"./postMessageConstants-fa0bb197.js";import{c as B,T as L,a as F,b as I}from"./tooltip-8f9bc4e6.js";import{u as O}from"./i18n-6c9556b7.js";import{C as P}from"./configContext-ec633c64.js";import{c as D}from"./index-0c67d257.js";import"./index-fe9d96fe.js";import"./index-3da7154a.js";function U(){const{t:s}=O(),{...t}=d.useContext(v),n=j(),{isAuthenticated:o,isLoading:r,usageDetails:i}=t,[c,m]=d.useState({adsState:!1,queryCost:0,tweetifyQueryCost:0}),p=a=>{if(a.preventDefault(),!o){w(y);return}A({action:N.HANDLE_SUMMARIZE_FROM_MID_BUTTON,type:u.FROM_TWEETIFY_MID_BUTTONS})};return d.useEffect(()=>{function a(l){l.data.type===u.FROM_YT_SUMMARIZER&&l.data.action==R.UPDATE_COST_AND_ADS_STATE&&m(l.data.context)}return window.addEventListener("message",a),()=>window.removeEventListener("message",a)},[]),e.jsx(d.Fragment,{children:e.jsx(B,{children:e.jsxs(L,{children:[e.jsx(F,{children:e.jsx("div",{className:"w-fit rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1px]",children:e.jsxs(b,{className:E("hover:bg-secondary gap-2 rounded-full border !border-none border-purple-500",n==="dark"&&"dark"),size:"sm",variant:"secondary",type:"button",onClick:p,children:[e.jsx("div",{className:"size-4",children:e.jsx(_,{})}),o?"Summarize":e.jsx(e.Fragment,{children:r?"Logging in...":"Login"})]})})}),e.jsx(I,{className:"border-muted-foreground/20 max-w-32 rounded-lg border text-center",sideOffset:8,children:c.adsState?s("yt_lib.wait_ad"):`${s("yt_lib.will_use")} ${c.queryCost??4} ${h(i.type)?s("yt_lib.words"):s("yt_lib.free_summ")}`})]})})})}const q=()=>{var t,n;return(n=(t=g().details)==null?void 0:t.youtube)!=null&&n.isEnabled?e.jsx(M,{children:e.jsx(S,{children:e.jsx(P,{children:e.jsx(C,{children:e.jsx(U,{})})})})}):null};function k(){return new Promise(s=>{const t=new MutationObserver(()=>{const o=document.querySelector("ytd-menu-renderer[class='style-scope ytd-watch-metadata'] div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer");o&&(s(o),t.disconnect())}),n=document.getElementById("page-manager");t.observe(n,{childList:!0,subtree:!0})})}const W=async s=>{const t=document.createElement("merlin-component");t.id="merlin-tweetify-buttons",t.className="merlin tweetify-buttons";const n=t.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=`${D}
:host(#merlin-tweetify-buttons) {
    all: initial; /* 1st rule so subsequent properties are reset. */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.ytTweetifyButtonsAppRoot {
    z-index: 1 !important;
    display: inline-block;
  vertical-align: middle;
  margin-left: 8px; 
	font-family:
		"DM Sans Merlin",
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		Ubuntu,
		sans-serif !important;
}
}
`;const r=document.createElement("div");r.id="ytTweetifyButtonsAppRoot",r.className="ytTweetifyButtonsAppRoot",n.appendChild(o),n.appendChild(r),s(t),f(r).render(e.jsx(q,{}))},Y=async()=>{if(document.getElementById("merlin-tweetify-buttons"))return;const s=await x.fetchQuery(T);if(!(s&&!s.tweetify.visible)&&(await k(),document.body)){const t=new MutationObserver(()=>{const o=document.querySelectorAll("ytd-menu-renderer[class='style-scope ytd-watch-metadata'] div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer");if(o.length>0)for(let r=0;r<o.length;r++)o[r].nextElementSibling.id!=="merlin-tweetify-buttons"&&(W(i=>o[r].insertAdjacentElement("beforeend",i)),t.disconnect())}),n=document.querySelector("ytd-menu-renderer[class='style-scope ytd-watch-metadata'] div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer");n?t.observe(n,{attributes:!0,childList:!0,subtree:!0}):console.warn("Target node for observation not found")}};Y();
