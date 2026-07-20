// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://samandcaro2027.vercel.app/',

  env: {
    schema: {
      PUBLIC_RSVP_LINK: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_HOTEL_URL: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_PINTEREST_LINK: envField.string({ access: 'public', context: 'client' }),
    }
  },

  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()],
  },

  devToolbar: {
    enabled: false,
  },

  fonts: [{
    provider: fontProviders.google(),
    name: 'Caveat',
    cssVariable: '--font-caveat',
  }, {
    provider: fontProviders.google(),
    name: 'Inter',
    cssVariable: '--font-inter',
  }, {
    provider: fontProviders.google(),
    name: 'Cormorant Garamond',
    cssVariable: '--font-cormorant',
  }, {
    provider: fontProviders.local(),
    name: 'Boston Angel',
    cssVariable: '--font-boston',
    options: {
      variants: [{
        src: ['./src/assets/fonts/Boston-Angel-Regular.ttf'],
        weight: 'normal',
        style: 'normal',
      }]
    }
  }, {
    provider: fontProviders.local(),
    name: 'Dream Avenue',
    cssVariable: '--font-dream',
    options: {
      variants: [{
        src: ['./src/assets/fonts/Dream-Avenue-Regular.otf'],
        weight: 'normal',
        style: 'normal',
      }]
    }
  }],
});