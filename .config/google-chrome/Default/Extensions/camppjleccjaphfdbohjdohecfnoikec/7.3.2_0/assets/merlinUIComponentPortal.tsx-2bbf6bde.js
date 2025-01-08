import{h as m,j as e}from"./constants-e5712b98.js";import{T as i}from"./themeContext-b5ecfc73.js";import{c}from"./font-e4ec73e1.js";import{c as d}from"./index-0c67d257.js";import"./useMedia-c48a250e.js";const l=async()=>{if(document.getElementById("merlin-uicomponentportal"))return;const o=document.createElement("merlin-component");o.id="merlin-uicomponentportal",o.className="merlin merlin-uicomponentportal";const r=o.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`${d}
    :host(#merlin-uicomponentportal) {
    }   
    .reactAppRoot {
      all: initial; /* 1st rule so subsequent properties are reset. */
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483650;
    }
    `.replaceAll(":root",":host");const t=document.createElement("div");t.id="reactAppRoot",t.className="reactAppRoot",m.forEach(a=>{t.addEventListener(a,s=>{s.stopPropagation()})}),r.appendChild(n),r.appendChild(t);const p=c(t);document.documentElement.append(o),p.render(e.jsxs(e.Fragment,{children:[e.jsx(i,{children:e.jsx("div",{id:"reactAppRootWithTheme"})}),e.jsx(i,{websiteOverride:!0,children:e.jsx("div",{id:"reactAppRootWithWebsiteOverrideTheme"})})]}))};l();
