# White-label property showcase

This is a reusable Next.js real-estate demo scaffold. The original property
experience, search, filters, lead capture, admin desk and Supabase inventory
integration are preserved, while public branding is controlled from one
configuration surface.

## Customise for a client

1. Copy `.env.example` to `.env.local`.
2. Set the `NEXT_PUBLIC_SITE_*` values for the client's name, copy, contact
   details, social links and colour palette.
3. Replace `public/brand/logo.svg` and `public/brand/favicon.svg` (or point the
   env vars at hosted assets).
4. Connect Supabase when live inventory and leads are needed. Without it, the
   demo renders with an empty inventory state and remains usable.

The typed configuration lives in `lib/site-config.ts`; CSS consumes the three
brand colour tokens automatically. This keeps a client handoff focused on
content and assets rather than component surgery.

## Run

```bash
npm install
npm run dev
```

The public site is at `/`; the internal workspace is at `/admin`.
