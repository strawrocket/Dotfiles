import{a as t,L as e,d as a}from"./index-5ad58ea9.js";import"./constants-e5712b98.js";const i={matches:["https://rentry.co/"]},c=async()=>{const r=document.querySelector(".CodeMirror-code"),o=await e.get("rentryMarkdown");o&&a(r,o),e.remove("rentryMarkdown")};(async()=>{try{await t(".CodeMirror-code"),c()}catch(r){console.error("Error in content script",(r==null?void 0:r.message)||"")}})();export{i as config};