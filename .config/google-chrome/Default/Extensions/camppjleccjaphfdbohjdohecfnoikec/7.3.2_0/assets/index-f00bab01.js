var Me=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)};var l=(t,e,r)=>(Me(t,e,"read from private field"),r?r.call(t):e.get(t)),_=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},b=(t,e,r,n)=>(Me(t,e,"write to private field"),n?n.call(t,r):e.set(t,r),r);var E=(t,e,r)=>(Me(t,e,"access private method"),r);import{r as y,j as L,g as Er,R as Sr}from"./constants-e5712b98.js";import{$ as Ir,a5 as R,a0 as ze,a6 as we,a7 as wr,a8 as pt,a9 as mt,aa as Tr,ab as Ar,ac as Cr,ad as gt,a3 as $t,ae as Rr,af as Or,x as Ce,q as Pr,ag as Dr,ah as Nr,ai as Ht,L as kr,aj as Ur}from"./index-5ad58ea9.js";import"./font-e4ec73e1.js";import"./i18n-6c9556b7.js";const $s=({children:t})=>t;var T,f,he,I,V,q,C,de,J,X,$,H,k,Y,j,ne,fe,Qe,pe,Ke,me,Ge,ge,qe,ye,Je,_e,Xe,be,Ye,De,jt,Vt,Lr=(Vt=class extends Ir{constructor(e,r){super();_(this,j);_(this,fe);_(this,pe);_(this,me);_(this,ge);_(this,ye);_(this,_e);_(this,be);_(this,De);_(this,T,void 0);_(this,f,void 0);_(this,he,void 0);_(this,I,void 0);_(this,V,void 0);_(this,q,void 0);_(this,C,void 0);_(this,de,void 0);_(this,J,void 0);_(this,X,void 0);_(this,$,void 0);_(this,H,void 0);_(this,k,void 0);_(this,Y,new Set);this.options=r,b(this,T,e),b(this,C,null),this.bindMethods(),this.setOptions(r)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(l(this,f).addObserver(this),yt(l(this,f),this.options)?E(this,j,ne).call(this):this.updateResult(),E(this,ge,qe).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return Ze(l(this,f),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return Ze(l(this,f),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,E(this,ye,Je).call(this),E(this,_e,Xe).call(this),l(this,f).removeObserver(this)}setOptions(e,r){const n=this.options,i=l(this,f);if(this.options=l(this,T).defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof R(this.options.enabled,l(this,f))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");E(this,be,Ye).call(this),l(this,f).setOptions(this.options),n._defaulted&&!ze(this.options,n)&&l(this,T).getQueryCache().notify({type:"observerOptionsUpdated",query:l(this,f),observer:this});const s=this.hasListeners();s&&_t(l(this,f),i,this.options,n)&&E(this,j,ne).call(this),this.updateResult(r),s&&(l(this,f)!==i||R(this.options.enabled,l(this,f))!==R(n.enabled,l(this,f))||we(this.options.staleTime,l(this,f))!==we(n.staleTime,l(this,f)))&&E(this,fe,Qe).call(this);const a=E(this,pe,Ke).call(this);s&&(l(this,f)!==i||R(this.options.enabled,l(this,f))!==R(n.enabled,l(this,f))||a!==l(this,k))&&E(this,me,Ge).call(this,a)}getOptimisticResult(e){const r=l(this,T).getQueryCache().build(l(this,T),e),n=this.createResult(r,e);return xr(this,n)&&(b(this,I,n),b(this,q,this.options),b(this,V,l(this,f).state)),n}getCurrentResult(){return l(this,I)}trackResult(e,r){const n={};return Object.keys(e).forEach(i=>{Object.defineProperty(n,i,{configurable:!1,enumerable:!0,get:()=>(this.trackProp(i),r==null||r(i),e[i])})}),n}trackProp(e){l(this,Y).add(e)}getCurrentQuery(){return l(this,f)}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const r=l(this,T).defaultQueryOptions(e),n=l(this,T).getQueryCache().build(l(this,T),r);return n.isFetchingOptimistic=!0,n.fetch().then(()=>this.createResult(n,r))}fetch(e){return E(this,j,ne).call(this,{...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),l(this,I)))}createResult(e,r){var re;const n=l(this,f),i=this.options,s=l(this,I),a=l(this,V),c=l(this,q),u=e!==n?e.state:l(this,he),{state:d}=e;let h={...d},v=!1,p;if(r._optimisticResults){const w=this.hasListeners(),B=!w&&yt(e,r),Le=w&&_t(e,n,r,i);(B||Le)&&(h={...h,...Cr(d.data,e.options)}),r._optimisticResults==="isRestoring"&&(h.fetchStatus="idle")}let{error:S,errorUpdatedAt:D,status:A}=h;if(r.select&&h.data!==void 0)if(s&&h.data===(a==null?void 0:a.data)&&r.select===l(this,de))p=l(this,J);else try{b(this,de,r.select),p=r.select(h.data),p=gt(s==null?void 0:s.data,p,r),b(this,J,p),b(this,C,null)}catch(w){b(this,C,w)}else p=h.data;if(r.placeholderData!==void 0&&p===void 0&&A==="pending"){let w;if(s!=null&&s.isPlaceholderData&&r.placeholderData===(c==null?void 0:c.placeholderData))w=s.data;else if(w=typeof r.placeholderData=="function"?r.placeholderData((re=l(this,X))==null?void 0:re.state.data,l(this,X)):r.placeholderData,r.select&&w!==void 0)try{w=r.select(w),b(this,C,null)}catch(B){b(this,C,B)}w!==void 0&&(A="success",p=gt(s==null?void 0:s.data,w,r),v=!0)}l(this,C)&&(S=l(this,C),p=l(this,J),D=Date.now(),A="error");const z=h.fetchStatus==="fetching",Q=A==="pending",x=A==="error",ee=Q&&z,te=p!==void 0;return{status:A,fetchStatus:h.fetchStatus,isPending:Q,isSuccess:A==="success",isError:x,isInitialLoading:ee,isLoading:ee,data:p,dataUpdatedAt:h.dataUpdatedAt,error:S,errorUpdatedAt:D,failureCount:h.fetchFailureCount,failureReason:h.fetchFailureReason,errorUpdateCount:h.errorUpdateCount,isFetched:h.dataUpdateCount>0||h.errorUpdateCount>0,isFetchedAfterMount:h.dataUpdateCount>u.dataUpdateCount||h.errorUpdateCount>u.errorUpdateCount,isFetching:z,isRefetching:z&&!Q,isLoadingError:x&&!te,isPaused:h.fetchStatus==="paused",isPlaceholderData:v,isRefetchError:x&&te,isStale:st(e,r),refetch:this.refetch}}updateResult(e){const r=l(this,I),n=this.createResult(l(this,f),this.options);if(b(this,V,l(this,f).state),b(this,q,this.options),l(this,V).data!==void 0&&b(this,X,l(this,f)),ze(n,r))return;b(this,I,n);const i={},s=()=>{if(!r)return!0;const{notifyOnChangeProps:a}=this.options,c=typeof a=="function"?a():a;if(c==="all"||!c&&!l(this,Y).size)return!0;const o=new Set(c??l(this,Y));return this.options.throwOnError&&o.add("error"),Object.keys(l(this,I)).some(u=>{const d=u;return l(this,I)[d]!==r[d]&&o.has(d)})};(e==null?void 0:e.listeners)!==!1&&s()&&(i.listeners=!0),E(this,De,jt).call(this,{...i,...e})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&E(this,ge,qe).call(this)}},T=new WeakMap,f=new WeakMap,he=new WeakMap,I=new WeakMap,V=new WeakMap,q=new WeakMap,C=new WeakMap,de=new WeakMap,J=new WeakMap,X=new WeakMap,$=new WeakMap,H=new WeakMap,k=new WeakMap,Y=new WeakMap,j=new WeakSet,ne=function(e){E(this,be,Ye).call(this);let r=l(this,f).fetch(this.options,e);return e!=null&&e.throwOnError||(r=r.catch(wr)),r},fe=new WeakSet,Qe=function(){E(this,ye,Je).call(this);const e=we(this.options.staleTime,l(this,f));if(pt||l(this,I).isStale||!mt(e))return;const n=Tr(l(this,I).dataUpdatedAt,e)+1;b(this,$,setTimeout(()=>{l(this,I).isStale||this.updateResult()},n))},pe=new WeakSet,Ke=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(l(this,f)):this.options.refetchInterval)??!1},me=new WeakSet,Ge=function(e){E(this,_e,Xe).call(this),b(this,k,e),!(pt||R(this.options.enabled,l(this,f))===!1||!mt(l(this,k))||l(this,k)===0)&&b(this,H,setInterval(()=>{(this.options.refetchIntervalInBackground||Ar.isFocused())&&E(this,j,ne).call(this)},l(this,k)))},ge=new WeakSet,qe=function(){E(this,fe,Qe).call(this),E(this,me,Ge).call(this,E(this,pe,Ke).call(this))},ye=new WeakSet,Je=function(){l(this,$)&&(clearTimeout(l(this,$)),b(this,$,void 0))},_e=new WeakSet,Xe=function(){l(this,H)&&(clearInterval(l(this,H)),b(this,H,void 0))},be=new WeakSet,Ye=function(){const e=l(this,T).getQueryCache().build(l(this,T),this.options);if(e===l(this,f))return;const r=l(this,f);b(this,f,e),b(this,he,e.state),this.hasListeners()&&(r==null||r.removeObserver(this),e.addObserver(this))},De=new WeakSet,jt=function(e){$t.batch(()=>{e.listeners&&this.listeners.forEach(r=>{r(l(this,I))}),l(this,T).getQueryCache().notify({query:l(this,f),type:"observerResultsUpdated"})})},Vt);function Mr(t,e){return R(e.enabled,t)!==!1&&t.state.data===void 0&&!(t.state.status==="error"&&e.retryOnMount===!1)}function yt(t,e){return Mr(t,e)||t.state.data!==void 0&&Ze(t,e,e.refetchOnMount)}function Ze(t,e,r){if(R(e.enabled,t)!==!1){const n=typeof r=="function"?r(t):r;return n==="always"||n!==!1&&st(t,e)}return!1}function _t(t,e,r,n){return(t!==e||R(n.enabled,t)===!1)&&(!r.suspense||t.state.status!=="error")&&st(t,r)}function st(t,e){return R(e.enabled,t)!==!1&&t.isStaleByTime(we(e.staleTime,t))}function xr(t,e){return!ze(t.getCurrentResult(),e)}var Wt=y.createContext(void 0),at=t=>{const e=y.useContext(Wt);if(t)return t;if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},Br=({client:t,children:e})=>(y.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),L.jsx(Wt.Provider,{value:t,children:e})),zt=y.createContext(!1),Fr=()=>y.useContext(zt),Vr=zt.Provider;function $r(){let t=!1;return{clearReset:()=>{t=!1},reset:()=>{t=!0},isReset:()=>t}}var Hr=y.createContext($r()),jr=()=>y.useContext(Hr);function Wr(t,e){return typeof t=="function"?t(...e):!!t}function Hs(){}var zr=(t,e)=>{(t.suspense||t.throwOnError)&&(e.isReset()||(t.retryOnMount=!1))},Qr=t=>{y.useEffect(()=>{t.clearReset()},[t])},Kr=({result:t,errorResetBoundary:e,throwOnError:r,query:n})=>t.isError&&!e.isReset()&&!t.isFetching&&n&&Wr(r,[t.error,n]),Gr=t=>{t.suspense&&(typeof t.staleTime!="number"&&(t.staleTime=1e3),typeof t.gcTime=="number"&&(t.gcTime=Math.max(t.gcTime,1e3)))},qr=(t,e)=>(t==null?void 0:t.suspense)&&e.isPending,Jr=(t,e,r)=>e.fetchOptimistic(t).catch(()=>{r.clearReset()});function Xr(t,e,r){var u,d,h,v;const n=at(r),i=Fr(),s=jr(),a=n.defaultQueryOptions(t);(d=(u=n.getDefaultOptions().queries)==null?void 0:u._experimental_beforeQuery)==null||d.call(u,a),a._optimisticResults=i?"isRestoring":"optimistic",Gr(a),zr(a,s),Qr(s);const[c]=y.useState(()=>new e(n,a)),o=c.getOptimisticResult(a);if(y.useSyncExternalStore(y.useCallback(p=>{const S=i?()=>{}:c.subscribe($t.batchCalls(p));return c.updateResult(),S},[c,i]),()=>c.getCurrentResult(),()=>c.getCurrentResult()),y.useEffect(()=>{c.setOptions(a,{listeners:!1})},[a,c]),qr(a,o))throw Jr(a,c,s);if(Kr({result:o,errorResetBoundary:s,throwOnError:a.throwOnError,query:n.getQueryCache().get(a.queryHash)}))throw o.error;return(v=(h=n.getDefaultOptions().queries)==null?void 0:h._experimental_afterQuery)==null||v.call(h,a,o),a.notifyOnChangeProps?o:c.trackResult(o)}function Qt(t,e){return Xr(t,Lr,e)}var Yr=({client:t,children:e,persistOptions:r,onSuccess:n,...i})=>{const[s,a]=y.useState(!0),c=y.useRef({persistOptions:r,onSuccess:n}),o=y.useRef(!1);return y.useEffect(()=>{c.current={persistOptions:r,onSuccess:n}}),y.useEffect(()=>{const u={...c.current.persistOptions,queryClient:t};return o.current||(o.current=!0,a(!0),Rr(u).then(async()=>{var d,h;try{await((h=(d=c.current).onSuccess)==null?void 0:h.call(d))}finally{a(!1)}})),s?void 0:Or(u)},[t,s]),L.jsx(Br,{client:t,...i,children:L.jsx(Vr,{value:s,children:e})})};const bt=t=>{let e;const r=new Set,n=(d,h)=>{const v=typeof d=="function"?d(e):d;if(!Object.is(v,e)){const p=e;e=h??(typeof v!="object"||v===null)?v:Object.assign({},e,v),r.forEach(S=>S(e,p))}},i=()=>e,o={setState:n,getState:i,getInitialState:()=>u,subscribe:d=>(r.add(d),()=>r.delete(d)),destroy:()=>{r.clear()}},u=e=t(n,i,o);return o},Zr=t=>t?bt(t):bt;var ot={exports:{}},Kt={},ct={exports:{}},Gt={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Z=y;function en(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var tn=typeof Object.is=="function"?Object.is:en,rn=Z.useState,nn=Z.useEffect,sn=Z.useLayoutEffect,an=Z.useDebugValue;function on(t,e){var r=e(),n=rn({inst:{value:r,getSnapshot:e}}),i=n[0].inst,s=n[1];return sn(function(){i.value=r,i.getSnapshot=e,xe(i)&&s({inst:i})},[t,r,e]),nn(function(){return xe(i)&&s({inst:i}),t(function(){xe(i)&&s({inst:i})})},[t]),an(r),r}function xe(t){var e=t.getSnapshot;t=t.value;try{var r=e();return!tn(t,r)}catch{return!0}}function cn(t,e){return e()}var un=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?cn:on;Gt.useSyncExternalStore=Z.useSyncExternalStore!==void 0?Z.useSyncExternalStore:un;ct.exports;ct.exports=Gt;var ln=ct.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ne=y,hn=ln;function dn(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var fn=typeof Object.is=="function"?Object.is:dn,pn=hn.useSyncExternalStore,mn=Ne.useRef,gn=Ne.useEffect,yn=Ne.useMemo,_n=Ne.useDebugValue;Kt.useSyncExternalStoreWithSelector=function(t,e,r,n,i){var s=mn(null);if(s.current===null){var a={hasValue:!1,value:null};s.current=a}else a=s.current;s=yn(function(){function o(p){if(!u){if(u=!0,d=p,p=n(p),i!==void 0&&a.hasValue){var S=a.value;if(i(S,p))return h=S}return h=p}if(S=h,fn(d,p))return S;var D=n(p);return i!==void 0&&i(S,D)?S:(d=p,h=D)}var u=!1,d,h,v=r===void 0?null:r;return[function(){return o(e())},v===null?void 0:function(){return o(v())}]},[e,r,n,i]);var c=pn(t,s[0],s[1]);return gn(function(){a.hasValue=!0,a.value=c},[c]),_n(c),c};ot.exports;ot.exports=Kt;var bn=ot.exports;const vn=Er(bn),{useDebugValue:En}=Sr,{useSyncExternalStoreWithSelector:Sn}=vn;const In=t=>t;function wn(t,e=In,r){const n=Sn(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,r);return En(n),n}const vt=t=>{const e=typeof t=="function"?Zr(t):t,r=(n,i)=>wn(e,n,i);return Object.assign(r,e),r},Tn=t=>t?vt(t):vt,An={details:null,isAppsumo:!1,isAuthenticated:!1,isEssentials:!1,isFree:!1,isGuest:!0,isInitialAuthCheckPending:!0,isLoading:!0,isPaid:!1,isTeamMember:!1,isTeamOwner:!1,isTeams:!1,isTools:!1,status:"loading"},ut=Tn()(()=>An);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt=function(t){const e=[];let r=0;for(let n=0;n<t.length;n++){let i=t.charCodeAt(n);i<128?e[r++]=i:i<2048?(e[r++]=i>>6|192,e[r++]=i&63|128):(i&64512)===55296&&n+1<t.length&&(t.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++n)&1023),e[r++]=i>>18|240,e[r++]=i>>12&63|128,e[r++]=i>>6&63|128,e[r++]=i&63|128):(e[r++]=i>>12|224,e[r++]=i>>6&63|128,e[r++]=i&63|128)}return e},Cn=function(t){const e=[];let r=0,n=0;for(;r<t.length;){const i=t[r++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[r++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[r++],a=t[r++],c=t[r++],o=((i&7)<<18|(s&63)<<12|(a&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(o>>10)),e[n++]=String.fromCharCode(56320+(o&1023))}else{const s=t[r++],a=t[r++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Jt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const r=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,c=a?t[i+1]:0,o=i+2<t.length,u=o?t[i+2]:0,d=s>>2,h=(s&3)<<4|c>>4;let v=(c&15)<<2|u>>6,p=u&63;o||(p=64,a||(v=64)),n.push(r[d],r[h],r[v],r[p])}return n.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(qt(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Cn(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const r=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<t.length;){const s=r[t.charAt(i++)],c=i<t.length?r[t.charAt(i)]:0;++i;const u=i<t.length?r[t.charAt(i)]:64;++i;const h=i<t.length?r[t.charAt(i)]:64;if(++i,s==null||c==null||u==null||h==null)throw new Rn;const v=s<<2|c>>4;if(n.push(v),u!==64){const p=c<<4&240|u>>2;if(n.push(p),h!==64){const S=u<<6&192|h;n.push(S)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Rn extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const On=function(t){const e=qt(t);return Jt.encodeByteArray(e,!0)},Xt=function(t){return On(t).replace(/\./g,"")},Yt=function(t){try{return Jt.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pn(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn=()=>Pn().__FIREBASE_DEFAULTS__,Nn=()=>{if(typeof process>"u"||typeof process.env>"u")return;const t={}.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},kn=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Yt(t[1]);return e&&JSON.parse(e)},Un=()=>{try{return Dn()||Nn()||kn()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Ln=t=>{var e;return(e=Un())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Mn(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(O())}function xn(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Bn(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Fn(){try{return typeof indexedDB=="object"}catch{return!1}}function Vn(){return new Promise((t,e)=>{try{let r=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),r||self.indexedDB.deleteDatabase(n),t(!0)},i.onupgradeneeded=()=>{r=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(r){e(r)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $n="FirebaseError";class W extends Error{constructor(e,r,n){super(r),this.code=e,this.customData=n,this.name=$n,Object.setPrototypeOf(this,W.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ve.prototype.create)}}class ve{constructor(e,r,n){this.service=e,this.serviceName=r,this.errors=n}create(e,...r){const n=r[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Hn(s,n):"Error",c=`${this.serviceName}: ${a} (${i}).`;return new W(i,c,n)}}function Hn(t,e){return t.replace(jn,(r,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const jn=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(t){const e=[];for(const[r,n]of Object.entries(t))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(r)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(r)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Wn(t,e){const r=new zn(t,e);return r.subscribe.bind(r)}class zn{constructor(e,r){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=r,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(r=>{r.next(e)})}error(e){this.forEachObserver(r=>{r.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,r,n){let i;if(e===void 0&&r===void 0&&n===void 0)throw new Error("Missing Observer.");Qn(e,["next","error","complete"])?i=e:i={next:e,error:r,complete:n},i.next===void 0&&(i.next=Be),i.error===void 0&&(i.error=Be),i.complete===void 0&&(i.complete=Be);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let r=0;r<this.observers.length;r++)this.sendOne(r,e)}sendOne(e,r){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{r(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Qn(t,e){if(typeof t!="object"||t===null)return!1;for(const r of e)if(r in t&&typeof t[r]=="function")return!0;return!1}function Be(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(t){return t&&t._delegate?t._delegate:t}class ce{constructor(e,r,n){this.name=e,this.instanceFactory=r,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var g;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(g||(g={}));const Kn={debug:g.DEBUG,verbose:g.VERBOSE,info:g.INFO,warn:g.WARN,error:g.ERROR,silent:g.SILENT},Gn=g.INFO,qn={[g.DEBUG]:"log",[g.VERBOSE]:"log",[g.INFO]:"info",[g.WARN]:"warn",[g.ERROR]:"error"},Jn=(t,e,...r)=>{if(e<t.logLevel)return;const n=new Date().toISOString(),i=qn[e];if(i)console[i](`[${n}]  ${t.name}:`,...r);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class er{constructor(e){this.name=e,this._logLevel=Gn,this._logHandler=Jn,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in g))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Kn[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,g.DEBUG,...e),this._logHandler(this,g.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,g.VERBOSE,...e),this._logHandler(this,g.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,g.INFO,...e),this._logHandler(this,g.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,g.WARN,...e),this._logHandler(this,g.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,g.ERROR,...e),this._logHandler(this,g.ERROR,...e)}}const Xn=(t,e)=>e.some(r=>t instanceof r);let Et,St;function Yn(){return Et||(Et=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Zn(){return St||(St=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const tr=new WeakMap,et=new WeakMap,rr=new WeakMap,Fe=new WeakMap,lt=new WeakMap;function ei(t){const e=new Promise((r,n)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{r(M(t.result)),i()},a=()=>{n(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(r=>{r instanceof IDBCursor&&tr.set(r,t)}).catch(()=>{}),lt.set(e,t),e}function ti(t){if(et.has(t))return;const e=new Promise((r,n)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{r(),i()},a=()=>{n(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});et.set(t,e)}let tt={get(t,e,r){if(t instanceof IDBTransaction){if(e==="done")return et.get(t);if(e==="objectStoreNames")return t.objectStoreNames||rr.get(t);if(e==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return M(t[e])},set(t,e,r){return t[e]=r,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ri(t){tt=t(tt)}function ni(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...r){const n=t.call(Ve(this),e,...r);return rr.set(n,e.sort?e.sort():[e]),M(n)}:Zn().includes(t)?function(...e){return t.apply(Ve(this),e),M(tr.get(this))}:function(...e){return M(t.apply(Ve(this),e))}}function ii(t){return typeof t=="function"?ni(t):(t instanceof IDBTransaction&&ti(t),Xn(t,Yn())?new Proxy(t,tt):t)}function M(t){if(t instanceof IDBRequest)return ei(t);if(Fe.has(t))return Fe.get(t);const e=ii(t);return e!==t&&(Fe.set(t,e),lt.set(e,t)),e}const Ve=t=>lt.get(t);function si(t,e,{blocked:r,upgrade:n,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),c=M(a);return n&&a.addEventListener("upgradeneeded",o=>{n(M(a.result),o.oldVersion,o.newVersion,M(a.transaction),o)}),r&&a.addEventListener("blocked",o=>r(o.oldVersion,o.newVersion,o)),c.then(o=>{s&&o.addEventListener("close",()=>s()),i&&o.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const ai=["get","getKey","getAll","getAllKeys","count"],oi=["put","add","delete","clear"],$e=new Map;function It(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if($e.get(e))return $e.get(e);const r=e.replace(/FromIndex$/,""),n=e!==r,i=oi.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(i||ai.includes(r)))return;const s=async function(a,...c){const o=this.transaction(a,i?"readwrite":"readonly");let u=o.store;return n&&(u=u.index(c.shift())),(await Promise.all([u[r](...c),i&&o.done]))[0]};return $e.set(e,s),s}ri(t=>({...t,get:(e,r,n)=>It(e,r)||t.get(e,r,n),has:(e,r)=>!!It(e,r)||t.has(e,r)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(r=>{if(ui(r)){const n=r.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(r=>r).join(" ")}}function ui(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const rt="@firebase/app",wt="0.10.10";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P=new er("@firebase/app"),li="@firebase/app-compat",hi="@firebase/analytics-compat",di="@firebase/analytics",fi="@firebase/app-check-compat",pi="@firebase/app-check",mi="@firebase/auth",gi="@firebase/auth-compat",yi="@firebase/database",_i="@firebase/database-compat",bi="@firebase/functions",vi="@firebase/functions-compat",Ei="@firebase/installations",Si="@firebase/installations-compat",Ii="@firebase/messaging",wi="@firebase/messaging-compat",Ti="@firebase/performance",Ai="@firebase/performance-compat",Ci="@firebase/remote-config",Ri="@firebase/remote-config-compat",Oi="@firebase/storage",Pi="@firebase/storage-compat",Di="@firebase/firestore",Ni="@firebase/vertexai-preview",ki="@firebase/firestore-compat",Ui="firebase",Li="10.13.1",Mi={[rt]:"fire-core",[li]:"fire-core-compat",[di]:"fire-analytics",[hi]:"fire-analytics-compat",[pi]:"fire-app-check",[fi]:"fire-app-check-compat",[mi]:"fire-auth",[gi]:"fire-auth-compat",[yi]:"fire-rtdb",[_i]:"fire-rtdb-compat",[bi]:"fire-fn",[vi]:"fire-fn-compat",[Ei]:"fire-iid",[Si]:"fire-iid-compat",[Ii]:"fire-fcm",[wi]:"fire-fcm-compat",[Ti]:"fire-perf",[Ai]:"fire-perf-compat",[Ci]:"fire-rc",[Ri]:"fire-rc-compat",[Oi]:"fire-gcs",[Pi]:"fire-gcs-compat",[Di]:"fire-fst",[ki]:"fire-fst-compat",[Ni]:"fire-vertex","fire-js":"fire-js",[Ui]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi=new Map,Bi=new Map,Tt=new Map;function At(t,e){try{t.container.addComponent(e)}catch(r){P.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,r)}}function ue(t){const e=t.name;if(Tt.has(e))return P.debug(`There were multiple attempts to register component ${e}.`),!1;Tt.set(e,t);for(const r of xi.values())At(r,t);for(const r of Bi.values())At(r,t);return!0}function ie(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ht=new ve("app","Firebase",Fi);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dt=Li;function se(t,e,r){var n;let i=(n=Mi[t])!==null&&n!==void 0?n:t;r&&(i+=`-${r}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),P.warn(c.join(" "));return}ue(new ce(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi="firebase-heartbeat-database",$i=1,le="firebase-heartbeat-store";let He=null;function nr(){return He||(He=si(Vi,$i,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(le)}catch(r){console.warn(r)}}}}).catch(t=>{throw ht.create("idb-open",{originalErrorMessage:t.message})})),He}async function Hi(t){try{const r=(await nr()).transaction(le),n=await r.objectStore(le).get(ir(t));return await r.done,n}catch(e){if(e instanceof W)P.warn(e.message);else{const r=ht.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});P.warn(r.message)}}}async function Ct(t,e){try{const n=(await nr()).transaction(le,"readwrite");await n.objectStore(le).put(e,ir(t)),await n.done}catch(r){if(r instanceof W)P.warn(r.message);else{const n=ht.create("idb-set",{originalErrorMessage:r==null?void 0:r.message});P.warn(n.message)}}}function ir(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ji=1024,Wi=30*24*60*60*1e3;class zi{constructor(e){this.container=e,this._heartbeatsCache=null;const r=this.container.getProvider("app").getImmediate();this._storage=new Ki(r),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,r;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Rt();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((r=this._heartbeatsCache)===null||r===void 0?void 0:r.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=Wi}),this._storage.overwrite(this._heartbeatsCache))}catch(n){P.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const r=Rt(),{heartbeatsToSend:n,unsentEntries:i}=Qi(this._heartbeatsCache.heartbeats),s=Xt(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=r,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(r){return P.warn(r),""}}}function Rt(){return new Date().toISOString().substring(0,10)}function Qi(t,e=ji){const r=[];let n=t.slice();for(const i of t){const s=r.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Ot(r)>e){s.dates.pop();break}}else if(r.push({agent:i.agent,dates:[i.date]}),Ot(r)>e){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}class Ki{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Fn()?Vn().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const r=await Hi(this.app);return r!=null&&r.heartbeats?r:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var r;if(await this._canUseIndexedDBPromise){const i=await this.read();return Ct(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var r;if(await this._canUseIndexedDBPromise){const i=await this.read();return Ct(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Ot(t){return Xt(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gi(t){ue(new ce("platform-logger",e=>new ci(e),"PRIVATE")),ue(new ce("heartbeat",e=>new zi(e),"PRIVATE")),se(rt,wt,t),se(rt,wt,"esm2017"),se("fire-js","")}Gi("");var Pt=function(){return Pt=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&(e[s]=r[s])}return e},Pt.apply(this,arguments)};function sr(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]]);return r}function js(t,e,r,n){function i(s){return s instanceof r?s:new r(function(a){a(s)})}return new(r||(r=Promise))(function(s,a){function c(d){try{u(n.next(d))}catch(h){a(h)}}function o(d){try{u(n.throw(d))}catch(h){a(h)}}function u(d){d.done?s(d.value):i(d.value).then(c,o)}u((n=n.apply(t,e||[])).next())})}function Ws(t,e){var r={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},n,i,s,a=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return a.next=c(0),a.throw=c(1),a.return=c(2),typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function c(u){return function(d){return o([u,d])}}function o(u){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,u[0]&&(r=0)),r;)try{if(n=1,i&&(s=u[0]&2?i.return:u[0]?i.throw||((s=i.return)&&s.call(i),0):i.next)&&!(s=s.call(i,u[1])).done)return s;switch(i=0,s&&(u=[u[0]&2,s.value]),u[0]){case 0:case 1:s=u;break;case 4:return r.label++,{value:u[1],done:!1};case 5:r.label++,i=u[1],u=[0];continue;case 7:u=r.ops.pop(),r.trys.pop();continue;default:if(s=r.trys,!(s=s.length>0&&s[s.length-1])&&(u[0]===6||u[0]===2)){r=0;continue}if(u[0]===3&&(!s||u[1]>s[0]&&u[1]<s[3])){r.label=u[1];break}if(u[0]===6&&r.label<s[1]){r.label=s[1],s=u;break}if(s&&r.label<s[2]){r.label=s[2],r.ops.push(u);break}s[2]&&r.ops.pop(),r.trys.pop();continue}u=e.call(t,r)}catch(d){u=[6,d],i=0}finally{n=s=0}if(u[0]&5)throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}}function zs(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var n=r.call(t),i,s=[],a;try{for(;(e===void 0||e-- >0)&&!(i=n.next()).done;)s.push(i.value)}catch(c){a={error:c}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(a)throw a.error}}return s}function Qs(t,e,r){if(r||arguments.length===2)for(var n=0,i=e.length,s;n<i;n++)(s||!(n in e))&&(s||(s=Array.prototype.slice.call(e,0,n)),s[n]=e[n]);return t.concat(s||Array.prototype.slice.call(e))}function ar(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const qi=ar,or=new ve("auth","Firebase",ar());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re=new er("@firebase/auth");function Ji(t,...e){Re.logLevel<=g.WARN&&Re.warn(`Auth (${dt}): ${t}`,...e)}function Te(t,...e){Re.logLevel<=g.ERROR&&Re.error(`Auth (${dt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dt(t,...e){throw ft(t,...e)}function cr(t,...e){return ft(t,...e)}function ur(t,e,r){const n=Object.assign(Object.assign({},qi()),{[e]:r});return new ve("auth","Firebase",n).create(e,{appName:t.name})}function Ae(t){return ur(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ft(t,...e){if(typeof t!="string"){const r=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=t.name),t._errorFactory.create(r,...n)}return or.create(t,...e)}function m(t,e,...r){if(!t)throw ft(e,...r)}function ae(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Te(e),new Error(e)}function Oe(t,e){t||ae(e)}function Xi(){return Nt()==="http:"||Nt()==="https:"}function Nt(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yi(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Xi()||xn()||"connection"in navigator)?navigator.onLine:!0}function Zi(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e,r){this.shortDelay=e,this.longDelay=r,Oe(r>e,"Short delay should be less than long delay!"),this.isMobile=Mn()||Bn()}get(){return Yi()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(t,e){Oe(t.emulator,"Emulator should always be set here");const{url:r}=t.emulator;return e?`${r}${e.startsWith("/")?e.slice(1):e}`:r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{static initialize(e,r,n){this.fetchImpl=e,r&&(this.headersImpl=r),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ae("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ae("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ae("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ts={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rs=new Ee(3e4,6e4);function hr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Ue(t,e,r,n,i={}){return dr(t,i,async()=>{let s={},a={};n&&(e==="GET"?a=n:s={body:JSON.stringify(n)});const c=Zt(Object.assign({key:t.config.apiKey},a)).slice(1),o=await t._getAdditionalHeaders();return o["Content-Type"]="application/json",t.languageCode&&(o["X-Firebase-Locale"]=t.languageCode),lr.fetch()(fr(t,t.config.apiHost,r,c),Object.assign({method:e,headers:o,referrerPolicy:"no-referrer"},s))})}async function dr(t,e,r){t._canInitEmulator=!1;const n=Object.assign(Object.assign({},ts),e);try{const i=new ns(t),s=await Promise.race([r(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Ie(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const c=s.ok?a.errorMessage:a.error.message,[o,u]=c.split(" : ");if(o==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ie(t,"credential-already-in-use",a);if(o==="EMAIL_EXISTS")throw Ie(t,"email-already-in-use",a);if(o==="USER_DISABLED")throw Ie(t,"user-disabled",a);const d=n[o]||o.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw ur(t,d,u);Dt(t,d)}}catch(i){if(i instanceof W)throw i;Dt(t,"network-request-failed",{message:String(i)})}}function fr(t,e,r,n){const i=`${e}${r}?${n}`;return t.config.emulator?es(t.config,i):`${t.config.apiScheme}://${i}`}class ns{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((r,n)=>{this.timer=setTimeout(()=>n(cr(this.auth,"network-request-failed")),rs.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Ie(t,e,r){const n={appName:t.name};r.email&&(n.email=r.email),r.phoneNumber&&(n.phoneNumber=r.phoneNumber);const i=cr(t,e,n);return i.customData._tokenResponse=r,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function is(t,e){return Ue(t,"POST","/v1/accounts:delete",e)}async function pr(t,e){return Ue(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ss(t,e=!1){const r=ke(t),n=await r.getIdToken(e),i=mr(n);m(i&&i.exp&&i.auth_time&&i.iat,r.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:n,authTime:oe(je(i.auth_time)),issuedAtTime:oe(je(i.iat)),expirationTime:oe(je(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function je(t){return Number(t)*1e3}function mr(t){const[e,r,n]=t.split(".");if(e===void 0||r===void 0||n===void 0)return Te("JWT malformed, contained fewer than 3 sections"),null;try{const i=Yt(r);return i?JSON.parse(i):(Te("Failed to decode base64 JWT payload"),null)}catch(i){return Te("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function kt(t){const e=mr(t);return m(e,"internal-error"),m(typeof e.exp<"u","internal-error"),m(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nt(t,e,r=!1){if(r)return e;try{return await e}catch(n){throw n instanceof W&&as(n)&&t.auth.currentUser===t&&await t.auth.signOut(),n}}function as({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var r;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const i=((r=this.user.stsTokenManager.expirationTime)!==null&&r!==void 0?r:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const r=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},r)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e,r){this.createdAt=e,this.lastLoginAt=r,this._initializeTime()}_initializeTime(){this.lastSignInTime=oe(this.lastLoginAt),this.creationTime=oe(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pe(t){var e;const r=t.auth,n=await t.getIdToken(),i=await nt(t,pr(r,{idToken:n}));m(i==null?void 0:i.users.length,r,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?gr(s.providerUserInfo):[],c=us(t.providerData,a),o=t.isAnonymous,u=!(t.email&&s.passwordHash)&&!(c!=null&&c.length),d=o?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new it(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(t,h)}async function cs(t){const e=ke(t);await Pe(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function us(t,e){return[...t.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function gr(t){return t.map(e=>{var{providerId:r}=e,n=sr(e,["providerId"]);return{providerId:r,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ls(t,e){const r=await dr(t,{},async()=>{const n=Zt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=fr(t,i,"/v1/token",`key=${s}`),c=await t._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",lr.fetch()(a,{method:"POST",headers:c,body:n})});return{accessToken:r.access_token,expiresIn:r.expires_in,refreshToken:r.refresh_token}}async function hs(t,e){return Ue(t,"POST","/v2/accounts:revokeToken",hr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){m(e.idToken,"internal-error"),m(typeof e.idToken<"u","internal-error"),m(typeof e.refreshToken<"u","internal-error");const r="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):kt(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,r)}updateFromIdToken(e){m(e.length!==0,"internal-error");const r=kt(e);this.updateTokensAndExpiration(e,null,r)}async getToken(e,r=!1){return!r&&this.accessToken&&!this.isExpired?this.accessToken:(m(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,r){const{accessToken:n,refreshToken:i,expiresIn:s}=await ls(e,r);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,r,n){this.refreshToken=r||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,r){const{refreshToken:n,accessToken:i,expirationTime:s}=r,a=new K;return n&&(m(typeof n=="string","internal-error",{appName:e}),a.refreshToken=n),i&&(m(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(m(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new K,this.toJSON())}_performRefresh(){return ae("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(t,e){m(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class U{constructor(e){var{uid:r,auth:n,stsTokenManager:i}=e,s=sr(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new os(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=r,this.auth=n,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new it(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const r=await nt(this,this.stsTokenManager.getToken(this.auth,e));return m(r,this.auth,"internal-error"),this.accessToken!==r&&(this.accessToken=r,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),r}getIdTokenResult(e){return ss(this,e)}reload(){return cs(this)}_assign(e){this!==e&&(m(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(r=>Object.assign({},r)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const r=new U(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return r.metadata._copy(this.metadata),r}_onReload(e){m(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,r=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),r&&await Pe(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ie(this.auth.app))return Promise.reject(Ae(this.auth));const e=await this.getIdToken();return await nt(this,is(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,r){var n,i,s,a,c,o,u,d;const h=(n=r.displayName)!==null&&n!==void 0?n:void 0,v=(i=r.email)!==null&&i!==void 0?i:void 0,p=(s=r.phoneNumber)!==null&&s!==void 0?s:void 0,S=(a=r.photoURL)!==null&&a!==void 0?a:void 0,D=(c=r.tenantId)!==null&&c!==void 0?c:void 0,A=(o=r._redirectEventId)!==null&&o!==void 0?o:void 0,z=(u=r.createdAt)!==null&&u!==void 0?u:void 0,Q=(d=r.lastLoginAt)!==null&&d!==void 0?d:void 0,{uid:x,emailVerified:ee,isAnonymous:te,providerData:Se,stsTokenManager:re}=r;m(x&&re,e,"internal-error");const w=K.fromJSON(this.name,re);m(typeof x=="string",e,"internal-error"),N(h,e.name),N(v,e.name),m(typeof ee=="boolean",e,"internal-error"),m(typeof te=="boolean",e,"internal-error"),N(p,e.name),N(S,e.name),N(D,e.name),N(A,e.name),N(z,e.name),N(Q,e.name);const B=new U({uid:x,auth:e,email:v,emailVerified:ee,displayName:h,isAnonymous:te,photoURL:S,phoneNumber:p,tenantId:D,stsTokenManager:w,createdAt:z,lastLoginAt:Q});return Se&&Array.isArray(Se)&&(B.providerData=Se.map(Le=>Object.assign({},Le))),A&&(B._redirectEventId=A),B}static async _fromIdTokenResponse(e,r,n=!1){const i=new K;i.updateFromServerResponse(r);const s=new U({uid:r.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await Pe(s),s}static async _fromGetAccountInfoResponse(e,r,n){const i=r.users[0];m(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?gr(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),c=new K;c.updateFromIdToken(n);const o=new U({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:a}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new it(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(o,u),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut=new Map;function F(t){Oe(t instanceof Function,"Expected a class definition");let e=Ut.get(t);return e?(Oe(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Ut.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,r){this.storage[e]=r}async _get(e){const r=this.storage[e];return r===void 0?null:r}async _remove(e){delete this.storage[e]}_addListener(e,r){}_removeListener(e,r){}}yr.type="NONE";const Lt=yr;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(t,e,r){return`firebase:${t}:${e}:${r}`}class G{constructor(e,r,n){this.persistence=e,this.auth=r,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=We(this.userKey,i.apiKey,s),this.fullPersistenceKey=We("persistence",i.apiKey,s),this.boundEventHandler=r._onStorageEvent.bind(r),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?U._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const r=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,r)return this.setCurrentUser(r)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,r,n="authUser"){if(!r.length)return new G(F(Lt),e,n);const i=(await Promise.all(r.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||F(Lt);const a=We(n,e.config.apiKey,e.name);let c=null;for(const u of r)try{const d=await u._get(a);if(d){const h=U._fromJSON(e,d);u!==s&&(c=h),s=u;break}}catch{}const o=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!o.length?new G(s,e,n):(s=o[0],c&&await s._set(a,c.toJSON()),await Promise.all(r.map(async u=>{if(u!==s)try{await u._remove(a)}catch{}})),new G(s,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ms(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(ds(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ys(e))return"Blackberry";if(_s(e))return"Webos";if(fs(e))return"Safari";if((e.includes("chrome/")||ps(e))&&!e.includes("edge/"))return"Chrome";if(gs(e))return"Android";{const r=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=t.match(r);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function ds(t=O()){return/firefox\//i.test(t)}function fs(t=O()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ps(t=O()){return/crios\//i.test(t)}function ms(t=O()){return/iemobile/i.test(t)}function gs(t=O()){return/android/i.test(t)}function ys(t=O()){return/blackberry/i.test(t)}function _s(t=O()){return/webos/i.test(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _r(t,e=[]){let r;switch(t){case"Browser":r=Mt(O());break;case"Worker":r=`${Mt(O())}-${t}`;break;default:r=t}const n=e.length?e.join(","):"FirebaseCore-web";return`${r}/JsCore/${dt}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,r){const n=s=>new Promise((a,c)=>{try{const o=e(s);a(o)}catch(o){c(o)}});n.onAbort=r,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const r=[];try{for(const n of this.queue)await n(e),n.onAbort&&r.push(n.onAbort)}catch(n){r.reverse();for(const i of r)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vs(t,e={}){return Ue(t,"GET","/v2/passwordPolicy",hr(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=6;class Ss{constructor(e){var r,n,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(r=a.minPasswordLength)!==null&&r!==void 0?r:Es,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var r,n,i,s,a,c;const o={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,o),this.validatePasswordCharacterOptions(e,o),o.isValid&&(o.isValid=(r=o.meetsMinPasswordLength)!==null&&r!==void 0?r:!0),o.isValid&&(o.isValid=(n=o.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),o.isValid&&(o.isValid=(i=o.containsLowercaseLetter)!==null&&i!==void 0?i:!0),o.isValid&&(o.isValid=(s=o.containsUppercaseLetter)!==null&&s!==void 0?s:!0),o.isValid&&(o.isValid=(a=o.containsNumericCharacter)!==null&&a!==void 0?a:!0),o.isValid&&(o.isValid=(c=o.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),o}validatePasswordLengthOptions(e,r){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(r.meetsMinPasswordLength=e.length>=n),i&&(r.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,r){this.updatePasswordCharacterOptionsStatuses(r,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(r,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,r,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=r)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is{constructor(e,r,n,i){this.app=e,this.heartbeatServiceProvider=r,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xt(this),this.idTokenSubscription=new xt(this),this.beforeStateQueue=new bs(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=or,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,r){return r&&(this._popupRedirectResolver=F(r)),this._initializationPromise=this.queue(async()=>{var n,i;if(!this._deleted&&(this.persistenceManager=await G.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(r),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const r=await pr(this,{idToken:e}),n=await U._fromGetAccountInfoResponse(this,r,e);await this.directlySetCurrentUser(n)}catch(r){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",r),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var r;if(ie(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId,c=i==null?void 0:i._redirectEventId,o=await this.tryRedirectSignIn(e);(!a||a===c)&&(o!=null&&o.user)&&(i=o.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return m(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let r=null;try{r=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return r}async reloadAndSetCurrentUserOrClear(e){try{await Pe(e)}catch(r){if((r==null?void 0:r.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Zi()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ie(this.app))return Promise.reject(Ae(this));const r=e?ke(e):null;return r&&m(r.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(r&&r._clone(this))}async _updateCurrentUser(e,r=!1){if(!this._deleted)return e&&m(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),r||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ie(this.app)?Promise.reject(Ae(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ie(this.app)?Promise.reject(Ae(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(F(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const r=this._getPasswordPolicyInternal();return r.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):r.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await vs(this),r=new Ss(e);this.tenantId===null?this._projectPasswordPolicy=r:this._tenantPasswordPolicies[this.tenantId]=r}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ve("auth","Firebase",e())}onAuthStateChanged(e,r,n){return this.registerStateListener(this.authStateSubscription,e,r,n)}beforeAuthStateChanged(e,r){return this.beforeStateQueue.pushCallback(e,r)}onIdTokenChanged(e,r,n){return this.registerStateListener(this.idTokenSubscription,e,r,n)}authStateReady(){return new Promise((e,r)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},r)}})}async revokeAccessToken(e){if(this.currentUser){const r=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:r};this.tenantId!=null&&(n.tenantId=this.tenantId),await hs(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,r){const n=await this.getOrInitRedirectPersistenceManager(r);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const r=e&&F(e)||this._popupRedirectResolver;m(r,this,"argument-error"),this.redirectPersistenceManager=await G.create(this,[F(r._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var r,n;return this._isInitialized&&await this.queue(async()=>{}),((r=this._currentUser)===null||r===void 0?void 0:r._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,r;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(r=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&r!==void 0?r:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,r,n,i){if(this._deleted)return()=>{};const s=typeof r=="function"?r:r.next.bind(r);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(m(c,this,"internal-error"),c.then(()=>{a||s(this.currentUser)}),typeof r=="function"){const o=e.addObserver(r,n,i);return()=>{a=!0,o()}}else{const o=e.addObserver(r);return()=>{a=!0,o()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return m(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=_r(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const r={"X-Client-Version":this.clientVersion};this.app.options.appId&&(r["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(r["X-Firebase-Client"]=n);const i=await this._getAppCheckToken();return i&&(r["X-Firebase-AppCheck"]=i),r}async _getAppCheckToken(){var e;const r=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return r!=null&&r.error&&Ji(`Error while retrieving App Check token: ${r.error}`),r==null?void 0:r.token}}function ws(t){return ke(t)}class xt{constructor(e){this.auth=e,this.observer=null,this.addObserver=Wn(r=>this.observer=r)}get next(){return m(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}function Ts(t,e){const r=(e==null?void 0:e.persistence)||[],n=(Array.isArray(r)?r:[r]).map(F);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}new Ee(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Ee(2e3,1e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Ee(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new Ee(5e3,15e3);var Bt="@firebase/auth",Ft="1.7.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const r=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,r),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const r=this.internalListeners.get(e);r&&(this.internalListeners.delete(e),r(),this.updateProactiveRefresh())}assertAuthConfigured(){m(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Rs(t){ue(new ce("auth",(e,{options:r})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=n.options;m(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const o={apiKey:a,authDomain:c,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:_r(t)},u=new Is(n,i,s,o);return Ts(u,r),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,r,n)=>{e.getProvider("auth-internal").initialize()})),ue(new ce("auth-internal",e=>{const r=ws(e.getProvider("auth").getImmediate());return(n=>new As(n))(r)},"PRIVATE").setInstantiationMode("EXPLICIT")),se(Bt,Ft,Cs(t)),se(Bt,Ft,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Os=5*60;Ln("authIdTokenMaxAge");Rs("Browser");function Ps(t,e){var r;return{details:t??null,isAppsumo:!!((r=t==null?void 0:t.role)!=null&&r.includes("sumo")),isAuthenticated:(t==null?void 0:t.role)!=="guest",isEssentials:(t==null?void 0:t.role)==="essentials",isFree:(t==null?void 0:t.role)==="free"||(t==null?void 0:t.role)==="guest"||(t==null?void 0:t.role)==="tools"||(t==null?void 0:t.role)==="pdf_monthly"||(t==null?void 0:t.role)==="pdf_weekly"||(t==null?void 0:t.role)==="pdf_yearly"||(t==null?void 0:t.role)==="wallflower_pro",isGuest:(t==null?void 0:t.role)==="guest",isInitialAuthCheckPending:e,isLoading:e,isPaid:(t==null?void 0:t.role)!=="free"&&(t==null?void 0:t.role)!=="guest"&&(t==null?void 0:t.role)!=="tools"&&(t==null?void 0:t.role)!=="pdf_monthly"&&(t==null?void 0:t.role)!=="pdf_weekly"&&(t==null?void 0:t.role)!=="pdf_yearly"&&(t==null?void 0:t.role)!=="wallflower_pro",isTeamMember:(t==null?void 0:t.role)==="member",isTeamOwner:(t==null?void 0:t.role)==="owner",isTeams:(t==null?void 0:t.role)==="member"||(t==null?void 0:t.role)==="owner",isTemporaryPro:(t==null?void 0:t.role)==="paid_temp",isTools:(t==null?void 0:t.role)==="tools",status:e?"loading":t?"authenticated":"unauthenticated"}}function Ds(){const t=Qt(Ce.UserSession),{data:e}=t;return y.useMemo(()=>Ps(e,t.isPending),[e,t.isPending])}function br(){const t=at();return y.useEffect(()=>{const e=Nr(t);return()=>e()},[t]),null}function Ns(){const t=Ds();return y.useEffect(()=>{var e;ut.setState(t),Ht(((e=t.details)==null?void 0:e.accessToken)??null)},[t]),null}function Ks(t){return L.jsxs(Yr,{client:Pr,persistOptions:{dehydrateOptions:{shouldDehydrateQuery:({meta:e})=>!!(e!=null&&e.persist)},persister:Dr},children:[L.jsx(br,{}),L.jsx(Ns,{}),t.children]})}function ks(){const t=at(),e=ut(i=>i),r=Qt({...Ce.UserUsageUAM,enabled:e.isAuthenticated});function n(i){t.setQueryData(Ce.UserUsageUAM.queryKey,i)}return{details:r.data??null,isLoading:r.isPending,query:r,update:n}}const Us={email:null,isAuthenticated:!1,isLoading:!0,name:null,photoUrl:null,session:{refreshToken:null},signOut:()=>{},token:null,usageDetails:{}},vr=y.createContext(Us);function Ls({children:t}){const e=ut(a=>a),r=ks(),n=y.useMemo(()=>{var c,o,u,d,h;return{email:((c=e.details)==null?void 0:c.email)??null,isAuthenticated:e.status==="authenticated",isLoading:e.isLoading||e.isAuthenticated?r.isLoading:!1,name:((o=e.details)==null?void 0:o.name)??null,photoUrl:((u=e.details)==null?void 0:u.photoUrl)??null,session:{refreshToken:((d=e.details)==null?void 0:d.refreshToken)??""},token:((h=e.details)==null?void 0:h.accessToken)??"",usageDetails:r.details??{}}},[e,r]);function i(){kr.remove("cacheStorage").catch(()=>{}),queryClient.resetQueries({predicate:a=>!Ur.includes(a.queryKey[0])}),queryClient.setQueryData(Ce.UserSession.queryKey,void 0),Ht(null)}const s=y.useMemo(()=>({...n,signOut:i}),[n]);return L.jsxs(vr.Provider,{value:s,children:[L.jsx(br,{}),t]})}const Gs=vr,qs=Ls;export{Gs as A,$s as C,Lr as Q,Ks as R,js as _,qs as a,vr as b,Tn as c,Qt as d,ut as e,Xr as f,Ds as g,Ws as h,Qs as i,zs as j,ks as k,Zr as l,wn as m,sr as n,Pt as o,Hs as p,Wr as s,at as u};
