import router from '../../../npm/hybrids/src/router.js';
import { html } from '../../../npm/hybrids/src/template/index.js';

const __vite_glob_0_18 = {
  [router.connect]: { dialog: true },
  src: '',
  title: '',
  description: '',
  render: ({ src, title, description }) => html`
    <template layout="block">
      <settings-preview-dialog>
        <img src="${src}" />
        <div layout="block:center column gap:0.5" slot="footer">
          <ui-text type="headline-s">${title}</ui-text>
          <ui-text color="gray-600">${description}</ui-text>
        </div>
      </settings-preview-dialog>
    </template>
  `,
};

export { __vite_glob_0_18 as default };
