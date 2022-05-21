/*!
 * Generic Service Worker for Thorium projects
 * Version 1.2.0 November 2019
 * Copyright 2018-2020 Thorium builder.
*/

if (('serviceWorker' in navigator) && (window.location.protocol != "file:")) {
  if (navigator.serviceWorker.controller) {
    console.log('Thorium Service worker found');
  } else {
    navigator.serviceWorker.register('service-worker.js', {
      scope: './'
    }).then(function (reg) {
      console.log('Thorium Service worker registered for scope:' + reg.scope);
    });
  }
}
