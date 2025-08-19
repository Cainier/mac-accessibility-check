const path = require('path');
const bindings = require('node-gyp-build');

module.exports = bindings(path.join(__dirname));