"use strict";(self.webpackChunkMALSync=self.webpackChunkMALSync||[]).push([[8221],{18221:(e,n,o)=>{o.d(n,{A:()=>g});var a=o(20641),t=o(53751),r=o(90033),d=o(50953),p=o(42632),l=o(11312),s=o(97920),i=o(93196),u=o(10954),c=o(10192),v=o(80644),f=o(18490),m=o(84773);function b({emit:e,popperNode:n,triggerNode:o,placement:t}){const r=(0,d.Kh)({isOpen:!1,popperInstance:null}),p=e=>{r.popperInstance?.setOptions((n=>({...n,modifiers:[...n.modifiers,{name:"eventListeners",enabled:e}]})))};(0,a.wB)([()=>r.isOpen,t],(async([e])=>{e?(await l(),p(!0)):p(!1)}));const l=async()=>{await(0,a.dY)(),r.popperInstance=(0,u.n4)(o.value,n.value,{placement:t.value,modifiers:[c.A,{name:"preventOverflow",options:{padding:15}},v.A,{name:"flip",enabled:!0,options:{allowedAutoPlacements:["top","bottom"]}},f.A,{name:"offset",options:{offset:[0,10]}},m.A,{name:"applyMaxSize",enabled:!0,phase:"beforeWrite",requires:["maxSize"],fn(e){const{height:n,width:o}=e.state.modifiersData.maxSize;e.state.styles.popper={...e.state.styles.popper,maxHeight:n-10+"px",maxWidth:`min(calc(100vw - 30px), ${o}px)`}}}]}),r.popperInstance.update()};return(0,a.xo)((()=>{r.popperInstance?.destroy()})),{...(0,d.QW)(r),open:()=>{r.isOpen||(r.isOpen=!0,e("open:popper"))},close:()=>{r.isOpen&&(r.isOpen=!1,e("close:popper"))}}}const w=["onClick","onMouseover"],y=(0,a.pM)({__name:"form-dropdown",props:{options:{type:Array,required:!0},modelValue:{type:[String,Number],require:!0,default:""},placeholder:{type:String,default:""},position:{type:String,default:"auto"},alignItems:{type:String,default:"center"},direction:{type:String,default:"column"},size:{type:String,default:"medium"},animate:{type:Boolean,default:!0},compareFunc:{type:Function,default:(e,n)=>e.toString()===n.toString()},disabled:{type:Boolean,default:!1}},emits:["update:modelValue","close:popper","open:popper"],setup(e,{emit:n}){(0,t.useCssVars)((n=>({"1dd3494f":e.direction})));const o=e,u=n,c=(0,a.EW)({get:()=>o.modelValue,set(e){u("update:modelValue",e)}}),v=(0,d.KR)(!1),f=(0,a.EW)((()=>{const e=o.options.find((e=>o.compareFunc(e.value,c.value)));return e?e.title||e.label:o.placeholder})),m=(0,a.EW)((()=>{const e=o.options.find((e=>o.compareFunc(e.value,c.value)));return e?e.meta:{}})),y=(0,d.KR)(null),g=(0,d.KR)(null),h=(0,d.KR)(o.position),x=b({emit:u,placement:h,popperNode:y,triggerNode:g});(0,a.wB)(v,(e=>{e?x.open():x.close()}));const k=(0,d.KR)("_-_");function _(){return o.options.findIndex((e=>o.compareFunc(e.value,k.value)))}function A(){(0,a.dY)((()=>{if(y.value){const e=$(y.value).find(".focus").first().get(0);e&&e.scrollIntoView({block:"nearest"})}}))}return(n,u)=>((0,a.uX)(),(0,a.CE)("button",{ref_key:"triggerNode",ref:g,tabindex:"-1",class:(0,r.C4)(["dropdown",`${e.size} ${e.disabled?"disabled":""}`]),onBlur:u[3]||(u[3]=e=>{(0,a.dY)().then((()=>{v.value=!1}))}),onKeydown:u[4]||(u[4]=e=>function(e){switch(e.key){case"ArrowUp":{const e=_();e>0&&(k.value=o.options[e-1].value,A());break}case"ArrowDown":{const e=_();e<o.options.length-1&&(k.value=o.options[e+1].value,A());break}case"Enter":if(!v.value){v.value=!0;break}"_-_"!==k.value&&(c.value=k.value),v.value=!1;break;case"Escape":v.value=!1,k.value="_-_";break;default:return v.value=!1,void(k.value="_-_")}e.preventDefault()}(e))},[(0,a.Lk)("div",{tabindex:"0",class:(0,r.C4)(["selector",{animate:e.animate}]),onMousedown:u[0]||(u[0]=(0,t.withModifiers)((()=>{}),["prevent"])),onClick:u[1]||(u[1]=e=>{v.value=!v.value,n.$el.focus()}),"onKeypress:enter":u[2]||(u[2]=e=>{v.value=!v.value,n.$el.focus()})},[(0,a.RG)(n.$slots,"select",{open:v.value,currentTitle:f.value,value:c.value,meta:m.value},(()=>[(0,a.bF)(l.A,{tabindex:-1,animation:!1,class:"form-button"},{default:(0,a.k6)((()=>[(0,a.bF)(s.A,{icon:v.value?"keyboard_arrow_up":"keyboard_arrow_down",position:"after",mode:"space-between",class:"icon-text"},{default:(0,a.k6)((()=>[(0,a.eW)((0,r.v_)(f.value),1)])),_:1},8,["icon"])])),_:1})]))],34),(0,a.bo)((0,a.Lk)("div",{ref_key:"popperNode",ref:y,class:"dropdown-pop"},[(0,a.bF)((0,d.R1)(p.r),{class:"dropdown-pop-scroll",options:{scrollbars:{theme:"os-theme-custom"}},defer:""},{default:(0,a.k6)((()=>[(0,a.Lk)("div",{class:"dropdown-pop-default",style:(0,r.Tr)(`text-align: ${e.alignItems}`)},[((0,a.uX)(!0),(0,a.CE)(a.FK,null,(0,a.pI)(e.options,(o=>((0,a.uX)(),(0,a.CE)(a.FK,{key:o.value},["-_-_-"===o.title||"-_-_-"===o.label?((0,a.uX)(),(0,a.Wv)(i.A,{key:0,direction:"both",padding:"half"})):((0,a.uX)(),(0,a.CE)("div",{key:1,class:(0,r.C4)(["dropdown-pop-default-element",{active:e.compareFunc(o.value,c.value),focus:k.value===o.value}]),onClick:e=>(e=>{c.value=e.value,v.value=!1})(o),onMouseover:e=>k.value=o.value},[(0,a.RG)(n.$slots,"option",{option:o},(()=>[(0,a.eW)((0,r.v_)(o.title||o.label),1)]))],42,w))],64)))),128))],4)])),_:3})],512),[[t.vShow,v.value]])],34))}}),g=(0,o(66262).A)(y,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-066f8628 {\nto {\n    transform: translateX(100%);\n}\n}\n.dropdown[data-v-066f8628] {\n  user-select: none;\n  position: relative;\n  display: inline-block;\n}\n.dropdown[data-v-066f8628]:focus-visible {\n  outline: none;\n}\n.dropdown .selector[data-v-066f8628] {\n  cursor: pointer;\n}\n.dropdown .selector.animate[data-v-066f8628] {\n  transition: transform 0.25s ease;\n}\n.dropdown .selector.animate[data-v-066f8628]:active {\n  transition-delay: 0s !important;\n  transform: translateY(3px);\n}\n.dropdown .selector[data-v-066f8628]:focus-visible {\n  outline: 2px solid var(--cl-secondary);\n}\n.dropdown .form-button[data-v-066f8628] {\n  width: 100%;\n}\n.dropdown .icon-text[data-v-066f8628] {\n  display: flex;\n  align-items: center;\n}\n.dropdown .dropdown-pop[data-v-066f8628] {\n  border-radius: 10px;\n  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);\n  position: absolute;\n  z-index: 9999;\n  width: max-content;\n  white-space: normal;\n  display: flex;\n  overflow: hidden;\n}\n.dropdown .dropdown-pop-scroll[data-v-066f8628] {\n  padding: 15px 10px;\n  background-color: var(--cl-foreground-solid);\n}\n.dropdown .dropdown-pop-default[data-v-066f8628] {\n  cursor: pointer;\n  display: flex;\n  flex-direction: var(--1dd3494f);\n  gap: 5px;\n}\n.dropdown .dropdown-pop-default-element[data-v-066f8628] {\n  border-radius: 10px;\n  border: 2px solid transparent;\n  padding: 5px 15px;\n}\n.dropdown .dropdown-pop-default-element.active[data-v-066f8628] {\n  background-color: var(--cl-foreground-active);\n}\n.dropdown .dropdown-pop-default-element.focus[data-v-066f8628] {\n  border-color: var(--cl-border-hover);\n}\n.dropdown.disabled[data-v-066f8628] {\n  opacity: 0.5;\n  pointer-events: none;\n  cursor: not-allowed;\n}\n.dropdown.small .dropdown-pop[data-v-066f8628] {\n  padding: 5px;\n}\n.dropdown.small .dropdown-pop-default[data-v-066f8628] {\n  gap: 5px;\n}\n.dropdown.small .dropdown-pop-default-element[data-v-066f8628] {\n  padding: 0 5px;\n}\n"]],["__scopeId","data-v-066f8628"],["__file","form-dropdown.vue"]])},93196:(e,n,o)=>{o.d(n,{A:()=>d});var a=o(20641),t=o(90033);const r=(0,a.pM)({__name:"hr",props:{size:{type:String,default:"normal"},padding:{type:String,default:"full"},direction:{type:String,default:"bottom"}},setup:e=>(n,o)=>((0,a.uX)(),(0,a.CE)("hr",{class:(0,t.C4)(["hr",[e.size,e.padding,e.direction].join(" ")])},null,2))}),d=(0,o(66262).A)(r,[["styles",["/* stylelint-disable prettier/prettier */\n/* Aspect ratios */\n/* Transitions */\n/* Typography */\n/* Shadows */\n/* Fonts */\n@keyframes skeleton-loading-malsync-9debe5b8 {\nto {\n    transform: translateX(100%);\n}\n}\n.hr[data-v-9debe5b8] {\n  margin-top: 0;\n  margin-bottom: var(--size-spacer);\n  border: none;\n  border-top: 2px solid var(--cl-backdrop);\n  width: 100%;\n}\n.hr.thin[data-v-9debe5b8] {\n  border-top-width: 1px;\n}\n.hr.both[data-v-9debe5b8] {\n  margin-top: var(--size-spacer);\n}\n.hr.half[data-v-9debe5b8] {\n  margin-bottom: var(--size-spacer-half);\n}\n.hr.half.both[data-v-9debe5b8] {\n  margin-top: var(--size-spacer-half);\n}\n"]],["__scopeId","data-v-9debe5b8"],["__file","hr.vue"]])}}]);
//# sourceMappingURL=8221.js.map