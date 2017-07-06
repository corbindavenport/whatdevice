// Service worker

'use strict';
importScripts('sw-toolbox.js');
toolbox.precache(['index.html','css/*','js/*']);
toolbox.router.get('/*', toolbox.networkFirst, {
  networkTimeoutSeconds: 5
});