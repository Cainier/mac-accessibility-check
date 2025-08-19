const path = require('path');
const bindings = require('node-gyp-build');

const moduleExports = bindings(path.join(__dirname));

// Add default export for TypeScript compatibility
moduleExports.default = moduleExports;

module.exports = moduleExports;
