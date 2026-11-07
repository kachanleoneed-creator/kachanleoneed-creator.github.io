(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
$$('.st').forEach(function(el){var t=(el.textContent||'').replace(/\s+/g,' ').trim();if(t.indexOf('В наличии')===0&&!/нет/i.test(t))el.classList.add('st-in')});
var fmt=function(n){return n.toLocaleString('ru-RU')+' ₽'};
/* season */
function setS(s,u){document.body.classList.toggle('w',s==='w');if(u){document.body.classList.remove('r27f');void document.body.offsetWidth;document.body.classList.add('r27f');setTimeout(function(){document.body.classList.remove('r27f')},700);}try{localStorage.setItem('ehs',s)}catch(e){}
 $$('a[href="p-yarbo-snow-blower.html"],a[href="zima-snow-blower.html"]').forEach(function(a){if(!a.dataset.oh)a.dataset.oh=a.getAttribute('href');a.setAttribute('href',s==='w'?'zima-snow-blower.html':a.dataset.oh)});$$('a[href="check.html"],a[href="zima.html#zmap"]').forEach(function(a){if(!a.dataset.oc)a.dataset.oc=a.getAttribute('href');a.setAttribute('href',s==='w'?'zima.html#zmap':a.dataset.oc)});if(window.applyF)applyF();}
window.ehSeason=setS;(function(){var pg=location.pathname.split('/').pop(),ws=(localStorage.getItem('ehs')||new URLSearchParams(location.search).get('s'))==='w';if(ws&&pg==='p-yarbo-snow-blower.html')location.replace('zima-snow-blower.html');if(ws&&pg==='check.html')location.replace('zima.html#zmap');})();setS(localStorage.getItem('ehs')||(new URLSearchParams(location.search).get('s'))||((function(m){return m>=10||m<=2})(new Date().getMonth())?'w':'s'));
$$('.season .bs').forEach(function(b){b.onclick=function(){setS('s',1)}});
$$('.season .bw').forEach(function(b){b.onclick=function(){setS('w',1)}});
/* menu */
var bg=$('.burger');if(bg)bg.onclick=function(e){e.preventDefault();window.ehMenu&&window.ehMenu()};
/* toast */
function toast(t){var e=$('.toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},2200)}
/* cart */
function get(){try{return JSON.parse(localStorage.getItem('ehcart'))||[]}catch(e){return[]}}
function put(c){localStorage.setItem('ehcart',JSON.stringify(c));render()}
window.addCart=function(it){var c=get(),f=c.filter(function(x){return x.k===it.k})[0];if(f)f.q++;else{it.q=1;c.push(it)}put(c);toast('Добавлено в корзину: '+it.n)};
function render(){var c=get(),n=0,s=0;c.forEach(function(x){n+=x.q;s+=x.q*x.p});
 $$('.cnt').forEach(function(e){e.textContent=n;e.style.display=n?'grid':'none'});
 var h=c.length?c.map(function(x,i){return '<div class="ci"><div class="t" style="background-image:url(\''+x.i+'\')"></div><div style="flex:1"><b style="font-size:14px">'+x.n+'</b><div class="mut" style="font-size:12px">'+(x.o||'')+'</div><div style="font-weight:700">'+(x.p?fmt(x.p):'цена по запросу')+'</div></div><div class="q"><button data-i="'+i+'" data-d="-1">−</button>'+x.q+'<button data-i="'+i+'" data-d="1">+</button></div></div>'}).join(''):'<p class="mut" style="padding:30px 0">Корзина пуста. <a href="catalog.html" style="text-decoration:underline">В каталог →</a></p>';
 ['#cartls','#cartpage'].forEach(function(id){var l=$(id);if(!l)return;l.innerHTML=h;$$('button',l).forEach(function(b){b.onclick=function(){var c=get(),i=+b.dataset.i;c[i].q+=+b.dataset.d;if(c[i].q<1)c.splice(i,1);put(c)}})});
 $$('.ctot').forEach(function(e){e.textContent=fmt(s)})}
function openC(o){$('.drawer').classList.toggle('on',o);$('.shade').classList.toggle('on',o)}
$$('.opencart').forEach(function(b){b.onclick=function(e){e.preventDefault();openC(true)}});
$('.shade').onclick=function(){openC(false)};$('.drawer .x').onclick=function(){openC(false)};
$$('[data-add]').forEach(function(b){b.onclick=function(e){e.preventDefault();var d=JSON.parse(b.dataset.add);if(window.curOpt&&b.classList.contains('main'))d=curOpt();addCart(d);b.classList.add('ok');var s=b.querySelector('span');if(s&&b.classList.contains('cartb'))s.textContent='В корзине ✓'}});
render();window.addEventListener('storage',render);
/* order form */
var of=$('#orderf');if(of)of.onsubmit=function(e){e.preventDefault();if(!get().length){toast('Корзина пуста');return}localStorage.removeItem('ehcart');render();of.innerHTML='<h3>Спасибо! Это демо — заказ никуда не отправлен.</h3><p class="mut">На боевом сайте менеджер перезвонит в течение 15 минут (9:00–21:00).</p>'};
/* emilia */
var em=$('.emi .e');if(em)em.onclick=function(){$('.emi').classList.toggle('on')};
/* catalog filters */
var grid=$('#cgrid');if(grid){var st={b:'all',s:'auto',t:new URLSearchParams(location.search).get('t')||'all'};
 var qb=new URLSearchParams(location.search).get('b');if(qb)st.b=qb;
 window.applyF=function(){var ss=st.s==='auto'?(document.body.classList.contains('w')?'winter':'summer'):st.s,n=0;
  $$('.pc',grid).forEach(function(c){var ok=(st.b==='all'||c.dataset.b===st.b)&&(ss==='all'||c.dataset.s===ss||c.dataset.s==='both'||c.dataset.t==='acc')&&(st.t==='all'||c.dataset.t===st.t);c.style.display=ok?'':'none';if(ok)n++});
  $('#cn').textContent=n;$$('.chip[data-f]').forEach(function(ch){var v=st[ch.dataset.f];ch.classList.toggle('on',v===ch.dataset.v||(ch.dataset.f==='s'&&st.s==='auto'&&ch.dataset.v===ss))})};
 $$('.chip[data-f]').forEach(function(ch){ch.onclick=function(){st[ch.dataset.f]=ch.dataset.v;applyF()}});
  var tog=$('#cfiltTog'),cf=$('#cfilt');
  if(tog&&cf)tog.onclick=function(){var o=cf.classList.toggle('open');tog.setAttribute('aria-expanded',o?'true':'false')};
  applyF();}
/* product */
var po=$('#popts');if(po){var base=+po.dataset.base,info=JSON.parse(po.dataset.info);
 window.curOpt=function(){var add=0,names=[];$$('input:checked',po).forEach(function(i){add+=+i.dataset.p;if(+i.dataset.p||i.type==='checkbox')names.push(i.dataset.n)});
  return{k:info.k+'|'+names.join(','),n:info.n,i:info.i,p:base?base+add:0,o:names.join(' · ')}};
 function upd(){var o=curOpt();$('#pprice').textContent=base?fmt(o.p):'Цена по запросу'}
 $$('input',po).forEach(function(i){i.onchange=upd});upd();}
var gal=$('.gal');if(gal){$$('.thumbs button',gal).forEach(function(b){b.onclick=function(){$$('.thumbs button',gal).forEach(function(x){x.classList.remove('on')});b.classList.add('on');var m=$('.main',gal);
 if(b.dataset.v){m.innerHTML='<video autoplay muted loop playsinline controls></video>';loadV(b.dataset.v,function(u){$('video',m).src=u})}else{m.innerHTML='';m.style.backgroundImage='url(\''+b.dataset.i+'\')'}}})}
var VC={};window.V=function(k,d){fetch(d).then(function(r){return r.blob()}).then(function(bl){VC[k]=URL.createObjectURL(bl);(VC['_'+k]||[]).forEach(function(f){f(VC[k])})})};
window.loadV=function(k,cb){if(VC[k]&&typeof VC[k]==='string'){cb(VC[k]);return}(VC['_'+k]=VC['_'+k]||[]).push(cb);if(!VC['s'+k]){VC['s'+k]=1;var s=document.createElement('script');s.src='v/'+k+'.js';document.body.appendChild(s)}};
$$('video[data-v]').forEach(function(v){loadV(v.dataset.v,function(u){v.src=u})});
/* delivery */
var dc=$('#dcity');if(dc){function d(){var o=dc.options[dc.selectedIndex],w=+($('#dw')&&$('#dw').value||1);var c=document.querySelector('input[name=carr]:checked'),base=+String(o.dataset.c).replace(/\s/g,''),k=c&&base?+c.dataset.x:1,v=Math.round(base*k/100)*100,tn=c?c.parentNode.querySelector('span').title:'';$('#dres').innerHTML=(v?'<b>'+v.toLocaleString('ru-RU')+' ₽</b>':'<b>бесплатно</b>')+' · '+o.dataset.d+(c&&base?' · '+tn:'')+' <span class="ex">пример тарифа</span>'}dc.onchange=d;document.addEventListener('change',function(e){if(e.target.name==='carr')d()});d()}
/* card check */
var cc=$('#cardf');if(cc)cc.onsubmit=function(e){e.preventDefault();var v=$('#cardn').value.trim(),L={'090':['Бронза','2 года','скидка на расходники'],'007':['Серебро','2 года','зимнее хранение по клубной цене'],'042':['Золото','3 года','предложение на следующего робота'],'888':['Золото','3 года','новинки первыми']}[v];
 $('#cardr').innerHTML=L?'<div class="card" style="margin-top:16px"><span class="tag">Карта № '+v+'</span><h3 style="margin-top:10px">Уровень: '+L[0]+'</h3><p>Гарантия: '+L[1]+' · Открыто: '+L[2]+'</p></div>':'<p class="mut" style="margin-top:12px">Карта не найдена. Тестовые: 090 · 007 · 042 · 888</p>'};
/* quiz */
var qz=$('#quiz');if(qz){var ans={},steps=$$('.qs',qz),i=0;function show(){steps.forEach(function(s,j){s.style.display=j===i?'':'none'})}show();
 $$('.qs .chip',qz).forEach(function(c){c.onclick=function(){ans[c.parentNode.parentNode.dataset.k]=c.dataset.v;i++;if(i>=steps.length-1){res()}show()}});
 function res(){var r;if(ans.season==='snow'||ans.season==='both')r=['yarbo-core','Yarbo Core + модуль снегоуборщика'];else if(ans.relief==='slope')r=['lymow-one-plus','Lymow One Plus'];else if(ans.area==='s')r=['roboup-raccoon-2se','RoboUP Raccoon 2SE'];else if(ans.area==='xl')r=['yarbo-m1-pro','Yarbo M1 Pro'];else r=['hookii-neomow-x2','Hookii Neomow X2'];
  $('#qres').innerHTML='<span class="tag">Наш выбор</span><h2 style="margin:12px 0">'+r[1]+'</h2><div class="btns"><a class="btn red" href="p-'+r[0]+'.html">Смотреть модель</a><a class="btn ghost" href="check.html">Проверить участок</a></div>'}
 $('#qback')&&($('#qback').onclick=function(){i=0;ans={};show()});}
/* forms demo */
$$('form.demo-f').forEach(function(f){f.onsubmit=function(e){e.preventDefault();f.innerHTML='<p style="padding:20px 0"><b>Заявка принята (демо).</b> На боевом сайте она уйдёт менеджеру.</p>'}});
/* map */
if($('#map')&&window.L){var m=L.map('map',{crs:L.CRS.EPSG3395,attributionControl:false}).setView([55.75,37.0],16);
 L.control.attribution({prefix:false}).addAttribution('© Яндекс').addTo(m);var sat=L.tileLayer('https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}&lang=ru_RU',{maxZoom:19}).addTo(m);
 var osm=L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=ru_RU',{maxZoom:19});
 L.control.layers({'Спутник':sat,'Схема':osm}).addTo(m);
 var pts=[],poly=null,mk=[];function area(){if(pts.length<3)return 0;var R=6378137,a=0;for(var i=0;i<pts.length;i++){var p1=pts[i],p2=pts[(i+1)%pts.length];a+=(p2.lng-p1.lng)*Math.PI/180*(2+Math.sin(p1.lat*Math.PI/180)+Math.sin(p2.lat*Math.PI/180))}return Math.abs(a*R*R/2)}
 function draw(){if(poly)m.removeLayer(poly);poly=L.polygon(pts,{color:'#C41E3A',weight:3,fillOpacity:.25}).addTo(m);var a=Math.round(area());$('#marea').textContent=a?a.toLocaleString('ru-RU')+' м² · '+(a/100).toFixed(1)+' сот.':'—';
  var rec=a===0?'Поставьте минимум 3 точки':a<600?'RoboUP Raccoon 2SE':a<2500?'Hookii Neomow X2 / L':a<4000?'Lymow One Plus или Yarbo M1 Pro':'Yarbo — свяжемся для выезда';$('#mrec').textContent=rec}
 m.on('click',function(e){pts.push(e.latlng);mk.push(L.circleMarker(e.latlng,{radius:5,color:'#fff',fillColor:'#C41E3A',fillOpacity:1}).addTo(m));draw()});
 $('#mclr').onclick=function(){pts=[];mk.forEach(function(x){m.removeLayer(x)});mk=[];draw()};
 $('#mfind').onclick=function(){var q=$('#maddr').value;if(!q)return;fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ru&accept-language=ru&q='+encodeURIComponent(q)).then(function(r){return r.json()}).then(function(j){if(j[0])m.setView([+j[0].lat,+j[0].lon],18);else toast('Адрес не найден')}).catch(function(){toast('Поиск недоступен')})};}
})();
;(function(){var b=document.createElement('button');b.className='bat2top';b.setAttribute('aria-label','Наверх');b.innerHTML='<span class="bt-cap"></span><span class="bt-body"><span class="bt-fill"></span><span class="bt-pc">0%</span></span><span class="bt-up">↑</span>';document.body.appendChild(b);var f=b.querySelector('.bt-fill'),p=b.querySelector('.bt-pc');function u(){var h=document.documentElement.scrollHeight-innerHeight,v=h>0?Math.min(100,Math.round(scrollY/h*100)):0;f.style.height=v+'%';b.style.setProperty('--v',v+'%');p.textContent=v+'%';b.classList.toggle('on',scrollY>400)}addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u();b.onclick=function(){scrollTo({top:0,behavior:'smooth'})}})();

;(function(){var L=[["catalog.html","Каталог"],["podbor.html","Подбор робота"],["brands.html","Бренды"],["knowledge.html","Знания о технике"],["news.html","Новости"],["dealers.html","Дилерам"],["history.html","О нас"],["delivery.html","Доставка и оплата"],["contacts.html","Контакты"]];
var W=[["zima.html","❄ Мир Yarbo зимой"],["zima-snow-blower.html","Yarbo Snow Blower"],["p-yarbo-core.html","Yarbo Core"],["catalog.html","Зимний каталог"],["podbor.html","Подбор"],["service.html","Сервис и хранение"],["kb-yarbo-ili-snegouborshchik.html","Yarbo или снегоуборщик"],["delivery.html","Доставка и оплата"],["dealers.html","Дилерам"],["contacts.html","Контакты"]];var L0=L;
var cur=(location.pathname.split('/').pop()||'index.html');var m=document.createElement('div');m.className='mnu';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Меню');
var h='<div class="mnu-in"><nav class="mnu-l">';L.forEach(function(x,i){h+='<a href="'+x[0]+'" style="--i:'+i+'"'+(cur==x[0]||(x[0]=='delivery.html'&&cur=='payment.html')?' class="on" aria-current="page"':'')+'><span>'+x[1]+'</span><i>→</i></a>'});
h+='</nav><div class="mnu-b"><a class="mnu-ph" href="tel:+79771221280">8-977-122-12-80<small>ежедневно 9:00–21:00</small></a><div class="mnu-s"><a href="https://t.me/ElectroHUB_consult_bot" target="_blank" rel="noopener" aria-label="Telegram"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#26A5E4"/><path fill="#fff" d="M5.4 11.8l11.6-4.5c.5-.2 1 .1.8.9l-2 9.3c-.1.7-.5.8-1.1.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3.1 5.6-5c.2-.2 0-.3-.4-.1l-6.9 4.3-3-.9c-.6-.2-.7-.7.2-.9z"/></svg></a><a href="https://max.ru/id770500837792_2_bot" target="_blank" rel="noopener" aria-label="MAX"><svg viewBox="0 0 100 100"><defs><linearGradient id="mxm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3FB7FF"/><stop offset=".55" stop-color="#5B5BFF"/><stop offset="1" stop-color="#9B3DF2"/></linearGradient></defs><path fill="url(#mxm)" fill-rule="evenodd" d="M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z"/></svg></a><a href="https://vk.ru/electro_hub" target="_blank" rel="noopener" aria-label="ВКонтакте"><svg viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0077FF"/><path fill="#fff" d="M12.8 17c-5 0-7.9-3.4-8-9.1h2.5c.1 4.2 1.9 5.9 3.4 6.3V7.9h2.4v3.6c1.4-.2 2.9-1.8 3.4-3.6h2.3c-.4 2.2-2 3.8-3.2 4.5 1.2.6 3 2 3.7 4.6h-2.6c-.6-1.7-1.9-3-3.6-3.2V17z"/></svg></a></div></div></div>';
m.innerHTML=h;document.body.appendChild(m);var b=document.querySelector('.burger');
function set(o){m.classList.toggle('on',o);document.documentElement.classList.toggle('mnu-lock',o);if(b){b.classList.toggle('x',o);b.setAttribute('aria-expanded',o)}}
window.ehMenu=function(){var o=!m.classList.contains('on');if(o){var LL=document.body.classList.contains('w')?W:L0,nv=m.querySelector('.mnu-l'),q='';LL.forEach(function(x,i){q+='<a href="'+x[0]+'" style="--i:'+i+'"'+(cur==x[0]||(x[0]=='delivery.html'&&cur=='payment.html')?' class="on" aria-current="page"':'')+'><span>'+x[1]+'</span><i>→</i></a>'});nv.innerHTML=q}set(o)};
m.addEventListener('click',function(e){if(e.target===m||e.target.classList.contains('mnu-in'))set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
var hd=document.querySelector('.hdr');if(hd){var f=function(){hd.classList.toggle('sm',scrollY>40)};addEventListener('scroll',f,{passive:true});f()}
var dm=document.querySelector('.demo');if(dm){if(sessionStorage.getItem('demoX'))dm.remove();else{var x=document.createElement('button');x.className='demo-x';x.setAttribute('aria-label','Скрыть');x.textContent='×';x.onclick=function(){dm.remove();sessionStorage.setItem('demoX',1)};dm.appendChild(x)}}
})();

(function(){var L=[].slice.call(document.querySelectorAll('video[data-lv]'));if(!L.length)return;function go(v){if(v._l)return;v._l=1;loadV(v.dataset.lv,function(u){v.src=u;var p=v.play();p&&p.catch&&p.catch(function(){})})}
if(!('IntersectionObserver'in window)){L.forEach(go);return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.target.offsetParent!==null){go(e.target);io.unobserve(e.target)}})},{rootMargin:'300px'});L.forEach(function(v){io.observe(v)});
document.addEventListener('click',function(){setTimeout(function(){L.forEach(function(v){if(!v._l){io.unobserve(v);io.observe(v)}})},700)})})();

/* r25 desktop dock toggle */
(function(){var B=document.body,M=matchMedia('(min-width:861px)'),on=0;function f(){var v=M.matches&&scrollY>140;if(v!==!!on){on=v;B.classList.toggle('dk-on',v)}}addEventListener('scroll',f,{passive:true});M.addEventListener&&M.addEventListener('change',f);f()})();

/* r25 liquid drop */
(function(){var d=document,B=d.body;if(matchMedia('(prefers-reduced-motion: reduce)').matches||!Element.prototype.animate)return;
var s=d.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','0');s.setAttribute('height','0');s.style.position='absolute';s.innerHTML='<filter id="dkgoo"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter>';B.appendChild(s);
var g=d.createElement('div');g.className='dkg';g.innerHTML='<i></i><i></i><i></i>';B.appendChild(g);var I=g.children,run=[];
function go(on){run.forEach(function(a){a.cancel()});run=[];if(!matchMedia('(min-width:861px)').matches)return;var nv=d.querySelector('.hdr .nav'),y0=nv?nv.getBoundingClientRect().top+nv.offsetHeight/2:40,y1=innerHeight-54,T=760;
var k=[{transform:'translate3d(0,'+y0+'px,0) scale(9,.75)',opacity:.0,offset:0},{transform:'translate3d(0,'+y0+'px,0) scale(5,.8)',opacity:1,offset:.08},{transform:'translate3d(0,'+(y0+30)+'px,0) scale(1,1.15)',opacity:1,offset:.2},{transform:'translate3d(0,'+(y1-40)+'px,0) scale(.85,1.3)',opacity:1,offset:.68},{transform:'translate3d(0,'+y1+'px,0) scale(6,.9)',opacity:1,offset:.86},{transform:'translate3d(0,'+y1+'px,0) scale(9,1.1)',opacity:0,offset:1}];
if(!on)k=k.slice().reverse().map(function(f,i,a){return {transform:f.transform,opacity:f.opacity,offset:1-f.offset}});
run.push(I[0].animate(k,{duration:T,easing:'cubic-bezier(.45,0,.25,1)',fill:'none'}));
[1,2].forEach(function(n){var kk=k.map(function(f){return {transform:f.transform.replace(/scale\(([\d.]+),([\d.]+)\)/,function(m,a,b){return 'scale('+(a*(n==1?.55:.35))+','+(b*.6)+')'}),opacity:f.opacity,offset:f.offset}});run.push(I[n].animate(kk,{duration:T,delay:n*55,easing:'cubic-bezier(.45,0,.25,1)',fill:'none'}))})}
var last=B.classList.contains('dk-on');new MutationObserver(function(){var v=B.classList.contains('dk-on');if(v!==last){last=v;go(v)}}).observe(B,{attributes:true,attributeFilter:['class']});})();
