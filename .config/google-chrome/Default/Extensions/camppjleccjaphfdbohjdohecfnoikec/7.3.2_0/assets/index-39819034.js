import{R as d,r as v,j as e}from"./constants-e5712b98.js";import{c as i}from"./index-f8d4d59a.js";import{e as F}from"./backend-f1dada26.js";import{B as f}from"./button-e2ac6183.js";import{u as S}from"./i18n-6c9556b7.js";import{A as w}from"./index-c40a070c.js";import{m as h}from"./motion-ec7ce7e0.js";import{c as y}from"./createLucideIcon-b09954cb.js";/**
 * @license lucide-react v0.364.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=y("ThumbsDown",[["path",{d:"M17 14V2",key:"8ymqnk"}],["path",{d:"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z",key:"s6e0r"}]]);/**
 * @license lucide-react v0.364.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=y("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z",key:"y3tblf"}]]);function H(t){const{callingSite:p,email:k,leftAlign:n,promptResult:x,queryTerms:b,requestId:j,youtube:r}=t,{t:c}=S(),[a,o]=d.useState(!1),[T,m]=d.useState(!1),u=async s=>{try{const l=await F(b,x,s,p,k,j)}catch(l){console.error(l)}};return v.useEffect(()=>{a&&m(!0);const s=setTimeout(()=>{a&&(m(!1),t.parentFeedbackSent&&t.parentFeedbackSent(!0))},2e3);return()=>clearTimeout(s)},[a]),e.jsxs(w,{children:[!a&&e.jsxs(h.div,{className:i("mr-2 flex items-center gap-1 text-sm text-zinc-400",n?"justify-start py-2":"justify-end",r?"flex-row-reverse":""),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0,y:-3},transition:{delay:.3,duration:.5,ease:"easeInOut"},children:[!t.hideText&&c("feedback.u_find_useful"),e.jsx(f,{size:"icon-sm",variant:"ghost",type:"button",className:i(r?"order-1":""),onClick:()=>{u("positive"),o(!0),t.setFeedbackClicked(!0)},children:e.jsx(N,{className:"h-4 w-4"})}),e.jsx(f,{size:"icon-sm",variant:"ghost",type:"button",onClick:()=>{u("negative"),o(!0),t.setFeedbackClicked(!0)},children:e.jsx(g,{className:"h-4 w-4"})})]}),T&&e.jsx(h.div,{className:i("mr-2 flex items-center gap-3 text-xs text-zinc-400",n?"justify-start py-2":"justify-end"),initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{delay:.5,duration:.7,ease:"easeInOut"},children:c("feedback.thanks")})]})}export{H as F};