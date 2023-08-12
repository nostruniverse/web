import type { Configuration } from 'webpack';

module.exports = {
  entry: { 
    background: {
      import: 'projects/chrome-extension/src/worker.ts',
      runtime: false
    },
    content: {
      import: 'projects/chrome-extension/src/content.ts',
      runtime: false
    }
  },
} as Configuration;