import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: any = {
  serverExternalPackages: ['pdf2json', 'mammoth', 'underscore', 'lop'],
  images: {
    formats: ['image/webp'],
  },

  // This must be here to stop the "Blocked cross-origin" error
  allowedDevOrigins: ['giver-molar-judiciary.ngrok-free.dev'],
  experimental: {
    serverActions: {
      allowedOrigins: ['giver-molar-judiciary.ngrok-free.dev'],
    },
  },


  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "your-org",
  project: "cvmatch-pro",
  silent: true,
});



