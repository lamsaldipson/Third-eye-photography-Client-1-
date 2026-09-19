/// <reference types="@cloudflare/workers-types" />

// Ambient bindings available via getCloudflareContext().env when this app
// is running on Cloudflare Workers (opennextjs-cloudflare preview/deploy).
// These are declared by hand to match wrangler.jsonc; if you add or rename
// bindings there, regenerate with:
//   npm run cf-typegen
interface CloudflareEnv {
  DATA_KV: KVNamespace;
  UPLOADS_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  ADMIN_PASSWORD?: string;
}
