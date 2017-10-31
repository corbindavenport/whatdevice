// Service worker

// Build 22
'use strict';
importScripts('sw-toolbox.js');
toolbox.router.get('/*', toolbox.networkFirst, {
  networkTimeoutSeconds: 5
});