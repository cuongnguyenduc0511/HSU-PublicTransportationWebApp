/**
 * Created by Cuong Nguyen on 11/24/2016.
 */
var staticCacheName = 'pta-official-v1';
var contentImgsCache = 'pta-images-v1';

var allCaches = [
    staticCacheName,
    contentImgsCache
];

self.addEventListener("install",function(event){
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                'css/bootstrap.min.css',
                'css/pta.css',
                'css/normalize.css',
                '//fonts.googleapis.com/css?family=Lemonada:300,400,600,700&amp;subset=vietnamese',
                '//fonts.googleapis.com/css?family=Roboto+Slab',
                '//fonts.googleapis.com/css?family=Lobster',
                '//fonts.googleapis.com/css?family=Patrick+Hand+SC',
                'fonts/glyphicons-halflings-regular.eot',
                'fonts/glyphicons-halflings-regular.svg',
                'fonts/glyphicons-halflings-regular.ttf',
                'fonts/glyphicons-halflings-regular.woff',
                'fonts/glyphicons-halflings-regular.woff2',
                'js/jquery-3.1.1.min.js',
                'js/bootstrap.min.js',
                'js/main_pta.js',
                'js/spin.min.js',
                'index.html'
            ]);
        }).then(caches.open(contentImgsCache).then(function(cache) {
            return cache.addAll([
                'images/zone_images/quangtrung.PNG',
                'images/zone_images/tanvien.PNG',
                'images/zone_images/nguyenvantrang.PNG',
                'images/zone_images/caothang.PNG',
                'images/bus-icon.ico',
            ]);
        }))
    );
});

self.addEventListener("fetch",function(event){
    event.respondWith(caches.match(event.request)
        .then(function(response){
            if(response)
            {
                console.log('Found response in cache:', response);
                return response;
            }
            else
            {
                return fetch(event.request);
            }
        }));
});

self.addEventListener("activate",function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('pta-') &&
                        !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});