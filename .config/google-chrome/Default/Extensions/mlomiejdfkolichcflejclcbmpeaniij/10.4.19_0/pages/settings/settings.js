import { openTabWithUrl } from '../../utils/tabs.js';
import Session from '../../store/session.js';
import __vite_glob_0_19 from './views/privacy.js';
import __vite_glob_0_25 from './views/websites.js';
import __vite_glob_0_26 from './views/whotracksme.js';
import __vite_glob_0_17 from './views/account.js';
import __vite_glob_0_18 from './views/preview.js';
import __vite_glob_0_22 from './views/trackers.js';
import assets from './assets/index.js';
import router from '../../npm/hybrids/src/router.js';
import store from '../../npm/hybrids/src/store.js';
import { html } from '../../npm/hybrids/src/template/index.js';

const Settings = {
  stack: router([__vite_glob_0_19, __vite_glob_0_25, __vite_glob_0_26, __vite_glob_0_17, __vite_glob_0_18, __vite_glob_0_22]),
  session: store(Session),
  render: ({ stack, session }) => html`
    <template layout="contents">
      <settings-layout data-qa="page:settings">
        <a
          href="${router.url(__vite_glob_0_19)}"
          class="${{ active: router.active(__vite_glob_0_19) }}"
          slot="nav"
        >
          <ui-icon name="shield-menu" color="nav" layout="size:3"></ui-icon>
          Privacy protection
        </a>
        <a
          href="${router.url(__vite_glob_0_25)}"
          class="${{
    active: router.active(__vite_glob_0_25, { stack: true }) && !router.active(__vite_glob_0_22, { stack: true })
  }}"
          slot="nav"
        >
          <ui-icon name="websites" color="nav" layout="size:3"></ui-icon>
          Websites
        </a>
        <a
          href="${router.url(__vite_glob_0_22)}"
          class="${{
    active: router.active(__vite_glob_0_22, { stack: true })
  }}"
          slot="nav"
        >
          <ui-icon name="block-m" color="nav" layout="size:3"></ui-icon>
          Trackers
        </a>
        <a
          href="${router.url(__vite_glob_0_26)}"
          class="${{ active: router.active(__vite_glob_0_26), wrap: true }}"
          slot="nav"
          translate="no"
          data-qa="button:whotracksme"
        >
          <ui-icon name="wtm" color="nav" layout="size:3"></ui-icon>
          WhoTracks.Me
        </a>

        <a
          href="${router.url(__vite_glob_0_17)}"
          class="${{ active: router.active(__vite_glob_0_17), bottom: true }}"
          slot="nav"
        >
          ${store.ready(session) && session.user ? html`
                ${session.contributor ? html`<ui-icon name="contributor"></ui-icon>` : html`<ui-icon name="user" color="nav"></ui-icon>`}
                <span layout@992px="hidden">My Account</span>
                <div
                  layout="hidden"
                  layout@992px="column margin:left:2px width::0"
                >
                  <div>My Account</div>
                  <ui-text type="body-m" ellipsis>${session.email}</ui-text>
                </div>
              ` : html`<ui-icon name="user" color="nav"></ui-icon> My Account`}
        </a>
        ${store.ready(session) && html`
          <settings-card
            layout="hidden"
            layout@992px="
              area::6/7 self:end:stretch
              margin:top:2 padding:2 gap content:center
              column
            "
            slot="nav"
          >
            ${session.contributor ? html`
                  <img
                    src="${assets["contributor_badge"]}"
                    layout="size:12"
                    alt="Contribution"
                    slot="picture"
                  />
                  <div layout="column gap:0.5">
                    <ui-text type="label-l" layout="block:center">
                      You are awesome!
                    </ui-text>
                    <ui-text
                      type="body-s"
                      color="gray-600"
                      layout="block:center"
                    >
                      Thank you for your support in Ghostery's fight for a web
                      where privacy is a basic human right!
                    </ui-text>
                  </div>
                ` : html`
                  <img
                    src="${assets["hands"]}"
                    layout="size:12"
                    alt="Contribution"
                    slot="picture"
                  />
                  <div layout="column gap:0.5">
                    <ui-text type="label-l" layout="block:center">
                      Become a Contributor
                    </ui-text>
                    <ui-text
                      type="body-s"
                      color="gray-600"
                      layout="block:center"
                    >
                      Help Ghostery fight for a web where privacy is a basic
                      human right.
                    </ui-text>
                    <ui-button type="primary" layout="margin:top">
                      <a
                        href="https://www.ghostery.com/become-a-contributor?utm_source=gbe"
                        onclick="${openTabWithUrl}"
                      >
                        Become a Contributor
                      </a>
                    </ui-button>
                  </div>
                `}
          </settings-card>
        `}
        ${stack}
      </settings-layout>
    </template>
  `
};

export { Settings as default };
