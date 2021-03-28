const cacheName = 'V2';


//Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
    e.waitUntil(self.skipWaiting());
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
    console.log('Service Worker: Fetching All Pages');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                //Make copy of response
                const resCLone = res.clone();
                //Open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        //Add response to cache
                        cache.put(e.request, resCLone);
                    });
                return res;
            })
            .catch(err => caches.match(e.request).then(res => res))
    );
})