/* r55: «Видео клиентов» — карточки 9:16, лента со свайпом, просмотр в лайтбоксе прямо на сайте */
(function(){
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
[].forEach.call(document.querySelectorAll('.vt'),function(w){var tr=w.querySelector('.vt-tr'),p=w.querySelector('.vt-p'),n=w.querySelector('.vt-n');if(!tr)return;
 function upd(){var o=tr.scrollWidth>tr.clientWidth+4;w.classList.toggle('ovf',o);if(p){p.disabled=tr.scrollLeft<4;n.disabled=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4}}
 function go(d){var c=tr.querySelector('.vc'),st=c?c.getBoundingClientRect().width+16:300;tr.scrollBy({left:d*st,behavior:RM?'auto':'smooth'})}
 if(p){p.addEventListener('click',function(){go(-1)});n.addEventListener('click',function(){go(1)})}
 tr.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();setTimeout(upd,600)});
var C=[].slice.call(document.querySelectorAll('.vc[data-ev]'));if(!C.length)return;
function ld(k,cb){if(window.loadV)return window.loadV(k,cb);var Q=window.__evq=window.__evq||{};if(Q[k]&&Q[k].u){cb(Q[k].u);return}
 if(!Q[k]){Q[k]={c:[]};window.V=window.V||function(n,d){fetch(d).then(function(r){return r.blob()}).then(function(b){var q=Q[n];q.u=URL.createObjectURL(b);q.c.forEach(function(f){f(q.u)})})};var s=document.createElement('script');s.src='v/'+k+'.js';document.body.appendChild(s)}Q[k].c.push(cb)}
var X='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',PL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="#fff" stroke="none"/></svg>';
var lb,v,fr,cb,cc,list=[],cur=-1,back=null,pushed=false,tok=0;
function build(){lb=document.createElement('div');lb.className='vlb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Просмотр видео');
 lb.innerHTML='<div class="vlb-bg"></div><div class="vlb-box"><div class="vlb-fr"><video playsinline webkit-playsinline controls preload="none" controlslist="nodownload noplaybackrate" disablepictureinpicture></video><span class="vlb-sp" aria-hidden="true"></span><button class="vlb-go" type="button" aria-label="Воспроизвести">'+PL+'</button></div>'
 +'<div class="vlb-bar"><button class="vlb-a vlb-p" type="button" aria-label="Предыдущее видео"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><div class="vlb-cap"><b></b><span class="vc-chip"></span></div><button class="vlb-a vlb-n" type="button" aria-label="Следующее видео"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div></div>'
 +'<button class="vlb-x" type="button" aria-label="Закрыть">'+X+'</button>';
 document.body.appendChild(lb);v=lb.querySelector('video');fr=lb.querySelector('.vlb-fr');cb=lb.querySelector('.vlb-cap b');cc=lb.querySelector('.vlb-cap .vc-chip');
 lb.querySelector('.vlb-bg').addEventListener('click',function(){close()});lb.querySelector('.vlb-x').addEventListener('click',function(){close()});
 lb.querySelector('.vlb-p').addEventListener('click',function(){show(cur-1)});lb.querySelector('.vlb-n').addEventListener('click',function(){show(cur+1)});
 lb.querySelector('.vlb-go').addEventListener('click',function(){lb.classList.remove('ask');var p=v.play();p&&p.catch&&p.catch(function(){lb.classList.add('ask')})});
 v.addEventListener('waiting',function(){lb.classList.add('ld')});v.addEventListener('playing',function(){lb.classList.remove('ld','ask')});
 v.addEventListener('ended',function(){if(list.length>1&&cur<list.length-1)show(cur+1)});
 var sx=0,sy=0;fr.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY},{passive:true});
 fr.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dy)<45&&list.length>1)show(cur+(dx<0?1:-1));else if(dy>110&&Math.abs(dx)<50)close()},{passive:true});
 document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='ArrowRight'&&e.target.tagName!=='VIDEO')show(cur+1);else if(e.key==='ArrowLeft'&&e.target.tagName!=='VIDEO')show(cur-1);
  else if(e.key==='Tab'){var f=[].slice.call(lb.querySelectorAll('button:not([disabled]),video')).filter(function(x){return x.offsetParent});if(!f.length)return;var i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
 window.addEventListener('popstate',function(){if(!lb.hidden){pushed=false;close(1)}})}
function show(i){if(!list.length)return;cur=(i+list.length)%list.length;var c=list[cur],my=++tok;
 fr.style.setProperty('--r',c.dataset.r||'9/16');cb.textContent=c.querySelector('.vc-cap b').textContent;cc.textContent=c.querySelector('.vc-chip').textContent;
 lb.classList.toggle('one',list.length<2);v.pause();v.removeAttribute('src');var im=c.querySelector('img');v.poster=im?im.currentSrc||im.src:'';lb.classList.add('ld');lb.classList.remove('ask');
 try{v.load()}catch(_){} /* жест пользователя: разблокировка элемента (iOS) */
 ld(c.dataset.ev,function(u){if(my!==tok||lb.hidden)return;v.src=u;var p;try{p=v.play()}catch(_){}if(p&&p.catch)p.catch(function(){if(my===tok){lb.classList.remove('ld');lb.classList.add('ask')}})})}
function open(c){if(!lb)build();var g=c.closest('[data-vg]');list=[].slice.call((g||document).querySelectorAll('.vc[data-ev]'));back=c;
 [].forEach.call(document.querySelectorAll('video'),function(x){if(x!==v&&!x.paused&&!x.muted)x.pause()});
 lb.hidden=false;document.documentElement.classList.add('vlb-on');void lb.offsetWidth;lb.classList.add('on');show(list.indexOf(c));
 try{history.pushState({vlb:1},'');pushed=true}catch(_){}
 lb.querySelector('.vlb-x').focus({preventScroll:true})}
function close(fromPop){if(!lb||lb.hidden)return;tok++;v.pause();v.removeAttribute('src');try{v.load()}catch(_){}lb.classList.remove('on','ask','ld');lb.hidden=true;document.documentElement.classList.remove('vlb-on');
 if(pushed&&!fromPop){pushed=false;try{history.back()}catch(_){}}if(back)back.focus({preventScroll:true})}
C.forEach(function(c){c.addEventListener('click',function(e){e.preventDefault();open(c)});
 ['pointerenter','touchstart','focus'].forEach(function(n){c.addEventListener(n,function(){ld(c.dataset.ev,function(){})},{passive:true,once:true})})});
document.addEventListener('visibilitychange',function(){if(document.hidden&&v&&!v.paused)v.pause()});
})();
