!function(){let e,n,t=new Promise((e=>{n=e})),o=null;function a(){e=chrome.runtime.connect(),console.log("ccugame extension connected"),n(),e.onDisconnect.addListener((function(){console.log('ccugame extension disconnected (chrome "bug"), reconnecting'),t=new Promise((e=>{n=e})),a()})),e.onMessage.addListener((function(e){o=null,window.postMessage({type:"ccugameAppIntegrationResponse",message:e},"https://ccugame.app")})),null!=o&&e.postMessage(o)}function c(){a(),window.addEventListener("message",(async function(n){n.source===window&&n.data&&"ccugameAppIntegrationRequest"===n.data.type&&(await t,o=n.data.message,e.postMessage(n.data.message))}),!1);const n=document.createElement("meta");n.setAttribute("name","__ccugame_app_integration"),(document.head||document.documentElement).appendChild(n)}window.addEventListener("DOMContentLoaded",(e=>{c()}))}();