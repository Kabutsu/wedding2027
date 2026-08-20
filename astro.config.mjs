// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://samandcaro2027.vercel.app/',
  output: 'server',

  env: {
    schema: {
      PUBLIC_RSVP_LINK: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_HOTEL_URL: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_PINTEREST_LINK: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_SUPABASE_URL: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ access: 'public', context: 'client' }),
      SUPABASE_URL: envField.string({ access: 'secret', context: 'server' }),
      SUPABASE_ANON_KEY: envField.string({ access: 'secret', context: 'server' }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ access: 'secret', context: 'server' }),
      PUBLIC_MONZO_ME_LINK: envField.string({ access: 'public', context: 'client' }),
    }
  },

  integrations: [preact({ compat: true })],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['gsap'],
    },
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
  provider: fontProviders.google(),
  name: 'Gentium Plus',
  cssVariable: '--font-gentium',
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
    name: 'Slight',
    cssVariable: '--font-slight',
    options: {
      variants: [{
        src: ['./src/assets/fonts/Slight-Regular.ttf'],
        weight: 'normal',
        style: 'normal',
      }]
    }
  }, {
    provider: fontProviders.local(),
    name: 'Providence Sans',
    cssVariable: '--font-providence',
    options: {
      variants: [{
        src: ['./src/assets/fonts/Providence-Sans.otf'],
        weight: 'bold',
        style: 'normal',
      }]
    }
  }, {
    provider: fontProviders.local(),
    name: 'Roca',
    cssVariable: '--font-roca',
    options: {
      variants: [{
        src: ['./src/assets/fonts/Roca.otf'],
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

  adapter: vercel(),
});