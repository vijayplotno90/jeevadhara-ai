/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Note: the experimental.serverActions.bodySizeLimit option from Next 14 is
// gone in 16 (Server Actions are stable, no longer under `experimental`).
// We don't use Server Actions yet -- the listing-optimization agent takes
// its image upload through a normal API route (app/api/*/route.ts), where
// body size isn't capped by this config at all. Revisit only if we add a
// Server Action that needs a larger-than-default body.
