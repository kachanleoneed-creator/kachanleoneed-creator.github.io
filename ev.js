/* r54: встроенные видео — играют по тапу, одновременно только одно */
(function(){
var T=[].slice.call(document.querySelectorAll('.ev[data-ev]'));if(!T.length)return;
function ld(k,cb){if(window.loadV)return window.loadV(k,cb);var s=document.createElement('script');window.V=window.V||function(n,d){fetch(d).then(function(r){return r.blob()}).then(function(b){cb(URL.createObjectURL(b))})};s.src='v/'+k+'.js';document.body.appendChild(s)}
function load(t,cb){if(t._u){cb&&cb();return}if(cb)(t._q=t._q||[]).push(cb);if(t._l)return;t._l=1;
 ld(t.dataset.ev,function(u){if(t._u)return;t._u=u;var v=t._v;v.preload='metadata';v.src=u;var q=t._q||[];t._q=[];q.forEach(function(f){f()})})}
function start(t){var v=t._v;v.controls=true;t.classList.add('on');var p;try{p=v.play()}catch(e){}if(p&&p.catch)p.catch(function(){t.classList.remove('wait');t.classList.add('ask')})}
T.forEach(function(t){var v=t._v=t.querySelector('video'),b=t.querySelector('.ev-play');
 function go(e){if(e){e.preventDefault();e.stopPropagation()}if(t.classList.contains('pl'))return;
  if(t._u){start(t);return}
  try{v.load()}catch(_){} /* разблокировка элемента в жесте (iOS) */
  t.classList.add('wait');load(t,function(){start(t)})}
 b.addEventListener('click',go);
 t.addEventListener('click',function(e){if(e.target===v&&v.controls)return;if(!t.classList.contains('pl'))go(e)});
 ['pointerenter','touchstart'].forEach(function(n){t.addEventListener(n,function(){load(t)},{passive:true,once:true})});
 v.addEventListener('play',function(){T.forEach(function(o){if(o!==t&&!o._v.paused)o._v.pause()});t.classList.add('on','pl');t.classList.remove('ask')});
 v.addEventListener('playing',function(){t.classList.remove('wait')});
 v.addEventListener('pause',function(){t.classList.remove('pl','wait')});
 v.addEventListener('ended',function(){t.classList.remove('pl')});
});
document.addEventListener('visibilitychange',function(){if(document.hidden)T.forEach(function(t){t._v.paused||t._v.pause()})});
})();
