
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'Angular-todo-app',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Angular-todo-app"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 511, hash: '8782bd3fecfb2782768c53fa04e07070051acf6bf8632d92ef96b09e2b8ad376', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1024, hash: 'ca240a9d5bad4b8c8fcffa9591bcbd21c4086a62cab47d8e9d7e717beb1f7eff', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 3812, hash: '37f17f4747e8925885dcb9136c4a5f5a7dedc7fd4ad9cb355c8fb57c52cdcc50', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
