interface ImportMetaEnv {
  readonly PUBLIC_HOTEL_URL: string;
  readonly PUBLIC_RSVP_LINK: string;
  readonly PUBLIC_PINTEREST_LINK: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}