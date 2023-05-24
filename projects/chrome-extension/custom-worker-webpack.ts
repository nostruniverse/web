import type { Configuration } from 'webpack';

module.exports = {
  entry: { background: 'projects/chrome-extension/src/worker.ts' },
} as Configuration;