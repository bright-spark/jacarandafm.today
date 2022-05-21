/*!
 * Generic Service Worker for Thorium projects
 * Version 1.4 september, 2020
 * Copyright 2018-2020 Nymphide Lab.
*/


self.addEventListener('install', function(event) {
  event.waitUntil(preLoad());
  console.log('Thorium  Builder Service Worker Iniialized');
});

var preLoad = function(){
  console.log('Thorium  Builder Service Worker Installation');
  return caches.open('thorium-cache').then(function(cache) {
    return cache.addAll(['./','./offline.html', './index.html', './manifest.webmanifest']);
  });
}

self.addEventListener('fetch', function(event) {
  event.respondWith(checkResponse(event.request).catch(function() {
    console.log('Thorium  Builder Service Worker returned from cache : '+JSON.stringify(event.request,null,2));
    return returnFromCache(event.request)}
  ));
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response){
      console.log('Thorium  Builder Service Worker Response Status '+response.status+": "+response.url);
      if(response.status !== 404) {
        fulfill(response)
      } else {
        reject()
      }
    }, reject)
  });
};

var addToCache = function(request){
  return caches.open('thorium-cache').then(function (cache) {
    return fetch(request).then(function (response) {
      console.log('Thorium  Builder Service Worker Add to Cache '+response.url);
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request){
  return caches.open('thorium-cache').then(function (cache) {
    return cache.match(request).then(function (matching) {
     if(!matching || matching.status == 404) {
      if ((request)  && (request.url.indexOf('.php')!= -1)) { 
        console.log("service Worker returns network error");
        throw new TypeError('network-error');
      } else {
        console.log("service Worker returns offline page");
        return cache.match('offline.html');
      }
     } else {
      console.log("service Worker returns cached request");
       return matching
     }
    });
  });
};