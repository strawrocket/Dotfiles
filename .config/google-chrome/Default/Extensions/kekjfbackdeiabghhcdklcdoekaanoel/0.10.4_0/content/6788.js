"use strict";(self.webpackChunkMALSync=self.webpackChunkMALSync||[]).push([[6788],{72920:(e,t,n)=>{n.d(t,{R:()=>se,X:()=>le});var a=n(20641),o=n(90033),r=n(50953),i=n(85577),s=n(72702),l=n(20545),d=n(17304);const p=(0,a.pM)({__name:"media-total-episode",props:{episode:{type:Number,required:!0}},setup:e=>(t,n)=>(0,o.v_)(e.episode?e.episode:"?")});var m=n(66262);const c=(0,m.A)(p,[["__file","media-total-episode.vue"]]);var b=n(30961),g=n(97920),u=n(37796);const f={class:"right-section"},v=["src"],h={key:1},k=(0,a.pM)({__name:"media-pill",props:{watchedEp:{type:Number,optional:!0,default:null},totalEp:{type:Number,optional:!0,default:null},showEp:{type:Boolean,default:!0},score:{type:[String,Number],optional:!0,default:""},streamUrl:{type:String,optional:!0,default:""},streamIcon:{type:String,optional:!0,default:""},progressEp:{type:Number,optional:!0,default:null},progressText:{type:String,optional:!0,default:""}},setup(e){const t=e,n=(0,a.EW)((()=>Boolean(t.watchedEp&&t.watchedEp!==t.totalEp&&t.showEp)));return(t,r)=>((0,a.uX)(),(0,a.Wv)(b.A,{right:Boolean(n.value||e.streamUrl),left:Boolean(e.score)},{left:(0,a.k6)((()=>[(0,a.bF)(g.A,{icon:"star"},{default:(0,a.k6)((()=>[(0,a.eW)((0,o.v_)(e.score),1)])),_:1})])),right:(0,a.k6)((()=>[(0,a.Lk)("div",f,[Boolean(e.streamUrl)?((0,a.uX)(),(0,a.Wv)(s.A,{key:0,href:e.streamUrl},{default:(0,a.k6)((()=>[(0,a.Lk)("img",{class:"streamIcon",src:e.streamIcon},null,8,v)])),_:1},8,["href"])):(0,a.Q3)("v-if",!0),n.value?((0,a.uX)(),(0,a.CE)("div",h,[(0,a.eW)((0,o.v_)(e.watchedEp)+"/",1),(0,a.bF)(c,{episode:e.totalEp},null,8,["episode"])])):(0,a.Q3)("v-if",!0),(0,a.bF)(u.A,{episode:e.progressEp,text:e.progressText,mode:"large","watched-ep":e.watchedEp},null,8,["episode","text","watched-ep"])])])),_:1},8,["right","left"]))}}),x=(0,m.A)(k,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-75e81406 {\nto {\n    transform: translateX(100%);\n}\n}\n.right-section[data-v-75e81406] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.streamIcon[data-v-75e81406] {\n  display: inline-block;\n  vertical-align: sub;\n  height: 18px;\n  width: 18px;\n}\n.progress-pill[data-v-75e81406] {\n  margin: 0 !important;\n}\n"]],["__scopeId","data-v-75e81406"],["__file","media-pill.vue"]]);var y=n(59935),w=n(77208),_=n(26017);const E={class:"book-element"},A={class:"text"},F={class:"gradient-transition"},L={class:"top-text"},T={class:"gradient-text"},C={class:"subtext"},W={class:"value"},X=(0,a.pM)({__name:"bookmarks-cards",props:{item:{type:Object,required:!0}},setup(e){const t=(0,a.WQ)("breakpoint"),n=_.episode;return(p,m)=>((0,a.uX)(),(0,a.CE)("div",E,[(0,a.bF)(i.A,{class:"img",src:e.item.imageBanner?e.item.imageBanner:e.item.imageLarge},null,8,["src"]),(0,a.Lk)("div",{class:(0,o.C4)(["gradient",`gradient-${e.item.status}`])},null,2),(0,a.bF)(s.A,{class:"link",href:e.item.url,title:e.item.title},null,8,["href","title"]),(0,a.Lk)("div",A,[(0,a.Lk)("div",F,[(0,a.Lk)("div",L,[(0,a.bF)(y.A,{progress:e.item.progress},null,8,["progress"]),(0,a.bF)(x,{score:e.item.score,"stream-url":e.item.streamUrl,"stream-icon":e.item.streamIcon,"watched-ep":e.item.watchedEp,"show-ep":!1},null,8,["score","stream-url","stream-icon","watched-ep"])])]),(0,a.Lk)("div",T,[(0,a.Lk)("div",C,[(0,a.Lk)("div",null,[(0,a.eW)((0,o.v_)((0,r.R1)(n)(e.item.type))+" ",1),(0,a.Lk)("span",W,[(0,a.eW)((0,o.v_)(e.item.watchedEp)+"/",1),(0,a.bF)(c,{episode:e.item.totalEp},null,8,["episode"]),(0,a.bF)(u.A,{episode:e.item.progressEp,text:e.item.progressText,mode:"large","watched-ep":e.item.watchedEp},null,8,["episode","text","watched-ep"])])])]),(0,a.bF)(l.A,{class:"title"},{default:(0,a.k6)((()=>[(0,a.bF)(d.A,{status:e.item.status},null,8,["status"]),(0,a.Lk)("span",null,[(0,a.bF)(w.A,{lines:"desktop"===(0,r.R1)(t)?3:2},{default:(0,a.k6)((()=>[(0,a.eW)((0,o.v_)(e.item.title),1)])),_:1},8,["lines"])])])),_:1})])])]))}}),B=(0,m.A)(X,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-66116ff0 {\nto {\n    transform: translateX(100%);\n}\n}\n.book-element[data-v-66116ff0] {\n  transition: transform 0.25s ease;\n  box-shadow: 0 11px 21px rgba(0, 0, 0, 0.065), 0 4px 8px rgba(0, 0, 0, 0.1);\n  border-radius: 10px;\n  color: white;\n  overflow: hidden;\n  position: relative;\n  height: 240px;\n}\n.book-element[data-v-66116ff0]:active {\n  transition-delay: 0s !important;\n  transform: translateY(3px);\n}\n@media screen and (max-width: 600px) {\n.book-element[data-v-66116ff0] {\n    height: 180px;\n}\n}\n.book-element .img[data-v-66116ff0] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border-radius: 11px;\n}\n.book-element .gradient[data-v-66116ff0] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 0.25s;\n}\n.book-element .link[data-v-66116ff0] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n}\n.book-element .text[data-v-66116ff0] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  --gradient-pr: rgba(36, 36, 36, 0.4);\n  --gradient-end: rgba(36, 36, 36, 0.859);\n  display: flex;\n  flex-direction: column;\n  pointer-events: none;\n}\n.book-element .text .gradient-transition[data-v-66116ff0] {\n  flex-grow: 1;\n  padding: var(--size-spacer-half);\n  background: linear-gradient(rgba(255, 255, 255, 0) 30%, var(--gradient-pr) 100%);\n}\n.book-element .text .gradient-text[data-v-66116ff0] {\n  padding: var(--size-spacer-half);\n  background: linear-gradient(var(--gradient-pr) 0%, var(--gradient-end) 100%);\n}\n.book-element .top-text[data-v-66116ff0] {\n  align-self: flex-end;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 10px;\n}\n.book-element .title[data-v-66116ff0] {\n  margin: 0;\n  display: flex;\n  align-items: center;\n}\n.book-element .subtext[data-v-66116ff0] {\n  display: flex;\n  gap: 20px;\n  margin-bottom: 5px;\n}\n.book-element .subtext .value[data-v-66116ff0] {\n  display: inline-flex;\n  align-items: center;\n  padding-left: 5px;\n  font-weight: 600;\n}\n.book-element[data-v-66116ff0]:focus-within {\n  outline: 2px solid var(--cl-secondary);\n}\n.book-element:hover .gradient[data-v-66116ff0],\n.book-element:focus-within .gradient[data-v-66116ff0] {\n  opacity: 1;\n}\n"]],["__scopeId","data-v-66116ff0"],["__file","bookmarks-cards.vue"]]);var I=n(22388);const $=(0,a.pM)({__name:"bars",props:{bars:{type:Array,required:!0},background:{type:Boolean,default:!0}},setup(e){const t=e=>{let{width:t}=e;return t||(t=0),t<0&&(t=0),t>100&&(t=100),`width: ${t}%;`};return(n,r)=>((0,a.uX)(),(0,a.CE)("div",{class:(0,o.C4)(["bars",{background:e.background,noBackground:!e.background}])},[((0,a.uX)(!0),(0,a.CE)(a.FK,null,(0,a.pI)(e.bars,((e,n)=>((0,a.uX)(),(0,a.CE)("div",{key:n,class:(0,o.C4)(`bar bar-${e.color}`),style:(0,o.Tr)(t(e))},null,6)))),128))],2))}}),S=(0,m.A)($,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-21077d80 {\nto {\n    transform: translateX(100%);\n}\n}\n.bars[data-v-21077d80] {\n  height: 10px;\n  border-radius: 10px;\n  overflow: hidden;\n  position: relative;\n}\n.bars.background[data-v-21077d80] {\n  background-color: var(--cl-backdrop);\n}\n.bars .bar[data-v-21077d80] {\n  height: 10px;\n  border-radius: 10px;\n  height: auto;\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  transition: width 0.25s;\n}\n.bars .bar-red[data-v-21077d80] {\n  background-color: #eb5757;\n}\n.bars .bar-blue[data-v-21077d80] {\n  background-color: #56ccf2;\n}\n.bars .bar-violet[data-v-21077d80] {\n  background-color: #bb6bd9;\n}\n"]],["__scopeId","data-v-21077d80"],["__file","bars.vue"]]),M=(0,a.pM)({__name:"media-bar",props:{watchedEp:{type:Number,optional:!0,default:null},totalEp:{type:Number,optional:!0,default:null},progressEp:{type:Number,required:!1,default:0},progressText:{type:String,required:!1,default:""}},setup(e){const t=e,n=(0,a.EW)((()=>t.totalEp?t.totalEp:t.watchedEp&&t.watchedEp>t.progressEp?1.25*t.watchedEp:t.progressEp&&t.progressEp>t.watchedEp?1.25*t.progressEp:0)),o=(0,a.EW)((()=>{const e=[];return t.progressEp&&e.push({color:"red",width:t.progressEp/n.value*100}),e.push({color:"blue",width:t.watchedEp?t.watchedEp/n.value*100:0}),e}));return(t,n)=>((0,a.uX)(),(0,a.Wv)(S,{bars:o.value,background:Boolean(e.totalEp)},null,8,["bars","background"]))}}),U=(0,m.A)(M,[["styles",[".bars.background[data-v-ac4b55b6] {\n  background-color: #eceff142 !important;\n}\n.bars.noBackground[data-v-ac4b55b6] {\n  background-image: linear-gradient(90deg, #eceff142 0%, #eceff142 83%, transparent 95%);\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n"]],["__scopeId","data-v-ac4b55b6"],["__file","media-bar.vue"]]),j={class:"book-element"},z={class:"text"},N={class:"top-text"},Y={class:"title"},q=(0,a.pM)({__name:"bookmarks-cards-full",props:{item:{type:Object,required:!0}},setup(e){const t=e,n=(0,a.EW)((()=>{const e=t.item.totalEp?t.item.totalEp:"?",n=t.item.progressEp?`[${t.item.progressEp}]`:"";return`${t.item.watchedEp}/${e} ${n} ${t.item.title}`})),i=(0,r.KR)(null),l=(0,r.KR)(0),d=()=>{i.value&&(l.value=i.value.clientHeight)},p=new ResizeObserver((()=>{d()}));(0,a.wB)(i,(e=>{e&&p.observe(e)}),{immediate:!0}),(0,a.sV)((()=>{(0,a.dY)((()=>{d()})),d()})),(0,a.xo)((()=>{p.disconnect()}));const m=(0,a.EW)((()=>`${l.value}px`));return(t,r)=>((0,a.uX)(),(0,a.CE)("div",j,[(0,a.Lk)("div",{style:(0,o.Tr)(`--text: ${m.value}`)},[(0,a.bF)(I.A,{class:"img normal",src:e.item.imageLarge,mode:"cover"},null,8,["src"]),(0,a.bF)(I.A,{class:"img blurred",src:e.item.imageLarge,mode:"cover"},null,8,["src"])],4),(0,a.Lk)("div",{class:(0,o.C4)(["gradient",`gradient-${e.item.status}`])},null,2),(0,a.bF)(s.A,{class:"link",href:e.item.url,title:n.value},null,8,["href","title"]),(0,a.Lk)("div",z,[(0,a.Lk)("div",N,[(0,a.bF)(y.A,{progress:e.item.progress},null,8,["progress"]),(0,a.bF)(x,{score:e.item.score,"stream-url":e.item.streamUrl,"stream-icon":e.item.streamIcon,"watched-ep":e.item.watchedEp,"total-ep":e.item.totalEp,"progress-ep":e.item.progressEp,"progress-text":e.item.progressText},null,8,["score","stream-url","stream-icon","watched-ep","total-ep","progress-ep","progress-text"])]),(0,a.Lk)("div",{ref_key:"text",ref:i,class:"bottomBox"},[(0,a.Lk)("div",Y,[(0,a.bF)(w.A,null,{default:(0,a.k6)((()=>[(0,a.eW)((0,o.v_)(e.item.title),1)])),_:1})]),(0,a.bF)(U,{"watched-ep":e.item.watchedEp,"total-ep":e.item.totalEp,"progress-ep":e.item.progressEp,"progress-text":e.item.progressText},null,8,["watched-ep","total-ep","progress-ep","progress-text"])],512)])]))}}),Q=(0,m.A)(q,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-09ae408f {\nto {\n    transform: translateX(100%);\n}\n}\n.book-element[data-v-09ae408f] {\n  transition: transform 0.25s ease;\n  box-shadow: 0 11px 21px rgba(0, 0, 0, 0.065), 0 4px 8px rgba(0, 0, 0, 0.1);\n  border-radius: 10px;\n  color: white;\n  overflow: hidden;\n  position: relative;\n  aspect-ratio: 225/350;\n}\n.book-element[data-v-09ae408f]:active {\n  transition-delay: 0s !important;\n  transform: translateY(3px);\n}\n.book-element .img[data-v-09ae408f] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  border-radius: 11px;\n}\n.book-element .img.normal[data-v-09ae408f] {\n  clip-path: inset(0 0 var(--text) 0);\n}\n.book-element .img.blurred[data-v-09ae408f] {\n  filter: blur(8px) brightness(0.6);\n  clip-path: inset(calc(100% - var(--text)) 0 0 0);\n}\n.book-element .gradient[data-v-09ae408f] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 0.25s;\n}\n.book-element .link[data-v-09ae408f] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n}\n.book-element .text[data-v-09ae408f] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  pointer-events: none;\n}\n.book-element .top-text[data-v-09ae408f] {\n  flex-grow: 1;\n  align-self: flex-end;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 10px;\n  padding: 10px;\n}\n.book-element .bottomBox[data-v-09ae408f] {\n  position: relative;\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  padding: 10px;\n  overflow: hidden;\n}\n.book-element .bottomBox .title[data-v-09ae408f] {\n  position: relative;\n  margin-bottom: 10px;\n  font-weight: 500;\n}\n.book-element[data-v-09ae408f]:focus-within {\n  outline: 2px solid var(--cl-secondary);\n}\n.book-element:hover .img[data-v-09ae408f],\n.book-element:focus-within .img[data-v-09ae408f] {\n  filter: grayscale(1);\n}\n.book-element:hover .img.normal[data-v-09ae408f],\n.book-element:focus-within .img.normal[data-v-09ae408f] {\n  clip-path: inset(0 0 0 0);\n}\n.book-element:hover .img.blurred[data-v-09ae408f],\n.book-element:focus-within .img.blurred[data-v-09ae408f] {\n  display: none;\n}\n.book-element:hover .gradient[data-v-09ae408f],\n.book-element:focus-within .gradient[data-v-09ae408f] {\n  opacity: 1;\n}\n"]],["__scopeId","data-v-09ae408f"],["__file","bookmarks-cards-full.vue"]]);var R=n(83982),O=n(19426);const D={class:"img"},K={key:0,class:"top-text"},G={class:"stream-text"},H={key:1,class:"time"},P={class:"progress"},V={class:"subtext"},J={class:"value"},Z=(e=>((0,a.Qi)("data-v-aaf62710"),e=e(),(0,a.jt)(),e))((()=>(0,a.Lk)("div",null,"/",-1))),ee={class:"subtext score"},te=(0,a.pM)({__name:"bookmarks-list",props:{item:{type:Object,required:!0}},setup:e=>(t,n)=>((0,a.uX)(),(0,a.CE)("div",{class:(0,o.C4)(["book-element",`state-${e.item.status}`])},[(0,a.Lk)("div",D,[(0,a.bF)(I.A,{src:e.item.image},null,8,["src"])]),(0,a.Lk)("div",{class:(0,o.C4)(["text-side",{hasTop:e.item.streamUrl||e.item.progressText}])},[e.item.streamUrl||e.item.progressText?((0,a.uX)(),(0,a.CE)("div",K,[e.item.streamUrl?((0,a.uX)(),(0,a.Wv)(s.A,{key:0,href:e.item.streamUrl,class:"stream"},{default:(0,a.k6)((()=>[(0,a.bF)(g.A,{src:e.item.streamIcon},{default:(0,a.k6)((()=>[(0,a.Lk)("span",G,[(0,a.eW)((0,o.v_)(t.lang(`overview_Continue_${e.item.type}`))+" ",1),(0,a.bF)(O.A)])])),_:1},8,["src"])])),_:1},8,["href"])):(0,a.Q3)("v-if",!0),e.item.progressText?((0,a.uX)(),(0,a.CE)("div",H,(0,o.v_)(e.item.progressText),1)):(0,a.Q3)("v-if",!0)])):(0,a.Q3)("v-if",!0),(0,a.bF)(s.A,{href:e.item.url,class:"link"},null,8,["href"]),(0,a.bF)(w.A,null,{default:(0,a.k6)((()=>[(0,a.bF)(R.A,{class:"title",text:e.item.title,sizes:[20],"double-row-sizes":[20,14]},null,8,["text"])])),_:1}),(0,a.bF)(U,{"watched-ep":e.item.watchedEp,"total-ep":e.item.totalEp,"progress-ep":e.item.progressEp,"progress-text":e.item.progressText},null,8,["watched-ep","total-ep","progress-ep","progress-text"])],2),(0,a.Lk)("div",P,[(0,a.Lk)("div",V,[(0,a.Lk)("div",J,(0,o.v_)(e.item.watchedEp),1),Z,(0,a.Lk)("div",null,[(0,a.bF)(c,{episode:e.item.totalEp},null,8,["episode"])]),(0,a.Lk)("div",null,[(0,a.bF)(u.A,{episode:e.item.progressEp,text:e.item.progressText,mode:"medium","watched-ep":e.item.watchedEp},null,8,["episode","text","watched-ep"])])])]),(0,a.Lk)("div",ee,(0,o.v_)(e.item.score||""),1)],2))}),ne=(0,m.A)(te,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-aaf62710 {\nto {\n    transform: translateX(100%);\n}\n}\n.book-element[data-v-aaf62710] {\n  transition: transform 0.25s ease;\n  position: relative;\n  display: flex;\n  padding: 5px 10px 5px 0;\n  gap: 10px;\n  min-height: 70px;\n}\n.book-element[data-v-aaf62710]:active {\n  transition-delay: 0s !important;\n  transform: translateY(3px);\n}\n.book-element .img[data-v-aaf62710] {\n  position: relative;\n  overflow: hidden;\n  width: 10vw;\n  min-width: 80px;\n  max-width: 125px;\n  border-radius: 10px;\n}\n.book-element .img .lazy-image[data-v-aaf62710] {\n  border-radius: 10px;\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.book-element .link[data-v-aaf62710] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n}\n.book-element .text-side[data-v-aaf62710] {\n  flex-grow: 1;\n  flex-shrink: 1000;\n  display: flex;\n  gap: 4px;\n  flex-direction: column;\n  justify-content: space-around;\n  padding-top: calc(5px + (0.875rem / 2));\n  padding-bottom: calc(5px + (0.875rem / 2));\n}\n.book-element .text-side.hasTop[data-v-aaf62710] {\n  padding-top: 3px;\n  padding-bottom: 3px;\n}\n.book-element .stream[data-v-aaf62710]:hover {\n  color: var(--cl-secondary);\n}\n.book-element .title[data-v-aaf62710] {\n  margin: 0;\n}\n.book-element .subtext[data-v-aaf62710] {\n  color: var(--cl-light-text);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n}\n.book-element .subtext .value[data-v-aaf62710] {\n  font-weight: bold;\n}\n.book-element .subtext.score[data-v-aaf62710] {\n  width: 50px;\n}\n@media screen and (max-width: 499px) {\n.book-element .subtext.score[data-v-aaf62710] {\n    display: none;\n}\n}\n.book-element .progress[data-v-aaf62710] {\n  color: var(--cl-light-text);\n  min-width: 80px;\n  display: flex;\n  flex-direction: column;\n  align-content: center;\n  justify-content: center;\n  text-align: center;\n  gap: 5px;\n}\n@media screen and (max-width: 499px) {\n.book-element .progress[data-v-aaf62710] {\n    display: none;\n}\n}\n.book-element .top-text[data-v-aaf62710] {\n  color: var(--cl-light-text);\n  font-size: 0.875rem;\n  height: 0.875rem;\n  display: flex;\n  justify-content: space-between;\n  pointer-events: none;\n  z-index: 2;\n}\n.book-element .bars[data-v-aaf62710] {\n  pointer-events: none;\n  height: 5px;\n}\n.book-element[data-v-aaf62710]:hover {\n  border-radius: 10px;\n  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.07);\n  background-color: var(--cl-backdrop);\n}\n.book-element:hover.state-0[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-0) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-1[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-1) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-2[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-2) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-3[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-3) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-4[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-4) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-6[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-6) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-23[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-23) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover.state-7[data-v-aaf62710] {\n  background: linear-gradient(90deg, var(--state-7) 0%, var(--cl-backdrop) 30%);\n}\n.book-element:hover .img[data-v-aaf62710] {\n  overflow: visible;\n  z-index: 1;\n  pointer-events: none;\n}\n.book-element:hover .img .lazy-image[data-v-aaf62710] {\n  border-radius: 10px;\n  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);\n  inset-inline-start: -10px;\n  max-width: calc(100% + 10px);\n}\n@media screen and (max-width: 600px) {\n.stream-text[data-v-aaf62710] {\n    display: none;\n}\n}\n.empty[data-v-aaf62710],\n.error[data-v-aaf62710] {\n  height: 100%;\n}\n"]],["__scopeId","data-v-aaf62710"],["__file","bookmarks-list.vue"]]),ae={class:"book-element"},oe={class:"on-hover"},re=(0,a.pM)({__name:"bookmarks-tiles",props:{item:{type:Object,required:!0}},setup:e=>(t,n)=>((0,a.uX)(),(0,a.CE)("div",ae,[(0,a.bF)(I.A,{class:"img",src:e.item.image,mode:"cover"},null,8,["src"]),(0,a.Lk)("div",{class:(0,o.C4)(["gradient",`gradient-${e.item.status}`])},null,2),(0,a.bF)(s.A,{class:"link",href:e.item.url,title:e.item.title},null,8,["href","title"]),(0,a.Lk)("div",oe,[(0,a.bF)(x,{score:e.item.score},null,8,["score"]),(0,a.bF)(x,{"stream-url":e.item.streamUrl,"stream-icon":e.item.streamIcon,"watched-ep":e.item.watchedEp,"total-ep":e.item.totalEp,"progress-ep":e.item.progressEp,"progress-text":e.item.progressText},null,8,["stream-url","stream-icon","watched-ep","total-ep","progress-ep","progress-text"])])]))}),ie={name:"Cards",icon:"view_agenda",component:B,width:350,popupWidth:350,transition:20},se=[ie,{name:"Full Cards",icon:"view_module",component:Q,width:191,popupWidth:160,transition:20},{name:"List",icon:"view_list",component:ne,width:0,popupWidth:0,transition:30},{name:"Tiles",icon:"apps",component:(0,m.A)(re,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-f655063e {\nto {\n    transform: translateX(100%);\n}\n}\n.book-element[data-v-f655063e] {\n  transition: transform 0.25s ease;\n  box-shadow: 0 11px 21px rgba(0, 0, 0, 0.065), 0 4px 8px rgba(0, 0, 0, 0.1);\n  border-radius: 10px;\n  overflow: hidden;\n  position: relative;\n  aspect-ratio: 1;\n}\n.book-element[data-v-f655063e]:active {\n  transition-delay: 0s !important;\n  transform: translateY(3px);\n}\n.book-element .img[data-v-f655063e] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n}\n.book-element .gradient[data-v-f655063e] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 0.25s;\n}\n.book-element .link[data-v-f655063e] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n}\n.book-element .on-hover[data-v-f655063e] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  width: 100%;\n  opacity: 0;\n  pointer-events: none;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n}\n.book-element[data-v-f655063e]:focus-within {\n  outline: 2px solid var(--cl-secondary);\n}\n.book-element:hover .img[data-v-f655063e],\n.book-element:focus-within .img[data-v-f655063e] {\n  filter: grayscale(1);\n}\n.book-element:hover .gradient[data-v-f655063e],\n.book-element:focus-within .gradient[data-v-f655063e] {\n  opacity: 1;\n}\n.book-element:hover .on-hover[data-v-f655063e],\n.book-element:focus-within .on-hover[data-v-f655063e] {\n  opacity: 1;\n}\n"]],["__scopeId","data-v-f655063e"],["__file","bookmarks-tiles.vue"]]),width:130,popupWidth:130,transition:15}],le=[ie]},39813:(e,t,n)=>{n.d(t,{A:()=>s});var a=n(20641),o=n(53751),r=n(78584);const i=(0,a.pM)({__name:"transition-staggered",props:{delayDuration:{type:Number,default:100}},setup(e){const t=e;let n=!0;try{const e=window.matchMedia("(prefers-reduced-motion: reduce)");n=!e.matches}catch(e){r.error(e)}let i,s=0;function l(e){n&&(e.style.opacity="0",e.style.transform="translateY(20px)",(0,a.dY)().then((()=>{e.style.transitionProperty="opacity, transform",e.style.transitionDuration="150ms"})))}function d(e){n&&setTimeout((()=>{clearTimeout(i),i=setTimeout((()=>{s=0}),100);const n=s++*t.delayDuration;e.style.opacity="1",e.style.transform="translateY(0)",e.style.transitionDelay=`${n}ms`,setTimeout((()=>{e.setAttribute("style","")}),n+150)}),0)}return(e,t)=>((0,a.uX)(),(0,a.Wv)(o.TransitionGroup,{appear:"",onBeforeEnter:l,onEnter:d},{default:(0,a.k6)((()=>[(0,a.RG)(e.$slots,"default")])),_:3}))}}),s=(0,n(66262).A)(i,[["__file","transition-staggered.vue"]])}}]);
//# sourceMappingURL=6788.js.map