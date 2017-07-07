// Service worker

'use strict';
importScripts('sw-toolbox.js');
toolbox.router.get('/*', toolbox.fastest, {
  networkTimeoutSeconds: 5
});