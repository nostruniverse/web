const path = require('path');

module.exports = {
  entry: './src/worker.js',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'worker.js',
  },
};