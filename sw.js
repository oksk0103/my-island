// 나의 섬 — 오프라인 캐시 (먼저 캐시로 바로 열고, 뒤에서 새 버전을 받아 둬요)
var CACHE='island-072be36a36';
var AUDC='island-aud-1',BLOBC='island-blob-1';
var FILES=['./','./index.html','./icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k!==AUDC&&k!==BLOBC}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // 녹음 파일은 따로 오래 보관해요 (새 버전이 나와도 다시 받지 않게)
  // 그림·소리 파일은 이름에 내용 지문이 있어서 한 번 받으면 바뀌지 않아요
  if(/\/b\//.test(u.pathname)){e.respondWith(caches.open(BLOBC).then(function(c){return c.match(e.request).then(function(hit){return hit||fetch(e.request).then(function(res){if(res&&res.ok)c.put(e.request,res.clone());return res})})}));return}
  if(/\/(aud|stroke)\//.test(u.pathname)){e.respondWith(caches.open(AUDC).then(function(c){return c.match(e.request,{ignoreSearch:true}).then(function(hit){return hit||fetch(e.request).then(function(res){if(res&&res.ok)c.put(e.request,res.clone());return res})})}));return}
  e.respondWith(caches.open(CACHE).then(function(c){return c.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(res){if(res&&res.ok){c.put(e.request,res.clone());if(hit&&/index\.html$|\/$/.test(u.pathname)){Promise.all([hit.clone().text(),res.clone().text()]).then(function(t){if(t[0]!==t[1])self.clients.matchAll().then(function(cs){cs.forEach(function(x){x.postMessage({type:'updated'})})})}).catch(function(){})}}return res}).catch(function(){return hit});
    return hit||net})}));
});
