var yt=Object.defineProperty;var bt=(o,t,e)=>t in o?yt(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var ie=(o,t,e)=>(bt(o,typeof t!="symbol"?t+"":t,e),e);import{r as n,j as c,b as je}from"./constants-e5712b98.js";import{a as Nt,c as L,d as Tt,S as Me,b as $}from"./button-e2ac6183.js";import{J as Ae,R as Et}from"./index-5ad58ea9.js";import{v as Ee}from"./v4-4a60fe23.js";import{f as Pt,F as Rt,g as _t}from"./zod-24415ea2.js";import{P as O,c as jt,e as De,A as Mt,a as D,f as Q,D as At,C as Dt,g as Ne,h as Lt,i as Ft,d as Pe,R as kt,j as Ot}from"./index-fe9d96fe.js";import{c as Bt,h as Vt,a as Ht,R as Ut,F as Wt,u as Kt,b as Re,d as $t,e as Gt,f as zt,C as Yt}from"./Combination-0edb6dd9.js";import{u as Qt}from"./index-9ef95a97.js";import{V as Xt}from"./index-3da7154a.js";class Zt{constructor(){ie(this,"elements",{});ie(this,"head",0);ie(this,"tail",0);this.elements={},this.head=0,this.tail=0}push(t){this.elements[this.tail]=t,this.tail++}pop(){const t=this.elements[this.head];return delete this.elements[this.head],this.head++,t}peek(){return this.elements[this.head]}get length(){return this.tail-this.head}get isEmpty(){return this.length===0}}function qt(o=[]){const t=n.useRef(),[e,a]=n.useState([]),r=s=>t.current.findIndex(p=>p.id===s),i=n.useCallback(s=>{const p=e.findIndex(R=>R.id===s);let x=[];p!==-1&&(x=e.filter((R,C)=>C<=p));const v=[];for(;s;){const R=t.current.filter(C=>C.parentId===s);if(R.length>0){const C=t.current.findIndex(V=>V.id===s),j=t.current[C].activeChildIdx,A=R[j];v.push({...A,idx:j,totSiblings:t.current[C].totalChildren}),s=A==null?void 0:A.id}else s=null}a([...x,...v])},[e]),d=n.useCallback(()=>{const s=new Zt;for(t.current.forEach((x,v)=>t.current[v]={...x,activeChildIdx:0,totalChildren:0}),s.push(t.current[0]);!s.isEmpty;){const x=s.pop(),v=t.current.filter(C=>C.parentId===x.id),R=r(x.id);if(R>=0){const C=t.current[R];C.totalChildren=v.length}v.map(C=>s.push(C))}const p=[t.current[0]];for(const x of t.current)if(x.parentId==="root"){p.push(x);break}if(p.length>1){let x=p[1].id;for(;x;){const v=t.current.findIndex(R=>R.parentId===x);v!==-1?(p.push(t.current[v]),x=t.current[v].id):x=null}}i("root")},[i]);n.useEffect(()=>{t.current=[{activeChildIdx:0,id:"root",totalChildren:0},...o],d()},[]);const l=n.useCallback(s=>{t.current=[{activeChildIdx:0,id:"root",parentId:null,role:"system",status:"SUCCESS",totalChildren:0},...s],d()},[d]),u=n.useCallback(s=>{var p;s.parentId||(s.parentId=((p=e[e.length-1])==null?void 0:p.id)??"root"),t.current.push({...s,activeChildIdx:0,totalChildren:0}),t.current[r(s.parentId)].totalChildren+=1,i(s.parentId)},[e,i]),f=n.useCallback(s=>{var p;s[0].parentId||(s[0].parentId=((p=e[e.length-1])==null?void 0:p.id)??"root"),s.forEach((x,v)=>{v>0&&(x.parentId=s[v-1].id)}),s.forEach(x=>{t.current.push({...x,activeChildIdx:0,totalChildren:0}),t.current[r(x.parentId)].totalChildren+=1}),i("root")},[e,i]),w=n.useCallback((s,p)=>{const x=r(s),v=t.current[x];t.current[x]=p(v),i("root")},[i]),I=n.useCallback((s,p)=>{t.current.push({...p,activeChildIdx:0,totalChildren:0});const x=r(s),v=t.current[x];v.totalChildren+=1,v.activeChildIdx=v.totalChildren-1,i(s)},[i]),T=n.useCallback((s,p)=>{var R;p[0].parentId||(p[0].parentId=((R=e[e.length-1])==null?void 0:R.id)??"root"),p.forEach((C,j)=>{j>0&&(C.parentId=p[j-1].id)}),p.forEach(C=>{t.current.push({...C,activeChildIdx:0,totalChildren:0}),t.current[r(C.parentId)].totalChildren+=1});const x=r(s),v=t.current[x];v.activeChildIdx=v.totalChildren-1,i(s)},[e,i]),E=()=>t.current[t.current.length-1],m=n.useCallback(s=>{const p=t.current[r(s.parentId)];p.activeChildIdx>0&&(p.activeChildIdx-=1,i(s.parentId))},[i]),S=n.useCallback(s=>{const p=t.current[r(s.parentId)];p.activeChildIdx<p.totalChildren-1&&(p.activeChildIdx+=1,i(s.parentId))},[i]),y=n.useCallback(()=>{const s=t.current.pop(),p=t.current[r(s.parentId)];return p.totalChildren-=1,p.activeChildIdx>=p.totalChildren&&(p.activeChildIdx=p.totalChildren-1<0?0:p.totalChildren-1),i("root"),{...s,idx:0,totSiblings:0}},[i]),g=n.useCallback(()=>{var s;return((s=t.current)==null?void 0:s.length)-1},[]);return n.useMemo(()=>({activeThread:e,appendMessageNode:u,appendMessageThread:f,deleteLastMessage:y,editMessageNodeById:w,getLastMessage:E,insertMessageNode:I,insertMessageThread:T,reInitialize:l,switchLeft:m,switchRight:S,totalMessages:g}),[e,u,f,y,w,I,T,l,m,S,g])}async function Jt(o){var t;try{return(await Ae.post("/user/generateSignedUrlFiles",o)).data}catch(e){throw console.error("Error uploading file",((t=e.response)==null?void 0:t.data)||e.message),e}}async function eo(o,t,e){var a;try{return(await Et.put(t,o,{headers:{"Content-Type":e}})).data}catch(r){throw console.error("Error uploading file",((a=r.response)==null?void 0:a.data)||r.message),r}}async function _e(o,t){var e;try{return(await Ae.post("/thread/unified/upload",{attachment:t,chatId:o,language:"ENGLISH"})).data}catch(a){throw console.error("Error uploading file",((e=a.response)==null?void 0:e.data)||a.message),a}}const to=(o,t)=>Nt({mutationFn:async({isLink:a,userUploadRequestFiles:r})=>{if(a){await _e(o,r[0]);return}const d=(await Jt({files:r.map(l=>({id:l.id,name:l.name,type:l.type}))})).signedUrls;return await Promise.all(r.map(l=>eo(l.file,d[l.id].url,l.type))),await Promise.all(r.map(l=>_e(o,{id:l.id,metadata:{format:l.type,gcsId:d[l.id].fileName,isLastMessage:!0,isStale:!1},textContent:l.name,type:"FILE",url:d[l.id].url}))),{files:r.map(l=>({id:l.id,metadata:{format:l.type,gcsId:d[l.id].fileName,isLastMessage:!0,isStale:!1},textContent:l.name,type:"FILE",url:d[l.id].url}))}}});function Zo({chatArray:o=[],initChatId:t=Ee(),initConfig:e={aspectRatio:"16:9",model:"GPT 3",numImages:1,webAccessMode:{id:"off",name:"Off"}},initContext:a="",initQuestions:r=[]}={}){const i=qt(o),[d,l]=n.useState(r),[u,f]=n.useState(!0),[w=e,I]=n.useState(e),[T,E]=n.useState(null),[m,S]=n.useState({}),[y,g]=n.useState(t),[s,p]=n.useState(null),[x,v]=n.useState(a),[R,C]=n.useState([]),[j,A]=n.useState([]),[V,H]=n.useState("default"),F=to(y),U=n.useCallback(({chatArray:K=[],chatId:M=Ee(),context:B="",initConfig:W={aspectRatio:"1:1",model:"GPT 3",numImages:1,webAccessMode:{id:"off",name:"Off"}},initQuestions:z=[]})=>{i.reInitialize(K),l(z),I(W),g(M),v(B),p(null),f(!0),A([]),H("default"),C([])},[i]);return n.useMemo(()=>({...i,attachments:R,chatId:y,chatbot:s,config:w,context:x,error:T,fileUIState:V,isPromptingAvailable:u,metadata:m,questions:d,reset:U,setAttachments:C,setChatId:g,setChatbot:p,setConfig:I,setContext:v,setError:E,setFileUIState:H,setIsPromptingAvailable:f,setMetadata:S,setQuestions:l,setUploadedFiles:A,uploadFilesUnifiedChatMutation:F,uploadedFiles:j}),[y,s,w,x,T,u,m,d,U,i,V,H,j,A,F,C,R])}function qo({className:o,...t}){return c.jsx("div",{className:L("bg-primary/10 animate-pulse rounded-md",o),...t})}var oo="Label",Le=n.forwardRef((o,t)=>c.jsx(O.label,{...o,ref:t,onMouseDown:e=>{var r;e.target.closest("button, input, select, textarea")||((r=o.onMouseDown)==null||r.call(o,e),!e.defaultPrevented&&e.detail>1&&e.preventDefault())}}));Le.displayName=oo;var Fe=Le;const no=Tt("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),ke=n.forwardRef(({className:o,...t},e)=>c.jsx(Fe,{ref:e,className:L(no(),o),...t}));ke.displayName=Fe.displayName;const Jo=Rt,Oe=n.createContext({}),en=({...o})=>c.jsx(Oe.Provider,{value:{name:o.name},children:c.jsx(_t,{...o})}),de=()=>{const o=n.useContext(Oe),t=n.useContext(Be),{getFieldState:e,formState:a}=Pt(),r=e(o.name,a);if(!o)throw new Error("useFormField should be used within <FormField>");const{id:i}=t;return{id:i,name:o.name,formItemId:`${i}-form-item`,formDescriptionId:`${i}-form-item-description`,formMessageId:`${i}-form-item-message`,...r}},Be=n.createContext({}),ro=n.forwardRef(({className:o,...t},e)=>{const a=n.useId();return c.jsx(Be.Provider,{value:{id:a},children:c.jsx("div",{ref:e,className:L("space-y-2",o),...t})})});ro.displayName="FormItem";const so=n.forwardRef(({className:o,...t},e)=>{const{error:a,formItemId:r}=de();return c.jsx(ke,{ref:e,className:L(a&&"text-destructive",o),htmlFor:r,...t})});so.displayName="FormLabel";const ao=n.forwardRef(({...o},t)=>{const{error:e,formItemId:a,formDescriptionId:r,formMessageId:i}=de();return c.jsx(Me,{ref:t,id:a,"aria-describedby":e?`${r} ${i}`:`${r}`,"aria-invalid":!!e,...o})});ao.displayName="FormControl";const lo=n.forwardRef(({className:o,...t},e)=>{const{formDescriptionId:a}=de();return c.jsx("p",{ref:e,id:a,className:L("text-muted-foreground text-[0.8rem]",o),...t})});lo.displayName="FormDescription";const io=n.forwardRef(({className:o,children:t,...e},a)=>{const{error:r,formMessageId:i}=de(),d=r?String(r==null?void 0:r.message):t;return d?c.jsx("p",{ref:a,id:i,className:L("text-destructive text-[0.8rem] font-medium",o),...e,children:d}):null});io.displayName="FormMessage";var co=[" ","Enter","ArrowUp","ArrowDown"],uo=[" ","Enter"],se="Select",[ue,pe,po]=Bt(se),[oe,tn]=jt(se,[po,De]),fe=De(),[fo,X]=oe(se),[mo,ho]=oe(se),Ve=o=>{const{__scopeSelect:t,children:e,open:a,defaultOpen:r,onOpenChange:i,value:d,defaultValue:l,onValueChange:u,dir:f,name:w,autoComplete:I,disabled:T,required:E}=o,m=fe(t),[S,y]=n.useState(null),[g,s]=n.useState(null),[p,x]=n.useState(!1),v=Kt(f),[R=!1,C]=Pe({prop:a,defaultProp:r,onChange:i}),[j,A]=Pe({prop:d,defaultProp:l,onChange:u}),V=n.useRef(null),H=S?!!S.closest("form"):!0,[F,U]=n.useState(new Set),K=Array.from(F).map(M=>M.props.value).join(";");return c.jsx(kt,{...m,children:c.jsxs(fo,{required:E,scope:t,trigger:S,onTriggerChange:y,valueNode:g,onValueNodeChange:s,valueNodeHasChildren:p,onValueNodeHasChildrenChange:x,contentId:Ne(),value:j,onValueChange:A,open:R,onOpenChange:C,dir:v,triggerPointerDownPosRef:V,disabled:T,children:[c.jsx(ue.Provider,{scope:t,children:c.jsx(mo,{scope:o.__scopeSelect,onNativeOptionAdd:n.useCallback(M=>{U(B=>new Set(B).add(M))},[]),onNativeOptionRemove:n.useCallback(M=>{U(B=>{const W=new Set(B);return W.delete(M),W})},[]),children:e})}),H?c.jsxs(ut,{"aria-hidden":!0,required:E,tabIndex:-1,name:w,autoComplete:I,value:j,onChange:M=>A(M.target.value),disabled:T,children:[j===void 0?c.jsx("option",{value:""}):null,Array.from(F)]},K):null]})})};Ve.displayName=se;var He="SelectTrigger",Ue=n.forwardRef((o,t)=>{const{__scopeSelect:e,disabled:a=!1,...r}=o,i=fe(e),d=X(He,e),l=d.disabled||a,u=$(t,d.onTriggerChange),f=pe(e),[w,I,T]=pt(m=>{const S=f().filter(s=>!s.disabled),y=S.find(s=>s.value===d.value),g=ft(S,m,y);g!==void 0&&d.onValueChange(g.value)}),E=()=>{l||(d.onOpenChange(!0),T())};return c.jsx(Mt,{asChild:!0,...i,children:c.jsx(O.button,{type:"button",role:"combobox","aria-controls":d.contentId,"aria-expanded":d.open,"aria-required":d.required,"aria-autocomplete":"none",dir:d.dir,"data-state":d.open?"open":"closed",disabled:l,"data-disabled":l?"":void 0,"data-placeholder":dt(d.value)?"":void 0,...r,ref:u,onClick:D(r.onClick,m=>{m.currentTarget.focus()}),onPointerDown:D(r.onPointerDown,m=>{const S=m.target;S.hasPointerCapture(m.pointerId)&&S.releasePointerCapture(m.pointerId),m.button===0&&m.ctrlKey===!1&&(E(),d.triggerPointerDownPosRef.current={x:Math.round(m.pageX),y:Math.round(m.pageY)},m.preventDefault())}),onKeyDown:D(r.onKeyDown,m=>{const S=w.current!=="";!(m.ctrlKey||m.altKey||m.metaKey)&&m.key.length===1&&I(m.key),!(S&&m.key===" ")&&co.includes(m.key)&&(E(),m.preventDefault())})})})});Ue.displayName=He;var We="SelectValue",Ke=n.forwardRef((o,t)=>{const{__scopeSelect:e,className:a,style:r,children:i,placeholder:d="",...l}=o,u=X(We,e),{onValueNodeHasChildrenChange:f}=u,w=i!==void 0,I=$(t,u.onValueNodeChange);return Q(()=>{f(w)},[f,w]),c.jsx(O.span,{...l,ref:I,style:{pointerEvents:"none"},children:dt(u.value)?c.jsx(c.Fragment,{children:d}):i})});Ke.displayName=We;var go="SelectIcon",$e=n.forwardRef((o,t)=>{const{__scopeSelect:e,children:a,...r}=o;return c.jsx(O.span,{"aria-hidden":!0,...r,ref:t,children:a||"▼"})});$e.displayName=go;var xo="SelectPortal",Ge=o=>c.jsx(Ot,{asChild:!0,...o});Ge.displayName=xo;var ee="SelectContent",ze=n.forwardRef((o,t)=>{const e=X(ee,o.__scopeSelect),[a,r]=n.useState();if(Q(()=>{r(new DocumentFragment)},[]),!e.open){const i=a;return i?je.createPortal(c.jsx(Ye,{scope:o.__scopeSelect,children:c.jsx(ue.Slot,{scope:o.__scopeSelect,children:c.jsx("div",{children:o.children})})}),i):null}return c.jsx(Qe,{...o,ref:t})});ze.displayName=ee;var G=10,[Ye,Z]=oe(ee),vo="SelectContentImpl",Qe=n.forwardRef((o,t)=>{const{__scopeSelect:e,position:a="item-aligned",onCloseAutoFocus:r,onEscapeKeyDown:i,onPointerDownOutside:d,side:l,sideOffset:u,align:f,alignOffset:w,arrowPadding:I,collisionBoundary:T,collisionPadding:E,sticky:m,hideWhenDetached:S,avoidCollisions:y,...g}=o,s=X(ee,e),[p,x]=n.useState(null),[v,R]=n.useState(null),C=$(t,h=>x(h)),[j,A]=n.useState(null),[V,H]=n.useState(null),F=pe(e),[U,K]=n.useState(!1),M=n.useRef(!1);n.useEffect(()=>{if(p)return Vt(p)},[p]),Ht();const B=n.useCallback(h=>{const[_,...k]=F().map(N=>N.ref.current),[P]=k.slice(-1),b=document.activeElement;for(const N of h)if(N===b||(N==null||N.scrollIntoView({block:"nearest"}),N===_&&v&&(v.scrollTop=0),N===P&&v&&(v.scrollTop=v.scrollHeight),N==null||N.focus(),document.activeElement!==b))return},[F,v]),W=n.useCallback(()=>B([j,p]),[B,j,p]);n.useEffect(()=>{U&&W()},[U,W]);const{onOpenChange:z,triggerPointerDownPosRef:Y}=s;n.useEffect(()=>{if(p){let h={x:0,y:0};const _=P=>{var b,N;h={x:Math.abs(Math.round(P.pageX)-(((b=Y.current)==null?void 0:b.x)??0)),y:Math.abs(Math.round(P.pageY)-(((N=Y.current)==null?void 0:N.y)??0))}},k=P=>{h.x<=10&&h.y<=10?P.preventDefault():p.contains(P.target)||z(!1),document.removeEventListener("pointermove",_),Y.current=null};return Y.current!==null&&(document.addEventListener("pointermove",_),document.addEventListener("pointerup",k,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",_),document.removeEventListener("pointerup",k,{capture:!0})}}},[p,z,Y]),n.useEffect(()=>{const h=()=>z(!1);return window.addEventListener("blur",h),window.addEventListener("resize",h),()=>{window.removeEventListener("blur",h),window.removeEventListener("resize",h)}},[z]);const[me,ae]=pt(h=>{const _=F().filter(b=>!b.disabled),k=_.find(b=>b.ref.current===document.activeElement),P=ft(_,h,k);P&&setTimeout(()=>P.ref.current.focus())}),he=n.useCallback((h,_,k)=>{const P=!M.current&&!k;(s.value!==void 0&&s.value===_||P)&&(A(h),P&&(M.current=!0))},[s.value]),ge=n.useCallback(()=>p==null?void 0:p.focus(),[p]),te=n.useCallback((h,_,k)=>{const P=!M.current&&!k;(s.value!==void 0&&s.value===_||P)&&H(h)},[s.value]),le=a==="popper"?Ce:Xe,ne=le===Ce?{side:l,sideOffset:u,align:f,alignOffset:w,arrowPadding:I,collisionBoundary:T,collisionPadding:E,sticky:m,hideWhenDetached:S,avoidCollisions:y}:{};return c.jsx(Ye,{scope:e,content:p,viewport:v,onViewportChange:R,itemRefCallback:he,selectedItem:j,onItemLeave:ge,itemTextRefCallback:te,focusSelectedItem:W,selectedItemText:V,position:a,isPositioned:U,searchRef:me,children:c.jsx(Ut,{as:Me,allowPinchZoom:!0,children:c.jsx(Wt,{asChild:!0,trapped:s.open,onMountAutoFocus:h=>{h.preventDefault()},onUnmountAutoFocus:D(r,h=>{var _;(_=s.trigger)==null||_.focus({preventScroll:!0}),h.preventDefault()}),children:c.jsx(At,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:i,onPointerDownOutside:d,onFocusOutside:h=>h.preventDefault(),onDismiss:()=>s.onOpenChange(!1),children:c.jsx(le,{role:"listbox",id:s.contentId,"data-state":s.open?"open":"closed",dir:s.dir,onContextMenu:h=>h.preventDefault(),...g,...ne,onPlaced:()=>K(!0),ref:C,style:{display:"flex",flexDirection:"column",outline:"none",...g.style},onKeyDown:D(g.onKeyDown,h=>{const _=h.ctrlKey||h.altKey||h.metaKey;if(h.key==="Tab"&&h.preventDefault(),!_&&h.key.length===1&&ae(h.key),["ArrowUp","ArrowDown","Home","End"].includes(h.key)){let P=F().filter(b=>!b.disabled).map(b=>b.ref.current);if(["ArrowUp","End"].includes(h.key)&&(P=P.slice().reverse()),["ArrowUp","ArrowDown"].includes(h.key)){const b=h.target,N=P.indexOf(b);P=P.slice(N+1)}setTimeout(()=>B(P)),h.preventDefault()}})})})})})})});Qe.displayName=vo;var So="SelectItemAlignedPosition",Xe=n.forwardRef((o,t)=>{const{__scopeSelect:e,onPlaced:a,...r}=o,i=X(ee,e),d=Z(ee,e),[l,u]=n.useState(null),[f,w]=n.useState(null),I=$(t,C=>w(C)),T=pe(e),E=n.useRef(!1),m=n.useRef(!0),{viewport:S,selectedItem:y,selectedItemText:g,focusSelectedItem:s}=d,p=n.useCallback(()=>{if(i.trigger&&i.valueNode&&l&&f&&S&&y&&g){const C=i.trigger.getBoundingClientRect(),j=f.getBoundingClientRect(),A=i.valueNode.getBoundingClientRect(),V=g.getBoundingClientRect();if(i.dir!=="rtl"){const b=V.left-j.left,N=A.left-b,q=C.left-N,J=C.width+q,xe=Math.max(J,j.width),ve=window.innerWidth-G,Se=Re(N,[G,ve-xe]);l.style.minWidth=J+"px",l.style.left=Se+"px"}else{const b=j.right-V.right,N=window.innerWidth-A.right-b,q=window.innerWidth-C.right-N,J=C.width+q,xe=Math.max(J,j.width),ve=window.innerWidth-G,Se=Re(N,[G,ve-xe]);l.style.minWidth=J+"px",l.style.right=Se+"px"}const H=T(),F=window.innerHeight-G*2,U=S.scrollHeight,K=window.getComputedStyle(f),M=parseInt(K.borderTopWidth,10),B=parseInt(K.paddingTop,10),W=parseInt(K.borderBottomWidth,10),z=parseInt(K.paddingBottom,10),Y=M+B+U+z+W,me=Math.min(y.offsetHeight*5,Y),ae=window.getComputedStyle(S),he=parseInt(ae.paddingTop,10),ge=parseInt(ae.paddingBottom,10),te=C.top+C.height/2-G,le=F-te,ne=y.offsetHeight/2,h=y.offsetTop+ne,_=M+B+h,k=Y-_;if(_<=te){const b=y===H[H.length-1].ref.current;l.style.bottom="0px";const N=f.clientHeight-S.offsetTop-S.offsetHeight,q=Math.max(le,ne+(b?ge:0)+N+W),J=_+q;l.style.height=J+"px"}else{const b=y===H[0].ref.current;l.style.top="0px";const q=Math.max(te,M+S.offsetTop+(b?he:0)+ne)+k;l.style.height=q+"px",S.scrollTop=_-te+S.offsetTop}l.style.margin=`${G}px 0`,l.style.minHeight=me+"px",l.style.maxHeight=F+"px",a==null||a(),requestAnimationFrame(()=>E.current=!0)}},[T,i.trigger,i.valueNode,l,f,S,y,g,i.dir,a]);Q(()=>p(),[p]);const[x,v]=n.useState();Q(()=>{f&&v(window.getComputedStyle(f).zIndex)},[f]);const R=n.useCallback(C=>{C&&m.current===!0&&(p(),s==null||s(),m.current=!1)},[p,s]);return c.jsx(wo,{scope:e,contentWrapper:l,shouldExpandOnScrollRef:E,onScrollButtonChange:R,children:c.jsx("div",{ref:u,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:x},children:c.jsx(O.div,{...r,ref:I,style:{boxSizing:"border-box",maxHeight:"100%",...r.style}})})})});Xe.displayName=So;var Co="SelectPopperPosition",Ce=n.forwardRef((o,t)=>{const{__scopeSelect:e,align:a="start",collisionPadding:r=G,...i}=o,d=fe(e);return c.jsx(Dt,{...d,...i,ref:t,align:a,collisionPadding:r,style:{boxSizing:"border-box",...i.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})});Ce.displayName=Co;var[wo,Te]=oe(ee,{}),we="SelectViewport",Ze=n.forwardRef((o,t)=>{const{__scopeSelect:e,nonce:a,...r}=o,i=Z(we,e),d=Te(we,e),l=$(t,i.onViewportChange),u=n.useRef(0);return c.jsxs(c.Fragment,{children:[c.jsx("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:a}),c.jsx(ue.Slot,{scope:e,children:c.jsx(O.div,{"data-radix-select-viewport":"",role:"presentation",...r,ref:l,style:{position:"relative",flex:1,overflow:"auto",...r.style},onScroll:D(r.onScroll,f=>{const w=f.currentTarget,{contentWrapper:I,shouldExpandOnScrollRef:T}=d;if(T!=null&&T.current&&I){const E=Math.abs(u.current-w.scrollTop);if(E>0){const m=window.innerHeight-G*2,S=parseFloat(I.style.minHeight),y=parseFloat(I.style.height),g=Math.max(S,y);if(g<m){const s=g+E,p=Math.min(m,s),x=s-p;I.style.height=p+"px",I.style.bottom==="0px"&&(w.scrollTop=x>0?x:0,I.style.justifyContent="flex-end")}}}u.current=w.scrollTop})})})]})});Ze.displayName=we;var qe="SelectGroup",[Io,yo]=oe(qe),bo=n.forwardRef((o,t)=>{const{__scopeSelect:e,...a}=o,r=Ne();return c.jsx(Io,{scope:e,id:r,children:c.jsx(O.div,{role:"group","aria-labelledby":r,...a,ref:t})})});bo.displayName=qe;var Je="SelectLabel",et=n.forwardRef((o,t)=>{const{__scopeSelect:e,...a}=o,r=yo(Je,e);return c.jsx(O.div,{id:r.id,...a,ref:t})});et.displayName=Je;var ce="SelectItem",[No,tt]=oe(ce),ot=n.forwardRef((o,t)=>{const{__scopeSelect:e,value:a,disabled:r=!1,textValue:i,...d}=o,l=X(ce,e),u=Z(ce,e),f=l.value===a,[w,I]=n.useState(i??""),[T,E]=n.useState(!1),m=$(t,g=>{var s;return(s=u.itemRefCallback)==null?void 0:s.call(u,g,a,r)}),S=Ne(),y=()=>{r||(l.onValueChange(a),l.onOpenChange(!1))};if(a==="")throw new Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");return c.jsx(No,{scope:e,value:a,disabled:r,textId:S,isSelected:f,onItemTextChange:n.useCallback(g=>{I(s=>s||((g==null?void 0:g.textContent)??"").trim())},[]),children:c.jsx(ue.ItemSlot,{scope:e,value:a,disabled:r,textValue:w,children:c.jsx(O.div,{role:"option","aria-labelledby":S,"data-highlighted":T?"":void 0,"aria-selected":f&&T,"data-state":f?"checked":"unchecked","aria-disabled":r||void 0,"data-disabled":r?"":void 0,tabIndex:r?void 0:-1,...d,ref:m,onFocus:D(d.onFocus,()=>E(!0)),onBlur:D(d.onBlur,()=>E(!1)),onPointerUp:D(d.onPointerUp,y),onPointerMove:D(d.onPointerMove,g=>{var s;r?(s=u.onItemLeave)==null||s.call(u):g.currentTarget.focus({preventScroll:!0})}),onPointerLeave:D(d.onPointerLeave,g=>{var s;g.currentTarget===document.activeElement&&((s=u.onItemLeave)==null||s.call(u))}),onKeyDown:D(d.onKeyDown,g=>{var p;((p=u.searchRef)==null?void 0:p.current)!==""&&g.key===" "||(uo.includes(g.key)&&y(),g.key===" "&&g.preventDefault())})})})})});ot.displayName=ce;var re="SelectItemText",nt=n.forwardRef((o,t)=>{const{__scopeSelect:e,className:a,style:r,...i}=o,d=X(re,e),l=Z(re,e),u=tt(re,e),f=ho(re,e),[w,I]=n.useState(null),T=$(t,g=>I(g),u.onItemTextChange,g=>{var s;return(s=l.itemTextRefCallback)==null?void 0:s.call(l,g,u.value,u.disabled)}),E=w==null?void 0:w.textContent,m=n.useMemo(()=>c.jsx("option",{value:u.value,disabled:u.disabled,children:E},u.value),[u.disabled,u.value,E]),{onNativeOptionAdd:S,onNativeOptionRemove:y}=f;return Q(()=>(S(m),()=>y(m)),[S,y,m]),c.jsxs(c.Fragment,{children:[c.jsx(O.span,{id:u.textId,...i,ref:T}),u.isSelected&&d.valueNode&&!d.valueNodeHasChildren?je.createPortal(i.children,d.valueNode):null]})});nt.displayName=re;var rt="SelectItemIndicator",st=n.forwardRef((o,t)=>{const{__scopeSelect:e,...a}=o;return tt(rt,e).isSelected?c.jsx(O.span,{"aria-hidden":!0,...a,ref:t}):null});st.displayName=rt;var Ie="SelectScrollUpButton",at=n.forwardRef((o,t)=>{const e=Z(Ie,o.__scopeSelect),a=Te(Ie,o.__scopeSelect),[r,i]=n.useState(!1),d=$(t,a.onScrollButtonChange);return Q(()=>{if(e.viewport&&e.isPositioned){let l=function(){const f=u.scrollTop>0;i(f)};const u=e.viewport;return l(),u.addEventListener("scroll",l),()=>u.removeEventListener("scroll",l)}},[e.viewport,e.isPositioned]),r?c.jsx(it,{...o,ref:d,onAutoScroll:()=>{const{viewport:l,selectedItem:u}=e;l&&u&&(l.scrollTop=l.scrollTop-u.offsetHeight)}}):null});at.displayName=Ie;var ye="SelectScrollDownButton",lt=n.forwardRef((o,t)=>{const e=Z(ye,o.__scopeSelect),a=Te(ye,o.__scopeSelect),[r,i]=n.useState(!1),d=$(t,a.onScrollButtonChange);return Q(()=>{if(e.viewport&&e.isPositioned){let l=function(){const f=u.scrollHeight-u.clientHeight,w=Math.ceil(u.scrollTop)<f;i(w)};const u=e.viewport;return l(),u.addEventListener("scroll",l),()=>u.removeEventListener("scroll",l)}},[e.viewport,e.isPositioned]),r?c.jsx(it,{...o,ref:d,onAutoScroll:()=>{const{viewport:l,selectedItem:u}=e;l&&u&&(l.scrollTop=l.scrollTop+u.offsetHeight)}}):null});lt.displayName=ye;var it=n.forwardRef((o,t)=>{const{__scopeSelect:e,onAutoScroll:a,...r}=o,i=Z("SelectScrollButton",e),d=n.useRef(null),l=pe(e),u=n.useCallback(()=>{d.current!==null&&(window.clearInterval(d.current),d.current=null)},[]);return n.useEffect(()=>()=>u(),[u]),Q(()=>{var w;const f=l().find(I=>I.ref.current===document.activeElement);(w=f==null?void 0:f.ref.current)==null||w.scrollIntoView({block:"nearest"})},[l]),c.jsx(O.div,{"aria-hidden":!0,...r,ref:t,style:{flexShrink:0,...r.style},onPointerDown:D(r.onPointerDown,()=>{d.current===null&&(d.current=window.setInterval(a,50))}),onPointerMove:D(r.onPointerMove,()=>{var f;(f=i.onItemLeave)==null||f.call(i),d.current===null&&(d.current=window.setInterval(a,50))}),onPointerLeave:D(r.onPointerLeave,()=>{u()})})}),To="SelectSeparator",ct=n.forwardRef((o,t)=>{const{__scopeSelect:e,...a}=o;return c.jsx(O.div,{"aria-hidden":!0,...a,ref:t})});ct.displayName=To;var be="SelectArrow",Eo=n.forwardRef((o,t)=>{const{__scopeSelect:e,...a}=o,r=fe(e),i=X(be,e),d=Z(be,e);return i.open&&d.position==="popper"?c.jsx(Lt,{...r,...a,ref:t}):null});Eo.displayName=be;function dt(o){return o===""||o===void 0}var ut=n.forwardRef((o,t)=>{const{value:e,...a}=o,r=n.useRef(null),i=$(t,r),d=Qt(e);return n.useEffect(()=>{const l=r.current,u=window.HTMLSelectElement.prototype,w=Object.getOwnPropertyDescriptor(u,"value").set;if(d!==e&&w){const I=new Event("change",{bubbles:!0});w.call(l,e),l.dispatchEvent(I)}},[d,e]),c.jsx(Xt,{asChild:!0,children:c.jsx("select",{...a,ref:i,defaultValue:e})})});ut.displayName="BubbleSelect";function pt(o){const t=Ft(o),e=n.useRef(""),a=n.useRef(0),r=n.useCallback(d=>{const l=e.current+d;t(l),function u(f){e.current=f,window.clearTimeout(a.current),f!==""&&(a.current=window.setTimeout(()=>u(""),1e3))}(l)},[t]),i=n.useCallback(()=>{e.current="",window.clearTimeout(a.current)},[]);return n.useEffect(()=>()=>window.clearTimeout(a.current),[]),[e,r,i]}function ft(o,t,e){const r=t.length>1&&Array.from(t).every(f=>f===t[0])?t[0]:t,i=e?o.indexOf(e):-1;let d=Po(o,Math.max(i,0));r.length===1&&(d=d.filter(f=>f!==e));const u=d.find(f=>f.textValue.toLowerCase().startsWith(r.toLowerCase()));return u!==e?u:void 0}function Po(o,t){return o.map((e,a)=>o[(t+a)%o.length])}var Ro=Ve,mt=Ue,_o=Ke,jo=$e,Mo=Ge,ht=ze,Ao=Ze,gt=et,xt=ot,Do=nt,Lo=st,vt=at,St=lt,Ct=ct;const on=Ro,nn=_o,Fo=n.forwardRef(({children:o,className:t,...e},a)=>c.jsxs(mt,{ref:a,className:L("border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",t),...e,children:[o,c.jsx(jo,{asChild:!0,children:c.jsx($t,{className:"h-4 w-4 opacity-50"})})]}));Fo.displayName=mt.displayName;const wt=n.forwardRef(({className:o,...t},e)=>c.jsx(vt,{ref:e,className:L("flex cursor-default items-center justify-center py-1",o),...t,children:c.jsx(Gt,{})}));wt.displayName=vt.displayName;const It=n.forwardRef(({className:o,...t},e)=>c.jsx(St,{ref:e,className:L("flex cursor-default items-center justify-center py-1",o),...t,children:c.jsx(zt,{})}));It.displayName=St.displayName;const ko=n.forwardRef(({children:o,className:t,position:e="popper",...a},r)=>{const i=n.useMemo(()=>{const d=document.getElementById("merlin-uicomponentportal");return d?d.shadowRoot.getElementById("reactAppRoot"):document.body},[]);return c.jsx(Mo,{container:i,children:c.jsxs(ht,{ref:r,className:L("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md",e==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",t),position:e,...a,children:[c.jsx(wt,{}),c.jsx(Ao,{className:L("p-1",e==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:o}),c.jsx(It,{})]})})});ko.displayName=ht.displayName;const Oo=n.forwardRef(({className:o,...t},e)=>c.jsx(gt,{ref:e,className:L("px-2 py-1.5 text-sm font-semibold",o),...t}));Oo.displayName=gt.displayName;const Bo=n.forwardRef(({children:o,className:t,...e},a)=>c.jsxs(xt,{ref:a,className:L("focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",t),...e,children:[c.jsx("span",{className:"absolute right-2 flex h-3.5 w-3.5 items-center justify-center",children:c.jsx(Lo,{children:c.jsx(Yt,{className:"h-4 w-4"})})}),c.jsx(Do,{children:o})]}));Bo.displayName=xt.displayName;const Vo=n.forwardRef(({className:o,...t},e)=>c.jsx(Ct,{ref:e,className:L("bg-muted -mx-1 my-1 h-px",o),...t}));Vo.displayName=Ct.displayName;export{Jo as F,ke as L,qo as S,en as a,ro as b,so as c,on as d,Fo as e,nn as f,ko as g,Bo as h,ao as i,io as j,Zo as u};