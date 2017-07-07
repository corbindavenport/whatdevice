// Service worker

'use strict';
importScripts('sw-toolbox.js');
toolbox.router.get('/*', global.toolbox.cacheFirst);