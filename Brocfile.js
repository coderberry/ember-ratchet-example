/* global require, module */

var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

app.import('vendor/ratchet/js/modals.js');
app.import('vendor/ratchet/js/popovers.js');
app.import('vendor/ratchet/js/segmented-controllers.js');
app.import('vendor/ratchet/js/sliders.js');
app.import('vendor/ratchet/js/toggles.js');

var fonts = pickFiles('vendor/ratchet/fonts', {
  srcDir: '/',
  files: ['ratchicons.eot', 'ratchicons.svg', 'ratchicons.ttf', 'ratchicons.woff'],
  destDir: '/fonts'
});

module.exports = mergeTrees([app.toTree(), fonts]);
