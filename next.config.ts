import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';
import { AppConfig } from './src/utils/AppConfig';

const getLoginPath = (locale: string) =>


  locale === AppConfig.defaultLocale ? '/onBoarding' : `/${locale}/onBoarding`;



// Check if we're on Windows and not in CI (where Docker will handle the build)
const isWindows = process.platform === 'win32';
const isCI = process.env.CI === 'true';
const useStandalone = !isWindows || isCI;

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  output: useStandalone ? 'standalone' : undefined, // Required for Docker deployment, skipped on Windows local builds
  outputFileTracingIncludes: {
    '/': [],
  },

  redirects: async () => [
    {
      source: '/',
      destination: getLoginPath(AppConfig.defaultLocale),
      permanent: true,
      basePath: false,
    },
  ],

  rewrites: async () => [
    {
      source: '/proxy/assets/:path*',
      destination: 'http://localhost:3002/assets/:path*',
    },
  ],
  headers: async () => [
    // Public assets served by Next (allow all origins)
    {
      source: '/assets/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        { key: 'Access-Control-Expose-Headers', value: 'Content-Length, Content-Type' },
      ],
    },
    {
      source: '/games/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        { key: 'Access-Control-Expose-Headers', value: 'Content-Length, Content-Type' },
      ],
    },
    {
      source: '/proxy/assets/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        { key: 'Access-Control-Expose-Headers', value: 'Content-Length, Content-Type' },
      ],
    },
    {
      source: '/api/proxy/assets',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        { key: 'Access-Control-Expose-Headers', value: 'Content-Length, Content-Type' },
      ],
    },
  ],
};

// Initialize the Next-Intl plugin
let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

// Conditionally enable bundle analysis
if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

// Sentry Webpack plugin disabled to avoid external package resolution issues

const nextConfig = configWithPlugins;
export default nextConfig;
