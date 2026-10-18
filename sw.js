// 나의 섬 — 오프라인 캐시 (먼저 캐시로 바로 열고, 뒤에서 새 버전을 받아 둬요)
var CACHE='island-v24';
var FILES=['./','./index.html','./icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(function(c){return c.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(res){if(res&&res.ok){c.put(e.request,res.clone());if(hit&&/index\.html$|\/$/.test(u.pathname)){Promise.all([hit.clone().text(),res.clone().text()]).then(function(t){if(t[0]!==t[1])self.clients.matchAll().then(function(cs){cs.forEach(function(x){x.postMessage({type:'updated'})})})}).catch(function(){})}}return res}).catch(function(){return hit});
    return hit||net})}));
});
