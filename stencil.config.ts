import { Config } from '@stencil/core';
import { postcss } from '@stencil-community/postcss';
import postcssNesting from 'postcss-nesting';
import postcssCustomMedia from 'postcss-custom-media';

export const config: Config = {
  namespace: 'ankh',
  taskQueue: 'async',
  sourceMap: true,
  plugins: [
    postcss({
      plugins: [
        postcssNesting(),
        postcssCustomMedia(),
      ],
    }),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      includeGlobalScripts: false,
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: '../node_modules/@ankh-studio/themes/dist', dest: 'themes' },
      ],
    },
  ],
};
