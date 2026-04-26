// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://samandcaro2027.vercel.app/',
  env: {
    schema: {
      PUBLIC_RSVP_LINK: envField.string({ access: 'public', context: 'client' }),
      PUBLIC_HOTEL_URL: envField.string({ access: 'public', context: 'client' }),
    }
  }
});
