(()=>{"use strict";var t;!function(t){t.CHROME_EXTENSION_ID="CHROME_EXTENSION_ID",t.EXTN_PREFIX="EVENT_PREFIX",t.COLORS_GRAMMAR="COLORS_GRAMMAR",t.CARD_LAYOUT="CARD_LAYOUT",t.COLORS_SPELLING="COLORS_SPELLING",t.COLORS_STYLE="COLORS_LONG_SENTENCE",t.SUPPORTED_LANGUAGES="SUPPORTED_LANGUAGES",t.INSTALLED_ATTRIBUTE="INSTALLED_ATTRIBUTE",t.GDOCS_ATTRIBUTE="GDOCS_ATTRIBUTE",t.TWEAKS_ATTRIBUTE="TWEAKS_ATTRIBUTE",t.TMP_ID_ATTRIBUTE="TMP_ID_ATTRIBUTE",t.AI_RULE_ID_REGEX="AI_RULE_ID_REGEX",t.COLORS_PARAPHRASE="COLORS_PARAPHRASE",t.COLORS_RECOMMENDATION="COLORS_RECOMMENDATION",t.COLORS_RECOMMENDATION_TEASE="COLORS_RECOMMENDATION_TEASE",t.VALID_START_SENTENCE_REGEX="VALID_START_SENTENCE_REGEX",t.VALID_END_SENTENCE_REGEX="VALID_END_SENTENCE_REGEX",t.MULTI_SENTENCE_SELECTION_FOR_PARAPHRASE_ALLOWED="MULTI_SENTENCE_SELECTION_FOR_PARAPHRASE_ALLOWED",t.MAX_TEXT_LENGTH_ALLOWED_FOR_PAGELESS="MAX_TEXT_LENGTH_ALLOWED_FOR_PAGELESS",t.MAX_TEXT_LENGTH_ALLOWED="MAX_TEXT_LENGTH_ALLOWED",t.SELECTED_UNDERLINE_THICKNESS="SELECTED_UNDERLINE_THICKNESS",t.BULLET_POINT_PARSING_PREFIX="BULLET_POINT_PARSING_PREFIX",t.TOOLBAR_SIZE="TOOLBAR_SIZE",t.FIX_ALL_CONFIG="FIX_ALL_CONFIG",t.IGNORE_EDITOR_WITH_ATTRIBUTES="IGNORE_EDITOR_WITH_ATTRIBUTES",t.SHOW_TOOLBAR_ON_EMPTY_INPUT_AREA="SHOW_TOOLBAR_ON_EMPTY_INPUT_AREA",t.MAIN_CONTENT_SCRIPT_FILENAME="MAIN_CONTENT_SCRIPT_FILENAME",t.SPECIAL_INTRODUCTORY_TEASER_ENABLED="SPECIAL_INTRODUCTORY_TEASER_ENABLED",t.TERMS_OF_SERVICE_MODAL_ENABLED="TERMS_OF_SERVICE_MODAL_ENABLED",t.LOLLIPOP_CONFIG="LOLLIPOP_CONFIG"}(t||(t={}));const E={[t.CHROME_EXTENSION_ID]:"oldceeleldhonbafppcapldpdifcinji",[t.EXTN_PREFIX]:"lt",[t.COLORS_GRAMMAR]:{UNDERLINE:"#f2b24c",SELECTED_UNDERLINE:"#f2b24c",BACKGROUND:"rgba(242,179,77,0.3)",EMPHASIZE:"rgba(241,179,76,0.1)"},[t.COLORS_SPELLING]:{UNDERLINE:"#EB5757",SELECTED_UNDERLINE:"#EB5757",BACKGROUND:"rgba(235,88,88,0.2)",EMPHASIZE:"rgba(239,88,88,0.1)"},[t.COLORS_STYLE]:{UNDERLINE:"#8F7FFF",SELECTED_UNDERLINE:"#8F7FFF",BACKGROUND:"rgba(142,128,255,0.2)",EMPHASIZE:"rgba(138,128,255,0.2)",TITLE:"#5C4CFF"},[t.COLORS_PARAPHRASE]:{UNDERLINE:"#8F7FFF",BACKGROUND:"rgba(142,128,255,0.2)",EMPHASIZE:"rgba(138,128,255,0.2)",TITLE:"#5C4CFF"},[t.COLORS_RECOMMENDATION]:{UNDERLINE:"#80B3E2",SELECTED_UNDERLINE:"#0067C5",BACKGROUND:"rgba(0, 103, 199, 0.16)",EMPHASIZE:"rgba(0, 103, 199, 0.16)"},[t.COLORS_RECOMMENDATION_TEASE]:{UNDERLINE:"#f4c03e",SELECTED_UNDERLINE:"#F2B518",BACKGROUND:"rgba(242,181,24,0.16)",EMPHASIZE:"rgba(242,181,24,0.16)"},[t.SUPPORTED_LANGUAGES]:["ar","ast-es","be-by","br-fr","ca-es","ca-es-valencia","da-dk","de-at","de-ch","de-de","el-gr","en-au","en-ca","en-gb","en-nz","en-us","en-za","eo","es","fa","ga-ie","fr","gl-es","it","ja-jp","km-kh","nl","no","pl-pl","pt-ao","pt-br","pt-mz","pt-pt","ro-ro","ru-ru","sk-sk","sl-si","sv","ta-in","tl-ph","uk-ua","zh-cn"],[t.CARD_LAYOUT]:{TARGET_BOX_HORIZONTAL_MARGIN:0,TARGET_BOX_VERTICAL_MARGIN:5,HEADER_HEIGHT:36,FOOTER_HEIGHT:36,KEYBOARD_HINT_HEIGHT:60,MIN_HEIGHT_PARAPHRASE:200,MIN_HEIGHT_TOOLBOX:230,MAX_HEIGHT_TOOLBOX:372},[t.INSTALLED_ATTRIBUTE]:"data-lt-installed",[t.GDOCS_ATTRIBUTE]:"data-lt-site",[t.TWEAKS_ATTRIBUTE]:"data-lt-tweaks",[t.TMP_ID_ATTRIBUTE]:"data-lt-tmp-id",[t.AI_RULE_ID_REGEX]:/^(QB|AI)_/,[t.VALID_START_SENTENCE_REGEX]:"[¿¡(@]",[t.VALID_END_SENTENCE_REGEX]:"[?!.,)…:;‽]",[t.MULTI_SENTENCE_SELECTION_FOR_PARAPHRASE_ALLOWED]:!1,[t.MAX_TEXT_LENGTH_ALLOWED_FOR_PAGELESS]:Number.MAX_SAFE_INTEGER,[t.MAX_TEXT_LENGTH_ALLOWED]:1e4,[t.SELECTED_UNDERLINE_THICKNESS]:2,[t.BULLET_POINT_PARSING_PREFIX]:"• ",[t.TOOLBAR_SIZE]:{width:20,height:20},[t.FIX_ALL_CONFIG]:{FIX_GC_ERRORS:!0,FIX_RECOMMENDATIONS:!1,FIX_STYLE_ERRORS:!1},[t.IGNORE_EDITOR_WITH_ATTRIBUTES]:["spellcheck"],[t.SHOW_TOOLBAR_ON_EMPTY_INPUT_AREA]:!1,[t.MAIN_CONTENT_SCRIPT_FILENAME]:"/content.js",[t.SPECIAL_INTRODUCTORY_TEASER_ENABLED]:!0,[t.TERMS_OF_SERVICE_MODAL_ENABLED]:!0,[t.LOLLIPOP_CONFIG]:{LOLLIPOP_FREEZE_STATE_COLOR:"purple",TOOLBOX_CSS_PATH:"/content/styles/toolbox.css",LOLLIPOP_CSS_PATH:"/content/styles/lollipop.css",ONBOARDING_IMAGE_PATH:"/assets/images/toolbox/lollipop-onboarding-lt.svg",ONBOARDING_BORDER_RADIUS:"5px",LOLLIPOP_CIRCLE_IMAGE_PATH:"/assets/images/toolbox/lollipop-icon.svg",SUPPORTS_DARK_MODE:!0}};class e{constructor(){this.extnConfig=E}static getInstance(){return this.instance||self._qb_lt_config||(this.instance=new e,self._qb_lt_config=this.instance),this.instance||self._qb_lt_config}get(t){return this.extnConfig[t]}set(t,E){this.extnConfig[t]=E}setAll(t){this.extnConfig=t}getAll(){return this.extnConfig}}const _=e.getInstance();document.documentElement.setAttribute("data-"+_.get(t.EXTN_PREFIX)+"-ready","true");const n=_.get(t.CHROME_EXTENSION_ID);try{self._docs_annotate_canvas_by_ext=n;const t=self.chrome;self.chrome=self.chrome||{},self.chrome.runtime=self.chrome.runtime||{};const E=self.chrome.runtime.sendMessage;self.chrome.runtime.sendMessage=function(...e){const[_]=e;if(_!==n)return E.apply(this,e);t||delete self.chrome}}catch(t){}const s="#dd0000",T="#4285f4",R="#fce8e6",o="#e8f0fe",O=/rgba\(31,\s*161,\s*93,\s*0\.|rgba\(255,\s*0,\s*122,\s*0\.|rgba\(0,\s*163,\s*187,\s*0\.|rgba\(119,\s*119,\s*119,\s*0\.|rgba\(19,\s*115,\s*51,\s*0\.|rgba\(184,\s*6,\s*114,\s*0\.|rgba\(147,\s*52,\s*230,\s*0\.|rgba\(163,\s*90,\s*0,\s*0\./i,A=document.getElementsByTagName(_.get(t.EXTN_PREFIX)+"-gdocs-disabled");function I(){return!!A.length}let L=!1;const N=[];function r(t,E,e){var _;_=()=>{const _=new CustomEvent(E,{detail:e,bubbles:!0});t.dispatchEvent(_)},L?_():N.push(_)}document.addEventListener(_.get(t.EXTN_PREFIX)+"-gdocs-init",(()=>{N.forEach((t=>t())),N.length=0,L=!0}));const a=new Map,i=new Map,S=CanvasRenderingContext2D.prototype.moveTo;CanvasRenderingContext2D.prototype.moveTo=function(...t){const[E,e]=t;return a.set(this,{x:E,y:e}),S.apply(this,t)};const c=CanvasRenderingContext2D.prototype.lineTo;CanvasRenderingContext2D.prototype.lineTo=function(...E){const[e,n]=E,R=this.strokeStyle.toString(),o=a.get(this);a.set(this,{x:e,y:n});if([s,T].includes(R.toLowerCase())&&!I())return;if(o?.y===n&&O.test(R)&&!I()){let E=i.get(this);E||(E=[],i.set(this,E));const{a:s,d:T,e:R,f:O}=this.getTransform(),A=Math.min(o.x,e)*s+R,I=Math.max(o.x,e)*s+R,L=n*T+O-this.lineWidth/2,N=n*T+O+this.lineWidth/2;E.push({left:A,right:I,top:L,bottom:N}),this.canvas&&r(this.canvas,_.get(t.EXTN_PREFIX)+"-strikethroughchange",{strikethroughLines:E})}return c.apply(this,E)};const C=CanvasRenderingContext2D.prototype.fillRect;CanvasRenderingContext2D.prototype.fillRect=function(...t){const E=this.fillStyle.toString();if(!([R,o].includes(E.toLowerCase())&&!I()))return C.apply(this,t)};const l=CanvasRenderingContext2D.prototype.clearRect;CanvasRenderingContext2D.prototype.clearRect=function(...E){const[e,n,s,T]=E;let R=i.get(this);if(R&&!I()){const{a:E,d:o,e:O,f:A}=this.getTransform(),I=e*E+O,L=n*o+A,N={top:L,left:I,bottom:L+T*o,right:I+s*E},a=R.length;R=R.filter((t=>{return e=N,!!((E=t).left>e.right||E.right<e.left||E.top>e.bottom||E.bottom<e.top);var E,e})),a!==R.length&&(i.set(this,R),r(this.canvas,_.get(t.EXTN_PREFIX)+"-strikethroughchange",{strikethroughLines:R}))}return l.apply(this,E)};const D=CanvasRenderingContext2D.prototype.stroke;CanvasRenderingContext2D.prototype.stroke=function(...t){const[E]=t;if(E){const t=this.strokeStyle.toString();if([s,T].includes(t.toLowerCase())&&!I())return}return D.apply(this,t)};let g=null;function P(){try{if(null===g&&(g=function(){const t=self.KX_kixApp;if(!t)return null;const E=[[t,["KX_kixApp"]]],e=new Set([t]);for(const[t,_]of E){const n=Object.getOwnPropertyNames(t);for(const s of n)try{const n=t[s];if("string"==typeof n&&n.startsWith(""))return _.concat(s);!(!(_.length<20&&n instanceof Object)||n instanceof Node||n instanceof Window||n instanceof RegExp||n instanceof Date||n instanceof Map||Array.isArray(n)||e.has(n))&&(e.add(n),E.push([n,_.concat(s)]))}catch(t){}}return null}()),null===g)return"";let t=self;for(const E of g)t=t[E];if("string"==typeof t)return t}catch(t){}return""}document.addEventListener("LanguageTool-getFullText",(t=>{try{const E=t.detail?.datasetPropName;E&&(document.body.dataset[E]=P())}catch(t){}}))})();