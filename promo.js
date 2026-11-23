/* Electro HUB · новогодняя акция (r46). Всё акционное выключается само с P.end или флагом P.on=false. */
(function(){
var P={
  on:true,                                   /* ручной флаг: false — выключить всю акцию */
  end:'2027-01-01T00:00:00+03:00',           /* доставка бесплатно до 31.12.2026 включительно */
  ticker:true,                               /* бегущая строка «СРОЧНО» */
  popup:true,                                /* всплывающая открытка */
  /* Новости бегущей строки: t — текст, h — ссылка, u — показывать до (не включительно), МСК */
  news:[
    {t:'Доставка по России бесплатно до 31 декабря',h:'index.html#nyd46',u:'2027-01-01T00:00:00+03:00'},
    {t:'Робот в подарок под ёлку',h:'index.html#gift43',u:'2027-01-11T00:00:00+03:00'},
    {t:'Пришлите фото участка — подберём робота',h:'index.html#ph43',u:'2027-01-11T00:00:00+03:00'}
  ],
  tg:'https://t.me/ElectroHUB_consult_bot',mx:'https://max.ru/id770500837792_2_bot',
  noPopup:/(^|\/)(cart|contacts)\.html$/       /* корзина/оформление и контакты — без открытки */
};
var d=document,R=d.documentElement,q=location.search,LS;try{LS=localStorage}catch(e){}
function now(){var m=/[?&]promoNow=([^&]+)/.exec(q);if(m){var t=Date.parse(decodeURIComponent(m[1]));if(!isNaN(t))return t}return Date.now()}
var T=now(),ON=P.on&&T<Date.parse(P.end);
function g(k){try{return LS&&+LS.getItem(k)||0}catch(e){return 0}}function s(k,v){try{LS&&LS.setItem(k,v)}catch(e){}}
window.EH_PROMO={on:ON,cfg:P};
if(ON)R.classList.add('ny-on');
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- бегущая строка (вставляется синхронно сразу после шапки: высота зарезервирована, без CLS) ---------- */
var N=P.news.filter(function(n){return P.on&&(!n.u||T<Date.parse(n.u))});
var me=d.currentScript;
if(P.ticker&&N.length&&me&&Date.now()-g('ehNytX')>864e5){
  var grp=N.map(function(n){return '<a href="'+n.h+'">'+n.t+'</a>'}).join('<i class="nyt-s" aria-hidden="true"></i>');
  me.insertAdjacentHTML('afterend','<div class="nyt" id="nyt" role="region" aria-label="Срочные новости"><div class="nyt-w"><span class="nyt-l"><i aria-hidden="true"></i>СРОЧНО</span><div class="nyt-v"><div class="nyt-tr"><div class="nyt-g">'+grp+'<i class="nyt-s" aria-hidden="true"></i></div><div class="nyt-g" aria-hidden="true">'+grp.replace(/<a /g,'<a tabindex="-1" ')+'<i class="nyt-s" aria-hidden="true"></i></div></div></div><button class="nyt-x" type="button" aria-label="Скрыть строку на сутки" title="Скрыть на сутки">×</button></div></div>');
  var nt=d.getElementById('nyt');
  nt.querySelector('.nyt-x').onclick=function(){s('ehNytX',Date.now());nt.remove()};
  var tr=nt.querySelector('.nyt-tr'),pt;
  function sp(){var w=tr.firstChild.offsetWidth;if(w)tr.style.setProperty('--d',Math.max(18,w/55).toFixed(1)+'s')}
  if(!rm){sp();addEventListener('load',sp);
    nt.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'){clearTimeout(pt);nt.classList.add('p')}},{passive:true});
    ['pointerup','pointercancel'].forEach(function(ev){nt.addEventListener(ev,function(e){if(e.pointerType!=='mouse'){clearTimeout(pt);pt=setTimeout(function(){nt.classList.remove('p')},2500)}},{passive:true})});
  }
}
if(!ON||!P.popup)return;
/* ---------- открытка ---------- */
var force=/[?&]promo=1(&|$)/.test(q),shown=false,SK='ehNyp';
function seen(){try{return sessionStorage.getItem(SK)}catch(e){return 0}}
function busy(){var a=d.activeElement;return R.classList.contains('mnu-lock')||R.classList.contains('nb-lock')||(d.body&&d.body.classList.contains('emv-open'))||d.querySelector('.zfz,.mnu.on,.nbs.on,.drawer.on,.shade.on,#cmpm.on,.emv-panel.is-open')||(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))}
function allowed(){return force||(!P.noPopup.test(location.pathname)&&!seen()&&Date.now()-g('ehNypX')>2592e5)}
if(!allowed())return;
var TG='<svg class="bm-i" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><circle cx="14" cy="14" r="12.4" fill="none" stroke="#fff" stroke-width="2"/><path fill="#fff" d="M19.9 8.6 17.9 18.7c-.15.7-.6.85-1.2.5l-3.2-2.4-1.55 1.5c-.17.17-.32.32-.66.32l.24-3.3 6-5.4c.26-.23-.06-.36-.4-.13l-7.4 4.66-3.2-1c-.7-.22-.7-.7.15-1.03l12.5-4.8c.58-.21 1.1.14.92 1.03z"/></svg>',MX='<svg class="bm-i" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><rect x="1.2" y="1.2" width="25.6" height="25.6" rx="7.5" fill="none" stroke="#fff" stroke-width="2.2"/><g transform="translate(6.6 6.6) scale(.148)"><path fill="#fff" fill-rule="evenodd" d="M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z"/></g></svg>';
function show(){if(shown)return;if(!force&&busy()){setTimeout(show,3000);return}shown=true;try{sessionStorage.setItem(SK,1)}catch(e){}
  var last=d.activeElement,el=d.createElement('div');el.className='nyp';
  el.innerHTML='<div class="nyp-bg"></div>'+(rm?'':'<canvas class="nyp-sn" aria-hidden="true"></canvas>')+'<div class="nyp-c" role="dialog" aria-modal="true" aria-labelledby="nyp-h" aria-describedby="nyp-d" tabindex="-1"><span class="nyp-gr" aria-hidden="true"></span><button class="nyp-x" type="button" aria-label="Закрыть">×</button><div class="nyp-im"><img src="media/r46/ny-delivery-640.svg" srcset="media/r46/ny-delivery-640.svg 640w, media/r46/ny-delivery.svg 1280w" sizes="(max-width:860px) 100vw, 560px" width="1280" height="720" alt="Подарочная коробка с роботом на санях у пункта выдачи — новогодняя доставка Electro HUB"></div><div class="nyp-b"><span class="nyp-k">До 31 декабря · СДЭК / Ozon</span><h2 id="nyp-h">Новогодняя доставка — <em>за наш счёт</em></h2><p id="nyp-d">Бесплатно по всей России до 31&nbsp;декабря. Довезём до пункта выдачи СДЭК или Ozon рядом с вами.</p><p class="nyp-s">Сани у Деда Мороза выдерживают роботов до 50&nbsp;кг.</p><div class="nyp-a"><a class="btn red" href="catalog.html">Выбрать робота</a><a class="btn-tg ic" href="'+P.tg+'" target="_blank" rel="noopener" aria-label="Telegram" title="Спросить в Telegram">'+TG+'<span>Спросить в Telegram</span></a><a class="btn-max ic" href="'+P.mx+'" target="_blank" rel="noopener" aria-label="MAX" title="Спросить в MAX">'+MX+'<span>MAX</span></a></div></div></div>';
  d.body.appendChild(el);R.classList.add('nyp-lock');
  var c=el.querySelector('.nyp-c'),stop=snow(el.querySelector('.nyp-sn'));
  requestAnimationFrame(function(){el.classList.add('on')});
  setTimeout(function(){var x=el.querySelector('.nyp-x');x&&x.focus({preventScroll:true})},60);
  function close(){if(!el)return;s('ehNypX',Date.now());stop();el.classList.remove('on');el.classList.add('off');R.classList.remove('nyp-lock');d.removeEventListener('keydown',kd,true);var e2=el;el=null;setTimeout(function(){e2.remove()},rm?0:320);if(last&&last.focus)try{last.focus({preventScroll:true})}catch(e){}}
  function kd(e){if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){var f=[].slice.call(c.querySelectorAll('a[href],button')),a=f[0],b=f[f.length-1];if(e.shiftKey&&d.activeElement===a){e.preventDefault();b.focus()}else if(!e.shiftKey&&d.activeElement===b){e.preventDefault();a.focus()}else if(!c.contains(d.activeElement)){e.preventDefault();a.focus()}}}
  d.addEventListener('keydown',kd,true);
  el.querySelector('.nyp-x').onclick=close;el.querySelector('.nyp-bg').onclick=close;
  /* свайп вниз */
  var y0=null,dy=0;
  c.addEventListener('touchstart',function(e){if(c.scrollTop>0)return;y0=e.touches[0].clientY;dy=0;c.style.transition='none'},{passive:true});
  c.addEventListener('touchmove',function(e){if(y0===null)return;dy=Math.max(0,e.touches[0].clientY-y0);c.style.transform='translateY('+dy+'px)'},{passive:true});
  c.addEventListener('touchend',function(){if(y0===null)return;y0=null;c.style.transition='';if(dy>90){close()}else{c.style.transform=''}},{passive:true});
}
function snow(cv){if(!cv)return function(){};var x=cv.getContext('2d'),W,H,dpr=Math.min(1.5,window.devicePixelRatio||1),run=true,raf,F=[],n=(navigator.hardwareConcurrency||4)<=4||innerWidth<600?40:70;
  function rs(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener('resize',rs);
  for(var i=0;i<n;i++)F.push({x:Math.random()*W,y:Math.random()*H,r:.8+Math.random()*2.2,v:.35+Math.random()*.9,w:Math.random()*6.28,o:.45+Math.random()*.5});
  var lt=0;function fr(t){if(!run)return;raf=requestAnimationFrame(fr);if(t-lt<30)return;lt=t;x.clearRect(0,0,W,H);x.fillStyle='#fff';
    for(var i=0;i<F.length;i++){var f=F[i];f.y+=f.v;f.w+=.02;f.x+=Math.sin(f.w)*.4;if(f.y>H+4){f.y=-4;f.x=Math.random()*W}x.globalAlpha=f.o;x.beginPath();x.arc(f.x,f.y,f.r,0,6.283);x.fill()}}
  raf=requestAnimationFrame(fr);
  function vis(){if(d.hidden){cancelAnimationFrame(raf)}else if(run){raf=requestAnimationFrame(fr)}}d.addEventListener('visibilitychange',vis);
  return function(){run=false;cancelAnimationFrame(raf);removeEventListener('resize',rs);d.removeEventListener('visibilitychange',vis)}}
function arm(){if(force){show();return}
  var t=setTimeout(show,25000);
  function sc(){var h=R.scrollHeight-innerHeight;if(h>0&&scrollY/h>=.5){removeEventListener('scroll',sc);clearTimeout(t);show()}}
  addEventListener('scroll',sc,{passive:true})}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',arm);else arm();
})();
