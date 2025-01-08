/* empty css                  */
import '../../ui/localize.js';
import '../../ui/elements.js';
import './elements.js';
/* empty css           */
import Main from './views/main.js';
import mount from '../../npm/hybrids/src/mount.js';
import router from '../../npm/hybrids/src/router.js';
import { html } from '../../npm/hybrids/src/template/index.js';

mount(document.body, {
  stack: router([Main]),
  render: ({ stack }) => html`
    <template layout="row width:full:350px">${stack}</template>
  `
});
chrome.runtime.sendMessage({ action: "telemetry", event: "engaged" });
chrome.runtime.sendMessage({ action: "syncOptions" });
document.addEventListener("click", (event) => {
  let el = event.target;
  while (el && !el.href) el = el.parentElement;
  if (!el) return;
  if (el.origin !== location.origin || el.pathname !== location.pathname) {
    setTimeout(window.close, 50);
  }
});
