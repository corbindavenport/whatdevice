// Service worker

// Build 27
'use strict';
importScripts('sw-toolbox.js');
toolbox.router.get('/*', toolbox.networkFirst, {
  networkTimeoutSeconds: 5
});