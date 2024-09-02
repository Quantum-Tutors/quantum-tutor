/** @type {import('next').NextConfig} */
import { i18n } from './next-i18next.config.mjs';

const nextConfig = {
  i18n,
  sassOptions: {
    includePaths: ['src'],
  },
};

export default nextConfig;
