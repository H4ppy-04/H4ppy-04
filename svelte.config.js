import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const extensions = ['.svelte', '.md'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    paths: {
      base: '',
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
    }),
    prerender: {
      handleHttpError: 'warn',
    },
  },
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: extensions,
      rehypePlugins: [
        rehypeExternalLinks,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            properties: {
              className: ['heading-link'],
              title: 'Permalink',
              ariaHidden: 'true',
            },
            content: {
              type: 'element',
              tagName: 'span',
              properties: {},
              children: [{ type: 'text', value: '#' }],
            },
          },
        ],
      ],
    }),
  ],
  extensions: extensions,
};

export default config;
