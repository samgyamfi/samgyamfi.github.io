const cacheName = 'V1';

const cacheAssets = [
    'index.html',
    'inner-page.html',
    'portfolio-details.html',
    './assets/css/style.css',
    './assets/js/main.js',
    './assets/img/hero-bg.jpg',
    './assets/img/profile-img.jpg'
];


//Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets)
            })
            .then(() => self.skipWaiting())
    )
})

//Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    //Remove Unwanted Cache
    e.waitUntil(
       caches.keys().then(cacheNames => {
           return Promise.all(
               cacheNames.filter(cache => {
                   if(cache !== cacheName){
                       console.log('Service Worker: Clearing Old Cache');
                       return caches.delete(cache);
                   }
               })
           )
       })
    )
});

//Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .catch(() => caches.match(e.request))
    );
})